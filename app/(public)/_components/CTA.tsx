import Link from 'next/link';

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="rounded-3xl bg-surface-light dark:bg-[#1c2527] border border-[#e5e8eb] dark:border-[#3b4f54] p-8 md:p-16 text-center shadow-2xl">
          <h2 className="mx-auto max-w-2xl text-3xl font-black text-[#111718] dark:text-white sm:text-5xl">
            Ready to revolutionize your hiring process?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[#4f6266] dark:text-[#9db4b9]">
            Join thousands of companies and talent building the future of work together.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/(auth)/register" className="inline-flex h-12 w-full sm:w-auto px-8 rounded bg-primary text-[#111718] font-bold text-base hover:bg-primary/90 transition-all shadow-[0_4px_14px_0_rgba(19,200,236,0.39)] items-center justify-center">
              Get Started for Free
            </Link>
            <Link href="/(public)/findjobs" className="inline-flex h-12 w-full sm:w-auto px-8 rounded bg-transparent border border-[#e5e8eb] dark:border-[#3b4f54] text-[#111718] dark:text-white font-bold text-base hover:bg-gray-50 dark:hover:bg-[#283639] transition-all items-center justify-center">
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
