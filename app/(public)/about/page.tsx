"use client";

import { useState } from "react";

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const leaders = [
    {
      name: "Arjun Mehta",
      role: "Founder & CEO",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDGq3lzcf4-6VjtPNgvmbi6DsSJQxnHwZCT3eM4qWRJJ3UIDifRgnovVsomMt9apL10DTu52Sc-HzOkjzWyHQCJHR5-HmwXxjkhw4mj_43Jpi39B43DeBD5dW6Wsss_bGSFGW-gB7KVW9s3OnGacd3VjPKHHp_hQBXmQ21jUOEgSfX-NDiUd21j-JnEkhayzdpv1xj76g6B6utbiqdkX3BVQ69GqTkrYE8qjMlq0zbb9xa_n8cnPIE8iAIN-pt3m6G5Qc0_Weqc81pS",
      gradient: true,
    },
    {
      name: "Sarah Chen",
      role: "CTO & Head of AI",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBWAdXVOZlyXhPmHF2kSd8rQpbBU0DH2KPOJ0lVaTmJCy9OskhNCJlDuOb6zR8twOOOYgmpqYfCIzzazTJTAtPsySZK01_bKUsTXqtLEqG6ZVmlx5AVbsK-odqMRJxv55oVGOheW82mZdNyARspF9dhPt9yhJPJGZOpmWW10oIjuXGPvnaxFFMhJYWAP8DyZznBK5o173AhXDOc5T0SuR3gdaTiUOJaTSIwL3t9isHKXt2rVkCteVgZVQg4rQZsvf_d9-0c39HBmiGn",
      gradient: false,
    },
    {
      name: "Marcus Holloway",
      role: "Head of Product",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDjFDJuQmrxgpQXew4-LbDwoOGOOxJNl72ODhBQzNZUEBDQINSkUa_H4zQwaf9E-CwEjJuVC4WKS2S2Fj02TuPYuziJT88-UhIo6rFSALr8l-ug6xJ-60sFmCCas2FVcXb3AzCbjUj4Y8v5ktcDZQ1ncQcWzRLK1O-voOOjxusN3OTGfREfekqs4ARrOUz2QuTezKjOgyg90oLAsAIKvMna3MMENM0ME04Y4gpOg3p3Z_OLCuIZTwiJU2iCxPEEqSXai5EDC1KO4-vL",
      gradient: false,
    },
    {
      name: "Elena Rodriguez",
      role: "COO",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAqltZO7y5-78vOMVY0aUG5JpTn19Ocm6b6hLIktfLW-KM3J4RCouKmunyGVtmP7Dal-cWmmd5N6L6ojbrQ4fE85lf5vswhVUS_99jXsbkKXgUpBuIAIlQzUdAUvjPKxd-6JOFx2krVekxrJrduXFQhP1AlIR0ayc6gu7DgycEJ_jYZGILn0nk9SKe5BXIx2F1",
      gradient: false,
    },
  ];

  const values = [
    {
      icon: "🚀",
      title: "Innovation",
      description:
        "We constantly push the boundaries of AI, developing proprietary matching models that see beyond the surface level of employment history.",
    },
    {
      icon: "⚖️",
      title: "Integrity",
      description:
        "Transparency is at our core. We build ethical AI that actively combats bias, ensuring fair opportunities for every candidate.",
    },
    {
      icon: "🌍",
      title: "Impact",
      description:
        "Success for us is measured by the careers we transform and the growth of the companies we partner with. Every hire counts.",
    },
  ];

  const stats = [
    { value: "50k+", label: "Hired" },
    { value: "2.5k", label: "Partners" },
    { value: "98%", label: "Match Rate" },
  ];

  return (
    <div className="bg-[#191022] text-white font-sans overflow-x-hidden min-h-screen">
      {/* ── Header ── */}
    

      <main>
        {/* ── Hero ── */}
        <section
          className="relative min-h-[70vh] flex items-center justify-center px-6 pt-20 pb-32"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(140,43,238,0.15) 0%, #191022 100%)",
          }}
        >
          {/* Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8c2bee]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-4xl text-center mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8c2bee]/10 border border-[#8c2bee]/20 text-[#8c2bee] text-xs font-bold uppercase tracking-widest mb-6">
              ✨ The AI Advantage
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-8">
              Connecting Talent with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c2bee] to-indigo-400">
                AI Precision
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-10">
              JobMitra is on a mission to bridge the gap between skill and opportunity. We use
              cutting-edge artificial intelligence to eliminate bias and find the perfect match for
              every professional.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#8c2bee] text-white font-bold rounded-xl hover:scale-105 transition-transform">
                Explore Open Roles
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                Learn How It Works
              </button>
            </div>
          </div>
        </section>

        {/* ── Our Story ── */}
        <section className="py-24 px-6 md:px-20 bg-[#191022]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#8c2bee]/20 rounded-3xl blur-2xl group-hover:bg-[#8c2bee]/30 transition-all duration-500" />
              <div
                className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoeh62YL0WEXb1lHC0cS6cWbu3vsHsF6kb6WrzK93s07P10K4g3TC6OuFSwcdMjBLS0_ciWbBrAlIE2gTmX1ENgYWvGfiMyEnqRBptDhxrgfytPH74lECmq0J6XHFWo54PZB3iHJXcw3oFfFtTGxR9FEaL-In0DcLpG8LPZuneKP4FhswEDMPpgQfb3zsEjYg22Uuv2md3Yh_xgtt64NZ5nE3Z4Zbh6InikbN8yigbnAHwwuftVtZRDUwUUgeC9_Xnb15OtEkuDjb6")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>

            {/* Text */}
            <div>
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                The Genesis of JobMitra
              </h2>
              <div className="space-y-6 text-white/70 text-lg leading-relaxed">
                <p>
                  Our journey began in 2021 with a simple realization: the traditional job market was
                  broken. Talented individuals were being overlooked by outdated algorithms, and
                  companies were struggling to find the right cultural and technical fit.
                </p>
                <p>
                  We envisioned a platform where deep learning could understand the nuances of a
                  career path—not just keywords on a resume. Since then, we have helped over 50,000
                  professionals find roles that truly align with their aspirations and potential.
                </p>
                <p>
                  Today, JobMitra stands as a beacon of efficiency and fairness, powered by an AI
                  that values skill, ambition, and diversity above all else.
                </p>
              </div>

              {/* Stats */}
              <div className="mt-10 flex gap-8">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-8">
                    <div>
                      <div className="text-3xl font-bold text-[#8c2bee]">{stat.value}</div>
                      <div className="text-sm text-white/50 uppercase tracking-wider mt-1">
                        {stat.label}
                      </div>
                    </div>
                    {i < stats.length - 1 && (
                      <div className="w-px h-12 bg-white/10" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Core Values ── */}
        <section className="py-24 px-6 md:px-20 bg-[#191022] relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                Guided by Our Values
              </h2>
              <p className="text-white/50 max-w-xl mx-auto text-lg">
                The principles that drive every algorithm we write and every connection we facilitate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="group p-8 rounded-2xl border border-[#8c2bee]/20 hover:border-[#8c2bee]/50 transition-all"
                  style={{ background: "rgba(48,40,57,0.4)", backdropFilter: "blur(12px)" }}
                >
                  <div className="w-14 h-14 rounded-xl bg-[#8c2bee]/20 group-hover:bg-[#8c2bee] flex items-center justify-center mb-6 text-2xl transition-colors">
                    {v.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                  <p className="text-white/60 leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Leadership ── */}
        <section className="py-24 px-6 md:px-20 bg-[#191022]/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  Meet the Visionaries
                </h2>
                <p className="text-white/50 text-lg">The humans behind the intelligence.</p>
              </div>
              <button className="text-[#8c2bee] font-bold flex items-center gap-2 hover:gap-3 transition-all">
                View Board of Advisors →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {leaders.map((leader) => (
                <div key={leader.name} className="flex flex-col items-center text-center">
                  <div
                    className={`w-48 h-48 rounded-full p-1 mb-6 ${
                      leader.gradient
                        ? "bg-gradient-to-tr from-[#8c2bee] to-indigo-500"
                        : "bg-white/10"
                    }`}
                  >
                    <div
                      className="w-full h-full rounded-full border-4 border-[#191022] overflow-hidden bg-white/5"
                      style={{
                        backgroundImage: `url("${leader.image}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </div>
                  <h4 className="text-xl font-bold">{leader.name}</h4>
                  <p className="text-[#8c2bee] font-medium text-sm mb-4">{leader.role}</p>
                  <div className="flex gap-4 text-white/30">
                    <a href="#" className="hover:text-white transition-colors text-sm">
                      Share
                    </a>
                    <a href="#" className="hover:text-white transition-colors text-sm">
                      Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-6 md:px-20 relative">
          <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-[#8c2bee] to-indigo-800 p-12 md:p-20 relative">
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Join the Future of Work
              </h2>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                Ready to experience a smarter, faster, and fairer way to hire or get hired? Become
                part of the AI revolution today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-10 py-4 bg-white text-[#8c2bee] font-bold rounded-xl hover:scale-105 transition-all shadow-xl">
                  Find Your Dream Job
                </button>
                <button className="w-full sm:w-auto px-10 py-4 bg-[#8c2bee]/20 border border-white/30 text-white font-bold rounded-xl hover:bg-[#8c2bee]/30 transition-all">
                  Post a Role
                </button>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#191022] border-t border-white/10 py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-[#8c2bee] rounded flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <h2 className="text-white text-lg font-bold">JobMitra</h2>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Pioneering AI-driven talent acquisition for the next generation of global industry
              leaders.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              {["How it works", "For Employers", "For Candidates", "Pricing"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#8c2bee] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              {["About Us", "Careers", "Blog", "Press"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#8c2bee] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-bold mb-6">Connect</h4>
            <div className="flex gap-4 mb-6 text-white/40">
              {["🌐", "✉️", "👥"].map((icon, i) => (
                <span key={i} className="cursor-pointer hover:text-white transition-colors text-xl">
                  {icon}
                </span>
              ))}
            </div>
            <p className="text-white/40 text-xs">© 2024 JobMitra AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}