import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('[AI-CHAT] Received message:', message);

    // Fetch jobs and categories from backend MongoDB
    let jobs: any[] = [];
    let categories: any[] = [];

    try {
      // Fetch jobs (limit to recent 50 for context)
      const jobsResponse = await fetch(`${BACKEND_API_URL}/api/jobs?page=1&size=50`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        jobs = jobsData.data?.jobs || jobsData.jobs || [];
        console.log(`[AI-CHAT] Fetched ${jobs.length} jobs from backend`);
      }

      // Fetch categories
      const categoriesResponse = await fetch(`${BACKEND_API_URL}/api/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        categories = categoriesData.data || categoriesData.categories || [];
        console.log(`[AI-CHAT] Fetched ${categories.length} categories from backend`);
      }
    } catch (fetchError) {
      console.error('[AI-CHAT] Error fetching data from backend:', fetchError);
      // Continue with empty data - AI can still respond to general questions
    }

    // Build context-aware prompt for Ollama
    const systemPrompt = buildSystemPrompt(jobs, categories);
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

    console.log('[AI-CHAT] Sending prompt to Ollama...');

    // Send to Ollama
    try {
      const ollamaResponse = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: fullPrompt,
          stream: false,
        }),
      });

      if (!ollamaResponse.ok) {
        throw new Error(`Ollama API returned status ${ollamaResponse.status}`);
      }

      const ollamaData: OllamaResponse = await ollamaResponse.json();
      const aiReply = ollamaData.response.trim();

      console.log('[AI-CHAT] Received response from Ollama');

      return NextResponse.json({ reply: aiReply });
    } catch (ollamaError) {
      console.error('[AI-CHAT] Ollama API error:', ollamaError);

      // Fallback response if Ollama is down
      const fallbackReply = generateFallbackResponse(message, jobs, categories);
      return NextResponse.json({
        reply: fallbackReply,
        fallback: true,
        error: 'AI service temporarily unavailable',
      });
    }
  } catch (error) {
    console.error('[AI-CHAT] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Build a context-aware system prompt with available jobs and categories
 */
function buildSystemPrompt(jobs: any[], categories: any[]): string {
  const jobSummary = jobs.slice(0, 10).map((job) => ({
    title: job.jobTitle,
    company: job.companyName,
    location: job.jobLocation,
    type: job.jobType,
    category: job.jobCategory?.name || 'N/A',
  }));

  const categoryNames = categories.map((cat) => cat.name).join(', ');

  return `You are JobMitra AI Assistant, a helpful virtual assistant for a job portal platform called JobMitra.

Your role is to help users with:
1. General information about JobMitra platform
2. Available job categories: ${categoryNames || 'Various categories'}
3. Current job openings (we currently have ${jobs.length} active jobs)
4. Answering FAQs about job searching, applications, and the platform

Here are some recent job openings for reference:
${JSON.stringify(jobSummary, null, 2)}

Guidelines:
- Be friendly, professional, and concise
- If asked about specific jobs, mention the job title, company, and location
- If asked about job categories, list them clearly
- For questions outside your scope, politely redirect to contacting support
- Keep responses under 150 words for better readability
- Do not make up information - only use the data provided

Answer the following user question based on the context above:`;
}

/**
 * Generate a fallback response when Ollama is unavailable
 */
function generateFallbackResponse(message: string, jobs: any[], categories: any[]): string {
  const lowerMessage = message.toLowerCase();

  // FAQ responses
  if (lowerMessage.includes('how') && (lowerMessage.includes('apply') || lowerMessage.includes('job'))) {
    return "To apply for a job on JobMitra, browse available jobs, click on a job card to view details, and click the 'Apply Now' button. You'll need to be logged in and have your profile updated with your resume.";
  }

  if (lowerMessage.includes('category') || lowerMessage.includes('categories')) {
    const categoryList = categories.map((c) => c.name).join(', ');
    return `We currently have jobs in the following categories: ${categoryList || 'Technology, Marketing, Finance, Healthcare, and more'}. You can filter jobs by category on the jobs page.`;
  }

  if (lowerMessage.includes('job') && (lowerMessage.includes('available') || lowerMessage.includes('open'))) {
    return `We currently have ${jobs.length} active job openings across various industries and locations. You can browse all jobs on our jobs page and filter by category, location, and job type.`;
  }

  if (lowerMessage.includes('register') || lowerMessage.includes('sign up')) {
    return "You can register as either a Job Seeker (Talent) or Employer (Recruiter) on JobMitra. Click the 'Register' button and choose your account type. You can also sign up using your Google account for faster registration.";
  }

  if (lowerMessage.includes('profile') || lowerMessage.includes('update')) {
    return "You can update your profile by navigating to the Profile section after logging in. Add your experience, education, skills, and upload your resume to make your profile stand out to employers.";
  }

  // Default fallback
  return `Thank you for your message! I'm the JobMitra AI Assistant. I can help you with information about our ${jobs.length} available jobs, job categories, and platform features. The AI service is currently initializing. How can I assist you today?`;
}
