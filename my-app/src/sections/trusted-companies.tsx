"use client";
import React from "react";
import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";

const TrustedCompanies: React.FC = () => {
  return (
    <section className="flex flex-col items-center">
      <SectionTitle
        title="Trusted companies"
        description="A visual collection of our most recent works - each piece crafted with intention, emotion, and style."
      />

      <motion.div
        className="relative max-w-5xl mt-18 w-full border border-indigo-900 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-[#401B98]/5 to-[#180027]/10"
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <div>
          <h1 className="text-3xl font-medium">
            Trusted by leading companies.
          </h1>
          <p className="text-slate-400 mt-4 max-w-lg">
            Built to integrate effortlessly with your existing tools,
            frameworks and workflows.
          </p>
        </div>

        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/trusted-brand/image-fc6e.png"
          alt="Trusted companies"
          className="max-w-xs mt-10 md:mt-0"
        />
      </motion.div>
    </section>
  );
};

export default TrustedCompanies;
