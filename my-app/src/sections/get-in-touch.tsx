"use client";
import React from "react";
import SectionTitle from "@/components/section-title";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const GetInTouch: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <section className="flex flex-col items-center" id="contact">
      <SectionTitle
        title="Connect with Our Emotional Intelligence Team"
        description="Have questions about emotional awareness, voice AI, or self-discovery? Our team is here to help you on your journey of understanding yourself better."
      />

      <form
        onSubmit={handleSubmit}
        className="grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-3xl mx-auto text-slate-400 mt-16 w-full"
      >
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <label className="font-medium text-slate-200">Your name</label>
          <input
            name="name"
            type="text"
            className="w-full mt-2 p-3 border border-slate-700 rounded-lg"
          />
        </motion.div>

        <motion.div
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <label className="font-medium text-slate-200">Email id</label>
          <input
            name="email"
            type="email"
            className="w-full mt-2 p-3 border border-slate-700 rounded-lg"
          />
        </motion.div>

        <motion.div
          className="sm:col-span-2"
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <label className="font-medium text-slate-200">Message</label>
          <textarea
            name="message"
            rows={8}
            className="w-full mt-2 p-3 border border-slate-700 rounded-lg resize-none"
          />
        </motion.div>

        <motion.button
          type="submit"
          className="w-max flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full"
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Submit
          <ArrowUpRight className="size-4.5" />
        </motion.button>
      </form>
    </section>
  );
};

export default GetInTouch;
