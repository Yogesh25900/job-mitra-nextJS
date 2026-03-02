import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-gray-200 font-sans flex items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-xl mx-auto text-center">
        {/* Animated Element: Bouncing Icon */}
        <div className="mb-8 flex justify-center">
          <svg className="w-24 h-24 animate-bounce text-primary dark:text-primary" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="currentColor" fillOpacity="0.15" />
            <path d="M32 44c6.627 0 12-5.373 12-12S38.627 20 32 20 20 25.373 20 32s5.373 12 12 12z" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">Oops! Page not found.</h2>
        <p className="text-lg text-slate-600 dark:text-gray-400 mb-8">The page you’re looking for doesn’t exist or has been moved.</p>
        <Link href="/" className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors text-center shadow-md">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
