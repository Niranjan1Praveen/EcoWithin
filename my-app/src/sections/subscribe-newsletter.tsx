"use client";
import React from "react";
import SectionTitle from "@/components/section-title";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Heart } from "lucide-react";

const SubscribeNewsletter: React.FC = () => {
  return (
    <section className="flex flex-col items-center">
      <SectionTitle
        title="Join Our Emotional Journey"
        description="Subscribe for weekly insights on emotional intelligence, self-awareness tips, and updates on voice-based emotional discovery."
      />

      <motion.div
        className="flex items-center mt-10 border border-[#8B8DF8]/30 rounded-full h-14 max-w-xl w-full bg-white/5 backdrop-blur-sm"
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center h-full pl-4">
          <Mail className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="email"
          placeholder="Enter your email for emotional insights"
          className="bg-transparent outline-none px-4 h-full flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-500"
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-11 mr-1 px-8 hover:scale-105 transition-transform">
          <Heart className="mr-2 h-4 w-4" />
          Subscribe
        </Button>
      </motion.div>
      
      <motion.p
        className="mt-4 text-sm text-gray-500 max-w-md text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        Receive curated content on emotional awareness, voice intelligence, and mindfulness. 
        No spam, just meaningful insights.
      </motion.p>
    </section>
  );
};

export default SubscribeNewsletter;