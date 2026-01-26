// lib/static/features.ts
import { LucideIcon, Mic, MessageSquare, Brain, Download } from "lucide-react";

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

export const featureCards: FeatureCard[] = [
  {
    id: "start-conversation",
    title: "Start Conversation",
    description: "Click 'Start Conversation' button and allow microphone access to begin",
    icon: Mic,
    color: "bg-indigo-900/30",
    iconColor: "text-indigo-400"
  },
  {
    id: "talk-freely",
    title: "Talk Freely",
    description: "Speak naturally about anything on your mind - Echo listens without judgment",
    icon: MessageSquare,
    color: "bg-purple-900/30",
    iconColor: "text-purple-400"
  },
  {
    id: "get-insights",
    title: "Get Insights",
    description: "Receive emotional analysis and personalized reflections after each session",
    icon: Brain,
    color: "bg-green-900/30",
    iconColor: "text-green-400"
  },
  {
    id: "save-review",
    title: "Save & Review",
    description: "Download your conversation transcript and track your emotional journey",
    icon: Download,
    color: "bg-blue-900/30",
    iconColor: "text-blue-400"
  }
];