"use client";
import React from "react";
import TiltedImage from "@/components/tilt-image";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center -mt-18">
      <motion.svg
        className="absolute -z-10 w-full -mt-40 md:mt-0"
        width="1440"
        height="676"
        viewBox="0 0 1440 676"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <rect
          x="-92"
          y="-948"
          width="1624"
          height="1624"
          rx="812"
          fill="url(#a)"
        />
        <defs>
          <radialGradient
            id="a"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(90 428 292)scale(812)"
          >
            <stop offset=".63" stopColor="#372AAC" stopOpacity="0" />
            <stop offset="1" stopColor="#372AAC" />
          </radialGradient>
        </defs>
      </motion.svg>
      <motion.a
        className="flex items-center mt-48 gap-2 border border-slate-600 text-gray-50 rounded-full px-4 py-2"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="size-2.5 bg-indigo-600 rounded-full animate-pulse" />
        <span>Talk. Feel. Understand Yourself</span>
      </motion.a>
      <motion.h1
        className="text-center text-4xl md:text-6xl mt-4 font-semibold max-w-2xl leading-snug"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        A Conversation That Listens Back to You
      </motion.h1>
      <motion.p
        className="text-center max-w-lg mt-2"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        Speak freely with an AI that understands your voice, your emotions, and
        your inner world — then helps you discover what you're really feeling.
      </motion.p>
      <motion.div
        className="flex flex-col md:flex-row lg:flex-row justify-center items-center gap-4 mt-8"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-7 h-11">
          Get started
          <ArrowRight className="size-5" />
        </Button>

        <Button className="flex items-center gap-2 border border-slate-400 rounded-lg px-8 h-11 bg-transparent">
          See How It Works
          <Play />
        </Button>
      </motion.div>
      {/* Titled Component */}
      <TiltedImage />
    </section>
  );
};

export default HeroSection;
