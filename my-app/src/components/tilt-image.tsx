"use client";

import { useRef, useState, MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { Variants } from "framer-motion";
import { Ripple } from "./ui/ripple";

/* ----------------------------- Config ----------------------------- */

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

interface TiltedImageProps {
  rotateAmplitude?: number;
}

/* ------------------------ Floating Animation ----------------------- */

const floatingVariants: Variants = {
  float: (i: number) => ({
    y: [0, -6, 0],
    transition: {
      duration: 4 + i,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  }),
};

/* -------------------------- Card Config ---------------------------- */

import { Ear, Waves, Brain, Sparkles } from "lucide-react";

const FLOATING_CARDS = [
  {
    id: 0,
    position: "top-12 left-[-20px]",
    baseRotate: -15,
    content: (
      <div className="text-white text-xs font-medium text-center">
        <Ear className="w-4 h-4 mx-auto mb-1 text-[#4ECDC4]" />
        <span>Deep Listening</span>
      </div>
    ),
  },
  {
    id: 1,
    position: "top-20 right-[-60px]",
    baseRotate: 12,
    content: (
      <div className="text-white text-xs font-medium text-center">
        <Waves className="w-4 h-4 mx-auto mb-1 text-[#8B8DF8]" />
        <span>Voice Analysis</span>
      </div>
    ),
  },
  {
    id: 2,
    position: "bottom-24 left-[-80px]",
    baseRotate: -2,
    content: (
      <div className="text-white text-xs font-medium text-center">
        <Brain className="w-4 h-4 mx-auto mb-1 text-[#FF8A65]" />
        <span>Emotion AI</span>
      </div>
    ),
  },
  {
    id: 3,
    position: "bottom-16 right-[-90px]",
    baseRotate: 15,
    content: (
      <div className="text-white text-xs font-medium text-center">
        <Sparkles className="w-4 h-4 mx-auto mb-1 text-white" />
        <span>Personal Insights</span>
      </div>
    ),
  },
] as const;

/* ------------------------ Floating Card ---------------------------- */

interface FloatingCardProps {
  index: number;
  position: string;
  baseRotate: number;
  children?: ReactNode;
}

function FloatingCard({
  index,
  position,
  baseRotate,
  children,
}: FloatingCardProps) {
  return (
    <motion.div
      custom={index}
      variants={floatingVariants}
      animate="float"
      className={`absolute ${position}
        w-40 h-24 rounded-xl
        bg-indigo-600/50 backdrop-blur-md
        border border-white/10
        shadow-[0_0_40px_rgba(99,102,241,0.25)]`}
      style={{ rotate: baseRotate }}
    >
      <div className="w-full h-full flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
}

/* --------------------------- Component ----------------------------- */

export default function TiltedImage({ rotateAmplitude = 3 }: TiltedImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    setLastY(offsetY);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.figure
      ref={ref}
      className="relative w-full perspective-midrange max-w-4xl mx-auto items-center justify-center hidden lg:flex"
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      initial={{ y: 150, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 320, damping: 70 }}
    >
      <motion.div
        className="relative transform-3d w-full max-w-4xl h-130"
        style={{ rotateX, rotateY }}
      >
        {/* Ripple */}
        <div className="absolute inset-0 -z-10">
          <Ripple numCircles={5} />
        </div>
        {/* Floating Cards */}
        <div className="hidden lg:block pointer-events-none absolute inset-1 z-10">
          {FLOATING_CARDS.map((card, i) => (
            <FloatingCard
              key={card.id}
              index={i}
              position={card.position}
              baseRotate={card.baseRotate}
            >
              {card.content}
            </FloatingCard>
          ))}
        </div>
      </motion.div>
    </motion.figure>
  );
}
