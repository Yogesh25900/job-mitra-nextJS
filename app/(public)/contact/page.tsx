"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="bg-[#f7f6f8] dark:bg-[#0f0a1e] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col selection:bg-purple-500/30">
   

      {/* Main Content */}
      <main className="flex-grow relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(140, 43, 238, 0.15) 0%, rgba(15, 10, 30, 0) 70%)" }}
        />
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(140, 43, 238, 0.15) 0%, rgba(15, 10, 30, 0) 70%)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
              Get in Touch
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Have questions about JobMitra? Whether you&apos;re looking for your next
              career move or seeking top talent, our team is ready to assist you.
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="bg-white/5 dark:bg-white/[0.03] p-8 rounded-xl border border-white/10 backdrop-blur-sm">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#8c2bee] focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#8c2bee] focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help you?"
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#8c2bee] focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#8c2bee] focus:border-transparent outline-none transition-all placeholder:text-slate-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#8c2bee] hover:bg-[#8c2bee]/90 text-white font-bold rounded-lg transition-all shadow-xl shadow-[#8c2bee]/25 flex items-center justify-center gap-2 group"
                >
                  <span>Send Message</span>
                  <svg
                    className="w-5 h-5 fill-current group-hover:translate-x-1 transition-transform"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#8c2bee]/10 flex items-center justify-center text-[#8c2bee] flex-shrink-0">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Email Us
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-1">
                      Our support team is online 24/7.
                    </p>
                    <a
                      href="mailto:support@jobmitra.com"
                      className="text-[#8c2bee] font-semibold hover:underline"
                    >
                      support@jobmitra.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#8c2bee]/10 flex items-center justify-center text-[#8c2bee] flex-shrink-0">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Call Us
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-1">
                      Mon-Fri from 8am to 5pm PST.
                    </p>
                    <a
                      href="tel:+15550000000"
                      className="text-[#8c2bee] font-semibold hover:underline"
                    >
                      +1 (555) 000-0000
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#8c2bee]/10 flex items-center justify-center text-[#8c2bee] flex-shrink-0">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Main Office
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      123 Tech Plaza, Innovation District
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Los Angeles, CA 90001, USA
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-8 border-t border-slate-200 dark:border-white/10">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
                  Follow Our Journey
                </p>
                <div className="flex gap-4">
                  {/* LinkedIn */}
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-[#8c2bee] hover:text-white transition-all duration-300"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  {/* Twitter/X */}
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-[#8c2bee] hover:text-white transition-all duration-300"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center hover:bg-[#8c2bee] hover:text-white transition-all duration-300"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-24 w-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Visit Our Headquarters
              </h2>
              <div className="flex items-center gap-2 text-[#8c2bee] font-medium cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
                </svg>
                <span>Get Directions</span>
              </div>
            </div>

            <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-200 dark:bg-slate-800">
              {/* Map placeholder — replace with Google Maps embed or next/image */}
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                {/* Replace this div with an <iframe> Google Maps embed or next/image */}
                <span>Map Placeholder — Add Google Maps iframe here</span>
              </div>

              <div className="absolute inset-0 bg-[#8c2bee]/10 mix-blend-multiply pointer-events-none" />

              {/* Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#8c2bee] animate-ping rounded-full opacity-75" />
                  <div className="relative w-12 h-12 bg-[#8c2bee] rounded-full flex items-center justify-center text-white border-4 border-[#0f0a1e] shadow-2xl">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-60">
            <div className="w-6 h-6 bg-slate-400 rounded flex items-center justify-center text-white">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.46 0 12.34 0c-1.67 0-3.18.73-4.24 1.88L12 6H8.82L7.34 4.52C6.64 5.46 6.2 6.68 6.2 8c0 .46.09.89.16 1.33C4.97 9.81 4 11.26 4 13v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7c0-1.74-.97-3.19-2.38-3.67L20 6z" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight">JobMitra</span>
          </div>

          <p className="text-slate-500 text-sm">
            © 2024 JobMitra Inc. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-[#8c2bee] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#8c2bee] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}