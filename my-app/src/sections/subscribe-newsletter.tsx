"use client";
import React from "react";
import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";

const SubscribeNewsletter: React.FC = () => {
  return (
    <section className="flex flex-col items-center">
      <SectionTitle
        title="Subscribe newsletter"
        description="A visual collection of our most recent works - each piece crafted with intention, emotion, and style."
      />

      <motion.div
        className="flex items-center mt-10 border border-slate-700 rounded-full h-14 max-w-xl w-full"
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <input
          type="email"
          placeholder="Enter your email address"
          className="bg-transparent outline-none px-4 h-full flex-1"
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-11 mr-1 px-10">
          Subscribe
        </button>
      </motion.div>
    </section>
  );
};

export default SubscribeNewsletter;
