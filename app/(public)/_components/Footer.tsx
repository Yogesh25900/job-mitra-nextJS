export default function Footer() {
    return (
        <footer className="border-t border-[#e5e8eb] dark:border-[#283639] bg-background-light dark:bg-background-dark pt-16 pb-8">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
<div className="grid gap-12 lg:grid-cols-4">
<div className="space-y-4">
<div className="flex items-center gap-2">
<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
<span className="material-symbols-outlined">smart_toy</span>
</div>
<span className="text-xl font-bold dark:text-white">TalentAI</span>
</div>
<p className="text-sm text-[#4f6266] dark:text-[#9db4b9]">Connecting the world's best talent with the world's best companies through intelligent AI matching.</p>
</div>
<div>
<h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#111718] dark:text-white">Platform</h4>
<ul className="space-y-3 text-sm text-[#4f6266] dark:text-[#9db4b9]">
<li><a className="hover:text-primary transition-colors" href="#">Find Work</a></li>
<li><a className="hover:text-primary transition-colors" href="#">Hire Talent</a></li>
<li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
<li><a className="hover:text-primary transition-colors" href="#">Success Stories</a></li>
</ul>
</div>
<div>
<h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#111718] dark:text-white">Company</h4>
<ul className="space-y-3 text-sm text-[#4f6266] dark:text-[#9db4b9]">
<li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
<li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
<li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
<li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
</ul>
</div>
<div>
<h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#111718] dark:text-white">Newsletter</h4>
<p className="mb-4 text-sm text-[#4f6266] dark:text-[#9db4b9]">Subscribe to get the latest hiring trends and platform updates.</p>
<form className="flex gap-2">
<input className="w-full rounded bg-white dark:bg-[#1c2527] border border-[#e5e8eb] dark:border-[#3b4f54] px-3 py-2 text-sm text-[#111718] dark:text-white placeholder-[#9db4b9] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter your email" type="email"/>
<button className="rounded bg-primary px-4 py-2 text-sm font-bold text-[#111718] hover:bg-primary/90 transition-colors" type="submit">
<span className="material-symbols-outlined text-lg">arrow_forward</span>
</button>
</form>
</div>
</div>
<div className="mt-16 border-t border-[#e5e8eb] dark:border-[#283639] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
<p className="text-sm text-[#4f6266] dark:text-[#9db4b9]">© 2023 TalentAI Inc. All rights reserved.</p>
<div className="flex gap-6">
<a className="text-[#4f6266] dark:text-[#9db4b9] hover:text-primary transition-colors" href="#"><span className="sr-only">Twitter</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></a>
<a className="text-[#4f6266] dark:text-[#9db4b9] hover:text-primary transition-colors" href="#"><span className="sr-only">LinkedIn</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path clip-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill-rule="evenodd"></path></svg></a>
</div>
</div>
</div>
</footer>
    );
}