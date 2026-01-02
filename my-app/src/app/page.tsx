import Footer from "@/sections/footer";
import Navbar from "@/sections/navbar";
import FaqsAndAnswers from "@/sections/faqs-and-answers";
import GetInTouch from "@/sections/get-in-touch";
import HeroSection from "@/sections/hero-section";
import OurLatestFeatures from "@/sections/our-latest-features";
import OurTestimonials from "@/sections/our-testimonials";
import SubscribeNewsletter from "@/sections/subscribe-newsletter";

function Page() {
  return (
    <main className="px-6 md:px-16 lg:px-24 xl:px-32">
      <Navbar />
      <HeroSection />
      <OurLatestFeatures />
      <OurTestimonials />
      <FaqsAndAnswers />
      <GetInTouch />
      <SubscribeNewsletter />
      <Footer />
    </main>
  );
}

export default Page;
