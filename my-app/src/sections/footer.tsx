"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <motion.footer
      className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-400 mt-40"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/">
            <Image
              className="h-9 w-auto"
              src="/assets/logo-navbar.png"
              width={138}
              height={36}
              alt="logo"
            />
          </Link>
          <p className="text-sm/7 mt-6">
            EchoWithin is a real-time, voice-based AI companion that helps you
            understand your emotions and inner patterns through natural
            conversation. Talk. Feel. Understand Yourself.
          </p>
        </div>
        <div className="flex flex-col lg:items-center lg:justify-center">
          <div className="flex flex-col text-sm space-y-2.5">
            <h2 className="font-semibold mb-5 text-white">Explore</h2>
            <Link
              className="hover:text-slate-500 transition"
              href="/how-it-works"
            >
              How It Works
            </Link>
            <Link className="hover:text-slate-500 transition" href="/features">
              Features
            </Link>
            <Link className="hover:text-slate-500 transition" href="/pricing">
              Pricing
            </Link>
            <Link
              className="hover:text-slate-500 transition"
              href="/testimonials"
            >
              Testimonials
            </Link>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-white mb-5">
            Emotional Insights Newsletter
          </h2>
          <div className="text-sm space-y-6 max-w-sm">
            <p>
              Get weekly insights on emotional intelligence, self-awareness
              tips, and updates on voice-based emotional discovery.
            </p>
            <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-slate-900">
              <Input
                className="outline-none w-full max-w-64 py-2 bg-transparent border-0 focus-visible:ring-0"
                type="email"
                placeholder="Enter your email"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-white rounded">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center border-t mt-6 border-slate-700">
        Copyright 2024 ©{" "}
        <Link href="/" className="text-[#8B8DF8]">
          EchoWithin
        </Link>{" "}
        All Rights Reserved.
      </p>
    </motion.footer>
  );
}
