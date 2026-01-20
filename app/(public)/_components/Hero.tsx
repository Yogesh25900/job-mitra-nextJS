import Link from 'next/link';

export default function Hero() {
  return (
    <>
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-24 lg:pb-32">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
<div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
<div className="max-w-2xl">
<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
                        AI Matching Engine v2.0 Live
                    </div>
<h1 className="text-4xl font-black leading-tight tracking-[-0.02em] sm:text-6xl lg:leading-[1.1]">
                        The Future of Hiring is <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Intelligent</span>
</h1>
<p className="mt-6 text-lg leading-relaxed text-[#4f6266] dark:text-[#9db4b9]">
                        Stop searching through endless lists. Start connecting. Our AI analyzes millions of data points to pair top-tier freelancers and full-time talent with the perfect opportunities instantly.
                    </p>
<div className="mt-8 flex flex-wrap gap-4">
<button className="h-12 px-8 rounded bg-primary text-[#111718] font-bold text-base hover:bg-primary/90 transition-all transform hover:scale-105 shadow-[0_4px_14px_0_rgba(19,200,236,0.39)]">
                            Find Work
                        </button>
<button className="h-12 px-8 rounded bg-white dark:bg-[#283639] border border-[#e5e8eb] dark:border-[#3b4f54] text-[#111718] dark:text-white font-bold text-base hover:bg-gray-50 dark:hover:bg-[#324347] transition-all">
                            Hire Talent
                        </button>
</div>
<div className="mt-8 flex items-center gap-4 text-sm text-[#4f6266] dark:text-[#9db4b9]">
<div className="flex -space-x-2">
<div className="h-8 w-8 rounded-full border-2 border-white dark:border-[#101f22] bg-gray-300 bg-cover bg-center" data-alt="Portrait of a female user" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVlcrNF1pqEGBfXiVMT3dsCgtckX0C5Wk4YARYreYtb9_MMrlLLy2fIbT83I6nAs8cY47MBDTYWoojYWcViIvXT9BX50p0oe4XU255lGoIEzZ17KUV72Bg3qgol4wAiyxOOcwuPoVC3TMOfOX7s_yok59F5h4HSddC0cv_js_hIPRfp2WiZtIjiPiu_Mu9JEWg02AeSVCMV4DfSrkitl0ScGUHMMDOmcAX5DmrjSyjoruK3bNnkJ8cW8wAwxmdFyHaAF-ENQ7JLlg')" }}></div>
<div className="h-8 w-8 rounded-full border-2 border-white dark:border-[#101f22] bg-gray-300 bg-cover bg-center" data-alt="Portrait of a male user" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuATUrEXaqlaz0IpjdRPAGNnHBSnoesxCKNI768I6ZItHUJsr2-v3LqmmRgDP6U2NJBGQEhjYSPpha0oQ-uCgJY623qlmVeSAtERBCrj6_xBTHUUJB3YcZr9f2pkEmTsM-fr5SvEGCn589FO6cLYBSYaYt9JkpHIdITk2JZ6AlloDVRi0ZAgtIONOndLISddy2Q6WtbSnkjEGvcS14-ZXkX44aaZsAIIcef5MZpmbLYC50zUwBYHLZwIUDYYK22wjJSapD0rU3xkA2s')" }}></div>
<div className="h-8 w-8 rounded-full border-2 border-white dark:border-[#101f22] bg-gray-300 bg-cover bg-center" data-alt="Portrait of another male user" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGzQdO7hSenPYRo98_8T840Vn1obEcu1uaKJn3RzFBFRMw4UiXUwp9q-ZLfOaH5nilVJtpJ0lLTzygfmrloAef0GXwdnD-eQOVgyamJjKlIBawEN0vUNb_PdSF9kldqJ4W0fYY2iNpQQUb-aefE0GFzsGveFlPO93kfS5UJdEgXwWliUh4kZtEQXo_3pJyNuLWmHOrMo7dRzJkG7tHkKUGYaz0dM0PFfFw6VtksyjxW4UkCcXBQrjt_3Q8dWe7wnEETqgf3RHCp0o')" }}></div>
</div>
<p>Trusted by 10,000+ professionals</p>
</div>
</div>
<div className="relative lg:h-full flex items-center justify-center">
{/* <!-- Abstract representation of AI matching --> */}
<div className="relative w-full aspect-square max-w-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1c2527] to-[#111718] border border-[#283639]">
<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&amp;w=1000&amp;auto=format&amp;fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" data-alt="Abstract network connections visualization"></div>
<div className="absolute inset-0 bg-gradient-to-t from-[#101f22] via-transparent to-transparent"></div>
{/* <!-- Floating Cards Overlay --> */}
<div className="absolute top-1/4 left-8 bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-primary/20 shadow-lg w-48 animate-[bounce_3s_infinite]">
<div className="flex items-center gap-3 mb-2">
<div className="w-8 h-8 rounded-full bg-gray-200 bg-cover bg-center" data-alt="User profile picture" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCTTstbzbbA1h5OKNVa5BWZDUX57XcN8CuvYnOrqzH5RF9kDpjprtripdelsgvGdAyNvKn7vuEPCNavdkLesfRUHKNQ8l0bRPhtQRnxMluKCcqzYHo-3SXxlrNfvxD8OPhDnyiLpoLMc-Jd93NzMvjYFzriQbeei_HB1gXtlSv9Z1Bsfh2dI36qyeoBEhj0G6XX55tBiMTzl8Me7dlq5N3u1Wz9sXHIqfCDL5iahpX-cR08V3w8thcXydQDO0CpDaaEJjbg2FUqnBE')" }}></div>
<div>
<div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
<div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
</div>
</div>
<div className="flex items-center gap-1 text-xs text-primary font-bold">
<span className="material-symbols-outlined text-sm">check_circle</span>
                                98% Match
                            </div>
</div>
<div className="absolute bottom-1/3 right-8 bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-primary/20 shadow-lg w-52 animate-[bounce_4s_infinite]">
<div className="flex items-center gap-3 mb-2">
<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">Js</div>
<div>
<div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
<div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
</div>
</div>
<div className="flex items-center gap-1 text-xs text-green-400 font-bold">
<span className="material-symbols-outlined text-sm">trending_up</span>
                                High Demand
                            </div>
</div>
</div>
</div>
</div>
</div>
<div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[100px]"></div>
<div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]"></div>
</section>
<section className="border-y border-[#e5e8eb] dark:border-[#283639] bg-surface-light dark:bg-surface-dark py-12">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
<div className="text-center md:text-left">
<p className="text-3xl font-bold tracking-tight text-[#111718] dark:text-white sm:text-4xl">500K+</p>
<p className="mt-2 text-sm font-medium text-[#4f6266] dark:text-[#9db4b9]">Matches Made</p>
</div>
<div className="text-center md:text-left">
<p className="text-3xl font-bold tracking-tight text-[#111718] dark:text-white sm:text-4xl">40hrs</p>
<p className="mt-2 text-sm font-medium text-[#4f6266] dark:text-[#9db4b9]">Avg. Time Saved</p>
</div>
<div className="text-center md:text-left">
<p className="text-3xl font-bold tracking-tight text-[#111718] dark:text-white sm:text-4xl">120K+</p>
<p className="mt-2 text-sm font-medium text-[#4f6266] dark:text-[#9db4b9]">Freelancers Hired</p>
</div>
<div className="text-center md:text-left">
<p className="text-3xl font-bold tracking-tight text-[#111718] dark:text-white sm:text-4xl">5,000+</p>
<p className="mt-2 text-sm font-medium text-[#4f6266] dark:text-[#9db4b9]">Companies Trust Us</p>
</div>
</div>
</div>
</section>
</>
  );
}
