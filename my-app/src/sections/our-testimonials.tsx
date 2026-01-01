"use client";
import React from "react";
import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

const OurTestimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote:
        "Super clean and easy to use. These Tailwind + React components saved me hours of dev time!",
      name: "Richard Nelson",
      role: "AI Content Marketer",
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    },
    {
      quote:
        "The design quality is top-notch. Perfect balance between simplicity and style.",
      name: "Sophia Martinez",
      role: "UI/UX Designer",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    },
    {
      quote:
        "The design quality is top-notch. Perfect balance between simplicity and style.",
      name: "Ganesh Martinez",
      role: "UI/UX Designer",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    },
  ];

  return (
    <section className="flex flex-col items-center" id="testimonials">
      <SectionTitle
        title="Our testimonials"
        description="A visual collection of our most recent works - each piece crafted with intention, emotion, and style."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-18 max-w-6xl mx-auto">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.name}
            className="border border-slate-800 p-6 rounded-xl"
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
          >
            <p className="text-slate-100">{t.quote}</p>
            <div className="flex items-center gap-3 mt-8">
              <img src={t.image} alt={t.name} className="size-10 rounded-full" />
              <div>
                <h2 className="text-gray-200 font-medium">{t.name}</h2>
                <p className="text-indigo-500">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurTestimonials;
