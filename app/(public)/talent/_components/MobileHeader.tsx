export default function MobileHeader() {
  return (
    <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-1 rounded-md text-primary">
          <span className="material-symbols-outlined">work</span>
        </div>
        <span className="font-bold text-lg">JobSeeker</span>
      </div>
      <button className="text-slate-600 dark:text-white">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </div>
  )
}