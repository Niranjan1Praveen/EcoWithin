import GetInTouch from "@/sections/get-in-touch";
import HeroSection from "@/sections/hero-section";
import OurLatestCreation from "@/sections/our-latest-creation";
import SubscribeNewsletter from "@/sections/subscribe-newsletter";

function Page() {
  return (
    <main className="px-6 md:px-16 lg:px-24 xl:px-32">
            <HeroSection />
            <OurLatestCreation />
            <GetInTouch />
            <SubscribeNewsletter />
        </main>
  );
}

export default Page;