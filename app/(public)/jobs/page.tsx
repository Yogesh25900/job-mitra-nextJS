import Navbar from "../_components/Navbar";
import FilterChips from "./_components/FilterChips";
import HeroSection from "./_components/HeroSection";
import JobAlerts from "./_components/JobAlerts";
import JobFeed from "./_components/JobFeed";
import RecommendedJobs from "./_components/RecommendedJobs";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex flex-col flex-1 w-full">
        <HeroSection />
        <div className="w-full flex justify-center px-2 sm:px-4">
          <div className="max-w-[1200px] w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start py-4 md:py-8">
              {/* JobFeed takes full width on mobile, 8 cols on desktop */}
              <div className="col-span-1 lg:col-span-8">
                <JobFeed />
              </div>
              {/* Aside stacks below on mobile, right on desktop */}
              <aside className="col-span-1 lg:col-span-4 flex flex-col gap-6 mt-8 lg:mt-0">
                <RecommendedJobs />
                <JobAlerts />
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}