"use client";
import { motion } from "framer-motion";
import React from "react";

interface EmotionalAvatarProps {
  emotion?: "neutral" | "calm" | "warm" | "hopeful";
  size?: "sm" | "md" | "lg";
  showCallToAction?: boolean;
}

const EmotionalAvatar: React.FC<EmotionalAvatarProps> = ({
  emotion = "neutral",
  size = "md",
  showCallToAction = true,
}) => {
  const sizeClasses = {
    sm: "w-48 h-48",
    md: "w-64 h-64 md:w-80 md:h-80",
    lg: "w-96 h-96 md:w-[500px] md:h-[500px]",
  };

  const emotionColors = {
    neutral: {
      primary: "#8B8DF8",
      secondary: "#4ECDC4",
      accent: "#FF8A65",
    },
    calm: {
      primary: "#4ECDC4",
      secondary: "#8B8DF8",
      accent: "#8B8DF8",
    },
    warm: {
      primary: "#FF8A65",
      secondary: "#8B8DF8",
      accent: "#4ECDC4",
    },
    hopeful: {
      primary: "#8B8DF8",
      secondary: "#FF8A65",
      accent: "#4ECDC4",
    },
  };

  const currentColors = emotionColors[emotion];

  const emotionGradients = {
    neutral: [
      `radial-gradient(circle at 30% 30%, ${currentColors.primary}20, transparent 70%)`,
      `radial-gradient(circle at 70% 70%, ${currentColors.accent}20, transparent 70%)`,
      `radial-gradient(circle at 30% 70%, ${currentColors.secondary}20, transparent 70%)`,
    ],
    calm: [
      `radial-gradient(circle at 30% 30%, ${currentColors.primary}20, transparent 70%)`,
      `radial-gradient(circle at 70% 30%, ${currentColors.secondary}20, transparent 70%)`,
      `radial-gradient(circle at 50% 70%, ${currentColors.accent}20, transparent 70%)`,
    ],
    warm: [
      `radial-gradient(circle at 50% 30%, ${currentColors.primary}20, transparent 70%)`,
      `radial-gradient(circle at 30% 70%, ${currentColors.secondary}20, transparent 70%)`,
      `radial-gradient(circle at 70% 70%, ${currentColors.accent}20, transparent 70%)`,
    ],
    hopeful: [
      `radial-gradient(circle at 70% 30%, ${currentColors.primary}20, transparent 70%)`,
      `radial-gradient(circle at 30% 50%, ${currentColors.secondary}20, transparent 70%)`,
      `radial-gradient(circle at 70% 70%, ${currentColors.accent}20, transparent 70%)`,
    ],
  };

  const getEmotionAnimation = (emotionType: string) => {
    switch (emotionType) {
      case "calm":
        return {
          eyeScale: [1, 1.05, 1],
          eyeOpacity: [0.8, 0.9, 0.8],
          breathingDuration: 4,
        };
      case "warm":
        return {
          eyeScale: [1, 1.15, 1],
          eyeOpacity: [0.7, 1, 0.7],
          breathingDuration: 2.5,
        };
      case "hopeful":
        return {
          eyeScale: [1, 1.2, 1],
          eyeOpacity: [0.6, 1, 0.6],
          breathingDuration: 2,
        };
      default:
        return {
          eyeScale: [1, 1.1, 1],
          eyeOpacity: [0.7, 1, 0.7],
          breathingDuration: 3,
        };
    }
  };

  const animation = getEmotionAnimation(emotion);

  return (
    <div className="flex flex-col items-center">
      {/* 3D Model Container */}
      <div className="relative w-full aspect-square max-w-md mx-auto">
        {/* Abstract Human Face/Bust */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`relative ${sizeClasses[size]}`}>
            {/* Face Outline */}
            <div 
              className="absolute inset-0 rounded-full backdrop-blur-sm border border-white/10"
              style={{
                background: `linear-gradient(135deg, ${currentColors.primary}20, ${currentColors.primary}05)`,
              }}
            />
            
            {/* Eyes */}
            <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2">
              <motion.div 
                className="w-8 h-4 md:w-10 md:h-5 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${currentColors.secondary}, ${currentColors.primary})`,
                }}
                animate={{ 
                  scale: animation.eyeScale,
                  opacity: animation.eyeOpacity,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </div>
            <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2">
              <motion.div 
                className="w-8 h-4 md:w-10 md:h-5 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${currentColors.secondary}, ${currentColors.primary})`,
                }}
                animate={{ 
                  scale: animation.eyeScale,
                  opacity: animation.eyeOpacity,
                }}
                transition={{
                  duration: 2,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </div>
            
            {/* Breathing Animation */}
            <motion.div 
              className="absolute inset-4 rounded-full"
              style={{
                border: `2px solid ${currentColors.accent}30`,
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: animation.breathingDuration,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        </div>

        {/* Emotion Tint Overlay */}
        <motion.div
          className="absolute inset-0 rounded-full mix-blend-overlay"
          animate={{
            background: emotionGradients[emotion],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

    </div>
  );
};

export default EmotionalAvatar;