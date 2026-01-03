"use client";

import { useState } from "react";
import { ArrowRight, MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ShinyButton } from "@/components/ui/shiny-button";

interface NavLink {
  href: string;
  text: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navlinks: NavLink[] = [
    {
      href: "#features",
      text: "Features",
    },
    {
      href: "#faqs",
      text: "Faqs",
    },
    {
      href: "#testimonials",
      text: "Testimonials",
    },
    {
      href: "#contact",
      text: "Contact",
    },
  ];
  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <Link href="/">
          <Image
            className="h-9 w-auto"
            src="/assets/logo.png"
            width={138}
            height={36}
            alt="logo"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-8 transition duration-500">
          {navlinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-slate-300 transition"
            >
              {link.text}
            </Link>
          ))}
        </div>
        <SignedOut>
          <div className="space-x-3">
            <SignUpButton>
              <Button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md active:scale-95">
                Get started
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button className="hover:bg-slate-300/20 transition px-6 py-2 border border-slate-400 rounded-md active:scale-95 bg-transparent">
                Login
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex space-x-3">
            <UserButton />
            <Link href="/dashboard">
              <ShinyButton className="bg-indigo-600 hover:bg-indigo-700 border-0">
                To Dashboard
              </ShinyButton>
            </Link>
          </div>
        </SignedIn>
        <Button
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden active:scale-90 transition bg-transparent"
        >
          <MenuIcon className="size-6.5" />
        </Button>
      </motion.nav>
      <div
        className={`fixed inset-0 z-100 bg-black/60 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-transform duration-400 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navlinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.text}
          </Link>
        ))}
        <Button
          onClick={() => setIsMenuOpen(false)}
          className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
        >
          <XIcon />
        </Button>
      </div>
    </>
  );
}
