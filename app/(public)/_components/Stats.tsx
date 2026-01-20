export default function Stats() {
  const stats = [
    { value: '500K+', label: 'Matches Made' },
    { value: '40hrs', label: 'Avg. Time Saved' },
    { value: '120K+', label: 'Freelancers Hired' },
    { value: '5,000+', label: 'Companies Trust Us' },
  ];

  return (
    <section className="border-y border-[#e5e8eb] dark:border-[#283639] bg-surface-light dark:bg-surface-dark py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center md:text-left">
              <p className="text-3xl font-bold tracking-tight text-[#111718] dark:text-white sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-[#4f6266] dark:text-[#9db4b9]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
