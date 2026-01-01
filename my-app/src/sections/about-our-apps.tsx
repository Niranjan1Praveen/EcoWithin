"use client";
import React from "react";
import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";

interface SectionItem {
  title: string;
  description: string;
  image: string;
  className: string;
}

const AboutOurApps: React.FC = () => {
  const sectionData: SectionItem[] = [
  {
    title: "Accent-Adaptive Voice AI",
    description: "Choose from warm, human-like accents (Indian neutral, British calm, American warm) that adapt their emotional tone during conversation for natural interaction.",
    image: "🎤", // or use an icon/image path
    className: "py-10 border-b border-slate-700/50 md:py-0 md:border-r md:border-b-0 md:px-10",
  },
  {
    title: "Real-Time Emotional Mirror",
    description: "Get immediate emotional patterns, mood shifts, and hidden themes (stress, hope, self-doubt, gratitude) after every conversation.",
    image: "🪞", // or use an icon/image path
    className: "py-10 border-b border-slate-700/50 md:py-0 lg:border-r md:border-b-0 md:px-10",
  },
  {
    title: "Voice-Based Emotion Detection",
    description: "Our AI captures emotional nuances in tone, pauses, pitch, and hesitation — going beyond text-based sentiment analysis.",
    image: "🎭", // or use an icon/image path
    className: "py-10 border-b border-slate-700/50 md:py-0 md:border-b-0 md:px-10",
  },
  {
    title: "Happiness-Oriented Insights",
    description: "Focus on emotional awareness, literacy, and self-connection — not therapy or problem-solving. Discover patterns that lead to greater happiness.",
    image: "🌱", // or use an icon/image path
    className: "py-10 border-b border-slate-700/50 md:py-0 md:border-r md:border-b-0 md:px-10",
  },
  {
    title: "Personalized Emotional Patterns",
    description: "Track how your emotional patterns evolve across sessions. Identify recurring themes, emotional spikes, and areas of growth.",
    image: "📊", // or use an icon/image path
    className: "py-10 border-b border-slate-700/50 md:py-0 lg:border-r md:border-b-0 md:px-10",
  },
  {
    title: "Guided Emotional Awareness",
    description: "Not just listening — guiding. Our AI helps you understand your emotions through meaningful reflections and gentle prompts.",
    image: "🧭", // or use an icon/image path
    className: "py-10 border-b border-slate-700/50 md:py-0 md:border-b-0 md:px-10",
  },
];

  return (
    <section className="flex flex-col items-center" id="about">
      <SectionTitle
        title="About our apps"
        description="A visual collection of our most recent works - each piece crafted with intention, emotion, and style."
      />
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 md:px-0 mt-18">
        {sectionData.map((data, index) => (
          <motion.div
            key={data.title}
            className={data.className}
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.15,
              type: "spring",
              stiffness: 320,
              damping: 70,
              mass: 1,
            }}
          >
            <div className="size-10 p-2 bg-indigo-600/20 border border-indigo-600/30 rounded">
              <img src={data.image} alt={data.title} />
            </div>
            <div className="mt-5 space-y-2">
              <h3 className="text-base font-medium text-slate-200">
                {data.title}
              </h3>
              <p className="text-sm text-slate-400">
                {data.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutOurApps;
