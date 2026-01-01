"use client";
import React, { useEffect, useState } from "react";
import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";
import { LightRays } from "@/components/ui/light-rays";

interface CreationItem {
  title: string;
  description: string;
  image: string;
  align: string;
}

const OurLatestCreation: React.FC = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [className, setClassName] = useState<string>("");

  const sectionData: CreationItem[] = [
    {
      title: "Real-Time Emotional Mirror",
      description:
        "After every conversation, receive insights about your emotional state, stress levels, and hidden strengths based on your vocal patterns and sentiment.",
      image:
        "https://images.unsplash.com/photo-1543269865-0a740d43b90c?q=80&w=800&h=400&auto=format&fit=crop",
      align: "object-center",
    },
    {
      title: "Guided Self-Awareness",
      description:
        "Not just an AI listener—a guided companion that helps you understand emotions, recognize patterns, and develop greater emotional literacy through conversation.",
      image:
        "https://images.unsplash.com/photo-1714976326351-0ecf0244f0fc?q=80&w=800&h=400&auto=format&fit=crop",
      align: "object-right",
    },
    {
      title: "Happiness-Oriented Insights",
      description:
        "Focus on growth and awareness rather than problems. Our insights highlight gratitude, hope, and emotional strengths to foster positive self-connection.",
      image:
        "https://images.unsplash.com/photo-1736220690062-79e12ca75262?q=80&w=800&h=400&auto=format&fit=crop",
      align: "object-center",
    },
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sectionData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, sectionData.length]);

  return (
    <section className="flex flex-col items-center" id="features">
      <SectionTitle
        title="What Makes EchoWithin Special"
        description="Discover the features that transform ordinary conversation into meaningful emotional discovery — helping you understand yourself through the power of voice."
      />

      <div
        className="flex items-center gap-4 h-100 w-full max-w-5xl mt-18 mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {sectionData.map((data, index) => (
          <motion.div
            key={data.title}
            className={`relative group grow h-100 rounded-xl overflow-hidden ${
              isHovered && className
                ? "hover:w-full w-56"
                : index === activeIndex
                ? "w-full"
                : "w-56"
            } ${className} ${!className ? "pointer-events-none" : ""}`}
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            onAnimationComplete={() =>
              setClassName("transition-all duration-500")
            }
          >
            <img
              src={data.image}
              alt={data.title}
              className={`h-full w-full object-cover ${data.align}`}
            />
            <div
              className={`absolute inset-0 flex flex-col justify-end p-10 text-white bg-black/50 transition-all duration-300 ${
                isHovered && className
                  ? "opacity-0 group-hover:opacity-100"
                  : index === activeIndex
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              <h1 className="text-3xl font-semibold">{data.title}</h1>
              <p className="text-sm mt-2">{data.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurLatestCreation;
