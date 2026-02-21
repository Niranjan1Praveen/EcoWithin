'use client";'
import SectionTitle from "@/components/section-title";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

export function WorkingDemo() {
  return (
    <div className="relative max-w-5xl mx-auto">
      <SectionTitle
        title="Behind the Voice: How It Works?"
        description="A behind-the-scenes look at how EchoWithin listens, analyzes, and transforms your speech into emotional insights."
      />
      <HeroVideoDialog
        className="block dark:hidden mt-18 border-0"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block border-0"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
