'use client';

import { useState } from 'react';

export default function AudienceSection() {
  const [activeTab, setActiveTab] = useState('seekers');

  return (
    <section className="bg-surface-light dark:bg-[#152326] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-md rounded-lg bg-[#e5e8eb] dark:bg-[#283639] p-1">
            <div className="grid grid-cols-3 gap-1">
              {['Seekers', 'Freelancers', 'Employers'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`rounded-md py-2 text-sm font-medium transition-all ${
                    activeTab === tab.toLowerCase()
                      ? 'bg-white dark:bg-[#111718] text-[#111718] dark:text-white font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-[#4f6266] dark:text-[#9db4b9] hover:text-[#111718] dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-black text-[#111718] dark:text-white sm:text-4xl">
                Career growth, tailored to your skills.
              </h2>
              <ul className="mt-8 space-y-6">
                {[
                  {
                    title: 'Smart Recommendations',
                    desc: 'Jobs find you. Get notified when a perfect role opens up.',
                  },
                  {
                    title: 'Salary Insights',
                    desc: 'Know your worth with real-time market rate data.',
                  },
                  {
                    title: 'One-Click Apply',
                    desc: 'Apply to multiple matched jobs with a single tailored profile.',
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111718] dark:text-white">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm text-[#4f6266] dark:text-[#9db4b9]">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button className="inline-flex h-10 items-center gap-2 font-bold text-primary hover:text-primary/80">
                  Learn more about opportunities{' '}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-2xl bg-[#e5e8eb] dark:bg-[#1c2527] p-2">
                <div
                  className="aspect-video w-full rounded-xl bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAB11V8LTh8WaHHHj_o8wr4FRw9BEXObVPBElUTBvD0zdlFGDjDkDmHMh0vyFpjPPfYLAQoezkCmNO_QLf94YXyh2lLBRYQXcTCSEZbuJeGd10xCLbHM4W4ojT8Vca2KPMEHBIm4_mYdO5qR_NaxI_X08HSSek30e1DUaI_MK6RCqxdQr4iwEUrSNqeCZzJdU_vHzH_HsUaq8lpUnFhX9ihGp9qJILsBtbJ2j0ax9kb3gNso00kSOY-EJIIZV8Btenagvi0KHs9Fbs')",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
