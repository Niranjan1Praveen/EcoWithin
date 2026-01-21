// lib/types/conversation.ts
export type TranscriptItem = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  transcriptType: "partial" | "final";
  sequence: number;
};

export type ConversationTurn = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  duration?: number;
};