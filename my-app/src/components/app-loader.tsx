"use client";

import { Loader2, Brain, Sparkles, Heart } from "lucide-react";
import { useEffect, useState } from "react";

type LoadingInsightsProps = {
  title?: string;
  subtitle?: string;
  estimatedTime?: number; // in seconds
};

export default function LoadingInsights({ 
  title = "Analyzing Your Conversation", 
  subtitle = "Processing emotional insights and patterns",
  estimatedTime = 15
}: LoadingInsightsProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Brain, text: "Analyzing vocal patterns" },
    { icon: Sparkles, text: "Processing emotional cues" },
    { icon: Heart, text: "Generating insights" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 100 / (estimatedTime * 2); // Adjust speed
      });
    }, 500);

    // Rotate through steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [estimatedTime]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-950 text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Animated Logo/Icon */}
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 animate-pulse"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <Brain className="h-16 w-16 text-white" />
          </div>
          
          {/* Orbiting dots */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-4 w-4 rounded-full bg-indigo-400 animate-bounce"></div>
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
            <div className="h-4 w-4 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="h-4 w-4 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-gray-300 text-lg">
            {subtitle}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>0%</span>
            <span>{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  index === currentStep
                    ? "border-indigo-500 bg-indigo-500/10 scale-105"
                    : "border-gray-700 bg-gray-800/30"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-3 rounded-full ${
                    index === currentStep
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                      : "bg-gray-700"
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      index === currentStep ? "text-white" : "text-gray-400"
                    }`} />
                  </div>
                  <span className={`font-medium ${
                    index === currentStep ? "text-indigo-300" : "text-gray-400"
                  }`}>
                    {step.text}
                  </span>
                  {index === currentStep && (
                    <div className="flex space-x-1">
                      <div className="h-1 w-1 rounded-full bg-indigo-400 animate-pulse"></div>
                      <div className="h-1 w-1 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-1 w-1 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Estimated Time */}
        <div className="text-gray-400 text-sm mt-8">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Estimated time: {estimatedTime} seconds</span>
          </div>
          <p className="mt-2 text-gray-500">
            Please don't close this window while we analyze your emotional journey
          </p>
        </div>

        {/* Fun Facts */}
        <div className="mt-12 p-4 bg-gray-800/30 rounded-xl border border-gray-700 max-w-md mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 mb-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Did you know?</span>
          </div>
          <p className="text-sm text-gray-300">
            Our AI is analyzing not just what you said, but how you said it—detecting subtle emotional cues in your voice patterns.
          </p>
        </div>
      </div>
    </div>
  );
}