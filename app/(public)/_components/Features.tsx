export default function Features() {
  const features = [
    {
      icon: 'psychology',
      title: 'Skill Analysis',
      description: 'Deep semantic scanning of portfolios, code repositories, and resumes to gauge true expertise beyond just keywords.',
    },
    {
      icon: 'handshake',
      title: 'Culture Fit',
      description: 'Matching personality traits and work styles with company values to ensure long-term retention and team harmony.',
    },
    {
      icon: 'bolt',
      title: 'Instant Shortlist',
      description: 'Get a ranked list of the top 1% of candidates in seconds, matched specifically to your unique job requirements.',
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-[#111718] dark:text-white sm:text-4xl">
            How Our AI Matching Works
          </h2>
          <p className="mt-4 text-lg text-[#4f6266] dark:text-[#9db4b9]">
            We use advanced algorithms to analyze skills, culture fit, and career goals to create the perfect match, eliminating the guesswork from hiring.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-[#e5e8eb] dark:border-[#3b4f54] bg-surface-light dark:bg-surface-dark p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#111718] dark:text-white">
                {feature.title}
              </h3>
              <p className="text-[#4f6266] dark:text-[#9db4b9]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
