'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Clock, Layers, Wallet, Code, TrendingUp, Check, Bot } from 'lucide-react';
import { handleGetAllJobs } from '@/lib/actions/job-actions';
import toast from 'react-hot-toast';

type Filters = {
  fullTime: boolean;
  freelance: boolean;
  parttime: boolean;
  remote: boolean;
  experience: string;
};

type JobIcon = 'TrendingUp' | 'Clock' | 'Layers' | 'Wallet' | 'Code' | 'Bot';

type Job = {
  id: string;
  jobTitle: string;
  companyName: string;
  jobType?: string;
  experienceLevel?: string;
  tags?: string[];
  matchScore?: number;
  isRecommended?: boolean;
  isNew?: boolean;
  companyProfilePicPath?: string;
  icon?: JobIcon;
  salary?: number;
  _id?: string;
  jobLocation?: string;
  jobCategory?: string;
  status?: string;
  createdAt?: string;
};

type SortBy = 'Match Score (Highest)' | 'Salary';

export default function AIJobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    fullTime: false,
    freelance: false,
    parttime: false,
    remote: false,
    experience: 'Any Level'
  });

  const isUserLoggedIn = typeof window !== 'undefined' && 
    !!localStorage.getItem('user') && 
    !!localStorage.getItem('jobmitra_token');

  const [activeTab, setActiveTab] = useState<'all' | 'recommended'>('all');
  const sortBy: SortBy = 'Match Score (Highest)';
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, size: 100, totalPages: 0 });

  const observerRef = useRef<IntersectionObserver | null>(null);

  const iconMap = { TrendingUp, Clock, Layers, Wallet, Code, Bot };
  const jobTypeFilters: Array<keyof Pick<Filters, 'fullTime' | 'freelance' | 'parttime' | 'remote'>> = [
    'fullTime',
    'freelance',
    'parttime',
    'remote'
  ];

  // Initialize search query from URL params
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await handleGetAllJobs(currentPage, 100); // Fetch large batch for client-side filtering
        console.log('Fetched jobs response:', response);

        if (response.success) {
          const normalizedJobs: Job[] = response.data.map((job: any, idx: number) => ({
            id: job._id || `job-${idx}`,
            _id: job._id,
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            jobType: job.jobType,
            experienceLevel: job.experienceLevel,
            tags: job.tags || [],
            companyProfilePicPath: job.companyProfilePicPath,
            jobLocation: job.jobLocation,
            jobCategory: job.jobCategory,
            status: job.status,
            createdAt: job.createdAt,
            // Calculate match score based on job status or randomly for demo
            matchScore: job.status === 'active' ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40) + 50,
            isRecommended: job.status === 'active', // Active jobs are recommended
            isNew: new Date(job.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000, // Jobs created in last 7 days
          }));

          setJobs(normalizedJobs);
          
          if (response.metadata) {
            setMetadata(response.metadata);
          }
        } else {
          toast.error(response.message || 'Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage]);

  // Scroll reveal effect
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        if (!(target instanceof HTMLElement)) return;

        const indexKey = target.dataset.index;
        if (!indexKey) return;

        setVisibleCards(prev => new Set([...prev, indexKey]));
      });
    }, options);

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => {
      if (observerRef.current) observerRef.current.observe(el);
    });

    // Add initial visible cards
    setVisibleCards(prev => new Set([
      ...prev,
      'header',
      'subtitle',
      'sidebar',
      'loadmore',
      'search-bar',
      ...jobs.map((_, i) => `job-${i}`),
    ]));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [jobs]);

  const handleCheckboxChange = (field: keyof Pick<Filters, 'fullTime' | 'freelance' | 'parttime' | 'remote'>) => {
    setFilters(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Filtered & sorted jobs
  const displayedJobs = jobs
    .filter(job => {
      if (activeTab === 'recommended' && job.isRecommended === false) return false;
      if (filters.fullTime && !job.jobType?.toLowerCase().includes('full')) return false;
      if (filters.freelance && !job.jobType?.toLowerCase().includes('free')) return false;
      if (filters.parttime && !job.jobType?.toLowerCase().includes('part')) return false;
      if (filters.remote && !job.jobType?.toLowerCase().includes('remote')) return false;
      if (filters.experience !== 'Any Level' && job.experienceLevel !== filters.experience) return false;
      return true;
    })
    .filter(job => (job.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'Match Score (Highest)') return (b.matchScore || 0) - (a.matchScore || 0);
      if (sortBy === 'Salary') return (b.salary || 0) - (a.salary || 0);
      return 0;
    })
    .slice(0, visibleCount);

  // Reusable JobCard
  const JobCard = ({ job, index }: { job: Job; index: number }) => {
    const IconComponent = job.icon && iconMap[job.icon] ? iconMap[job.icon] : TrendingUp;
    return (
      <div
        className="bg-white dark:bg-[#1E1F55]/40 border border-gray-200 dark:border-white/15 backdrop-blur-md rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 scroll-reveal opacity-0 translate-y-8"
        data-index={`job-${index}`}
        style={{
          opacity: visibleCards.has(`job-${index}`) ? 1 : 0,
          transform: visibleCards.has(`job-${index}`) ? 'translateY(0)' : 'translateY(30px)',
          transitionDelay: `${index * 100}ms`
        }}
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
            {job.companyProfilePicPath ? (
              <img
                src={job.companyProfilePicPath}
                alt={job.companyName || 'Company'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-100 text-lg text-purple-700 dark:bg-[#9B7BFF]/30 dark:text-white">
                <TrendingUp size={24} />
              </div>
            )}
          </div>

          {job.isNew && (
            <span className="text-xs font-semibold text-[#9B7BFF] border border-[#9B7BFF]/50 px-3 py-1 rounded-full">
              New
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">{job.jobTitle || 'No Title'}</h3>
        <p className="text-sm text-slate-500 dark:text-[#BDBDEB]">{job.companyName || 'No Company'}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {(job.tags || []).map((tag, idx) => (
            <span
              key={idx}
              className={`text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 dark:bg-[#1E1F55] dark:text-white`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4">
          {activeTab === 'recommended' && (
            <>
              <p className="text-sm font-semibold text-slate-600 dark:text-[#BDBDEB] mb-1">
                AI Match Score: {job.matchScore?.toFixed(0) || 0}%
              </p>
              <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-[#1E1F55]/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#00E1FF] dark:from-[#9B7BFF] dark:to-[#00E1FF] transition-all duration-1000"
                  style={{ width: visibleCards.has(`job-${index}`) ? `${job.matchScore?.toFixed(0) || 0}%` : '0%' }}
                ></div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => router.push(`/viewjob/${job.id}`)}
          className="w-full mt-5 py-2 rounded-full font-bold text-white bg-primary hover:bg-[#6b2fd0] dark:bg-[#1E1F55] dark:hover:bg-[#9B7BFF] shadow-sm hover:shadow-md transition-all duration-300"
        >
          Apply Now
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-gray-200 font-sans transition-colors duration-300 pt-0">
      <div className="mx-auto px-6 sm:px-8 max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div
              className="p-6 rounded-2xl bg-white/5 dark:bg-[#1E1F55]/40 border border-gray-200/10 dark:border-white/15 backdrop-blur-md shadow-lg sticky top-24 space-y-6 scroll-reveal opacity-0 translate-y-8 transition-all duration-700"
              data-index="sidebar"
              style={{
                opacity: visibleCards.has('sidebar') ? 1 : 0,
                transform: visibleCards.has('sidebar') ? 'translateY(0)' : 'translateY(30px)'
              }}
            >
              <h3 className="text-xl font-bold mb-4 border-b border-gray-200/10 dark:border-white/10 pb-3">Job Filters</h3>
              {/* Job Type */}
              <div>
                <h4 className="font-semibold text-slate-600 dark:text-[#BDBDEB] mb-3 flex items-center">
                  <Clock className="mr-2 text-[#9B7BFF]" size={18} />
                  Job Type
                </h4>
                <div className="space-y-2 text-sm">
                  {jobTypeFilters.map((type) => (
                    <label key={type} className="block relative pl-7 cursor-pointer group">
                      <span className="capitalize">{type === 'fullTime' ? 'Full-time' : type}</span>
                      <input
                        type="checkbox"
                        checked={filters[type]}
                        onChange={() => handleCheckboxChange(type)}
                        className="absolute left-0 opacity-0 h-0 w-0"
                      />
                      <span
                        className={`absolute top-0 left-0 h-5 w-5 rounded-md border flex items-center justify-center transition-all duration-300 ${
                          filters[type]
                            ? 'bg-[#9B7BFF] border-[#9B7BFF]'
                            : 'border-gray-300/40 bg-white/5 dark:bg-transparent'
                        }`}
                      >
                        {filters[type] && <Check size={14} className="text-[#1E1F55]" />}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Experience */}
              <div>
                <h4 className="font-semibold text-slate-600 dark:text-[#BDBDEB] mb-3 flex items-center">
                  <Layers className="mr-2 text-[#9B7BFF]" size={18} />
                  Experience
                </h4>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full p-2 rounded-lg bg-white/5 dark:bg-[#1E1F55] border border-gray-200/10 dark:border-white/15 text-sm focus:border-[#9B7BFF] focus:outline-none transition-colors"
                >
                  <option>Any Level</option>
                  <option>Entry Level</option>
                  <option>Mid-Level</option>
                  <option>Senior/Lead</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Search */}
            <div
              className="mb-12 flex items-center gap-3 scroll-reveal opacity-0 translate-y-8 transition-all duration-700"
              data-index="search-bar"
              style={{
                opacity: visibleCards.has('search-bar') ? 1 : 0,
                transform: visibleCards.has('search-bar') ? 'translateY(0)' : 'translateY(30px)'
              }}
            >
              <Search className="text-[#9B7BFF] flex-shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-white/5 dark:bg-[#1E1F55] border-2 border-gray-200/10 dark:border-white/15 text-sm text-slate-900 dark:text-white placeholder-white/50 dark:placeholder-slate-400 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                className={`px-4 py-2 rounded-full font-bold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[#9B7BFF] text-[#1E1F55]'
                    : 'bg-white/5 dark:bg-[#1E1F55]/20 text-slate-900 dark:text-white'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Jobs
              </button>

              <button
                className={`px-4 py-2 rounded-full font-bold transition-colors ${
                  activeTab === 'recommended'
                    ? 'bg-[#9B7BFF] text-[#1E1F55]'
                    : 'bg-white/5 dark:bg-[#1E1F55]/20 text-slate-900 dark:text-white'
                }`}
                onClick={() => setActiveTab('recommended')}
              >
                Recommended
              </button>
            </div>

            {/* Job Cards */}
            {loading && <div className="text-center py-12 text-[#BDBDEB]">Loading jobs...</div>}

            {/* Login Prompt for Recommended Tab */}
            {!isUserLoggedIn && activeTab === 'recommended' && !loading && (
              <div className="flex items-center justify-center py-16">
                <div className="bg-gradient-to-br from-[#9B7BFF]/20 to-[#00E1FF]/10 dark:from-[#9B7BFF]/10 dark:to-[#00E1FF]/5 border-2 border-[#9B7BFF]/40 dark:border-[#9B7BFF]/30 rounded-2xl p-8 max-w-md text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9B7BFF]/20 mb-4">
                      <svg
                        className="w-8 h-8 text-[#9B7BFF]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AI-Powered Recommendations</h3>
                  <p className="text-slate-600 dark:text-gray-400 mb-6">
                    Login to JobMitra to see personalized job recommendations based on your profile, skills, and
                    preferences. Our AI will match you with the perfect opportunities!
                  </p>
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full py-3 px-4 bg-[#9B7BFF] hover:bg-[#7f13ec] text-white font-bold rounded-lg transition-colors mb-3"
                  >
                    Login Now
                  </button>
                  <button
                    onClick={() => router.push('/signup')}
                    className="w-full py-3 px-4 border-2 border-[#9B7BFF] text-[#9B7BFF] hover:bg-[#9B7BFF]/10 font-bold rounded-lg transition-colors"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}

            {!loading && displayedJobs.length === 0 && (activeTab !== 'recommended' || isUserLoggedIn) && (
              <div className="text-center py-12 text-[#BDBDEB]">No jobs found.</div>
            )}
            {!loading && displayedJobs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedJobs.map((job, index) => (
                  <JobCard key={job.id} job={job} index={index} />
                ))}
              </div>
            )}

            {visibleCount < jobs.length && (
              <div
                className="text-center mt-12 scroll-reveal opacity-0 translate-y-8 transition-all duration-700"
                data-index="loadmore"
                style={{
                  opacity: visibleCards.has('loadmore') ? 1 : 0,
                  transform: visibleCards.has('loadmore') ? 'translateY(0)' : 'translateY(30px)'
                }}
              >
                <button
                  onClick={() => setVisibleCount(prev => prev + 5)}
                  className="px-8 py-3 rounded-full text-lg font-bold border-2 border-[#9B7BFF] text-[#9B7BFF] hover:bg-[#9B7BFF] hover:text-[#1E1F55] transition-all duration-300"
                >
                  Load More Jobs
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}