"use client";
import { motion } from "framer-motion";
import React from "react";

interface SoundWavesProps {
  intensity?: number; 
  color?: string;
  count?: number;
}

const SoundWaves: React.FC<SoundWavesProps> = ({
  intensity = 5,
  color = "#ffffff",
  count = 5,
}) => {
  const waves = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {waves.map((wave) => (
        <motion.div
          key={wave}
          className="absolute rounded-full border-2"
          style={{
            borderColor: `${color}${Math.floor(30 - wave * 5).toString(16).padStart(2, '0')}`,
            width: `${200 + wave * 80 + intensity * 10}px`,
            height: `${200 + wave * 80 + intensity * 10}px`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3 - wave * 0.04, 0.1 - wave * 0.02, 0.3 - wave * 0.04],
          }}
          transition={{
            duration: 3,
            delay: wave * 0.3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

export default SoundWaves;