export default function PremiumBanner() {
  return (
    <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="font-bold text-lg mb-2">Go Premium</h3>
        <p className="text-blue-100 text-sm mb-4">
          See who viewed your profile and get priority support for your
          applications.
        </p>
        <button className="bg-white text-primary text-sm font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
          Upgrade Now
        </button>
      </div>
      <div className="absolute -bottom-10 -right-10 text-white opacity-10 rotate-12">
        <span className="material-symbols-outlined text-[150px]">
          rocket_launch
        </span>
      </div>
    </div>
  )
}