"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ---------------- Types ----------------
type TranscriptItem = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
};

// ---------------- Component ----------------
export default function VapiAgent() {
  const vapiRef = useRef<Vapi | null>(null);
  const initializedRef = useRef(false);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [sessionEnded, setSessionEnded] = useState(false);

  // Auto-scroll to bottom when new transcript is added
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = 
        transcriptContainerRef.current.scrollHeight;
    }
  }, [transcripts]);

  /* -------- Initialize Vapi SDK -------- */
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!key) {
      console.error("Missing NEXT_PUBLIC_VAPI_PUBLIC_KEY");
      return;
    }

    const vapi = new Vapi(key);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setIsConnected(true);
      setSessionEnded(false);
      setTranscripts([]);
    });

    vapi.on("call-end", () => {
      setIsConnected(false);
      setIsAgentSpeaking(false);
      setIsUserSpeaking(false);
      setSessionEnded(true);
    });

    vapi.on("message", (message: any) => {
      // -------- Transcripts --------
      if (message?.type === "transcript" && message.text) {
        setTranscripts((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: message.role === "assistant" ? "assistant" : "user",
            text: message.text,
            timestamp: Date.now(),
          },
        ]);
      }

      // -------- Speaking Detection --------
      if (message?.type === "speech-start") {
        if (message.role === "assistant") {
          setIsAgentSpeaking(true);
        } else {
          setIsUserSpeaking(true);
        }
      }

      if (message?.type === "speech-end") {
        if (message.role === "assistant") {
          setIsAgentSpeaking(false);
        } else {
          setIsUserSpeaking(false);
        }
      }
    });

    return () => {
      vapi.stop();
      vapiRef.current = null;
    };
  }, []);

  /* -------- Start Call -------- */
  const startConversation = async () => {
    try {
      if (!vapiRef.current) return;

      const agentId = process.env.NEXT_PUBLIC_VAPI_AGENT_ID;
      if (!agentId) {
        console.error("Missing NEXT_PUBLIC_VAPI_AGENT_ID");
        return;
      }

      await navigator.mediaDevices.getUserMedia({ audio: true });
      await vapiRef.current.start(agentId);
    } catch (err) {
      console.error("Error starting Vapi:", err);
    }
  };

  /* -------- Stop Call -------- */
  const stopConversation = () => {
    try {
      vapiRef.current?.stop();
      setIsAgentSpeaking(false);
      setIsUserSpeaking(false);
      setSessionEnded(true);
    } catch (err) {
      console.error("Error stopping Vapi:", err);
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* ---------- Header ---------- */}
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Your Private Voice Space
            </h1>
            <p className="text-sm opacity-60 max-w-xl">
              A calm, judgment-free AI companion designed to listen, understand,
              and gently guide you through your thoughts.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm opacity-70">
              <span
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-indigo-600 animate-pulse" : "bg-gray-500"
                }`}
              />
              {isConnected ? "Session live" : "Not connected"}
            </div>

            {!isConnected ? (
              <Button
                onClick={startConversation}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Start Conversation
              </Button>
            ) : (
              <Button
                onClick={stopConversation}
                className="bg-indigo-700 hover:bg-indigo-600"
              >
                End Session
              </Button>
            )}
          </div>
        </div>

        {/* ---------- Main Models ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Agent */}
          <Card
            className={`relative bg-black rounded-xl overflow-hidden text-white
              ${isAgentSpeaking ? "border-2 border-indigo-700" : "border border-indigo-700"}
            `}
          >
            <div className="absolute top-4 left-4">
              <span className="text-sm opacity-80">Primary Listener</span>
            </div>

            <div className="h-64 flex items-center justify-center">
              <img
                src="https://github.com/shadcn.png"
                alt="Agent"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
          </Card>

          {/* User */}
          <Card
            className={`relative bg-black rounded-xl overflow-hidden text-white
              ${isUserSpeaking ? "border-2 border-indigo-700" : "border border-indigo-700"}
            `}
          >
            <div className="absolute top-4 left-4">
              <span className="text-sm opacity-80">Emotional Mirror</span>
            </div>

            <div className="h-64 flex items-center justify-center">
              <img
                src="https://github.com/shadcn.png"
                alt="User"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
          </Card>
        </div>

        {/* ---------- Live Transcript (During Conversation) ---------- */}
        {(isConnected || sessionEnded) && transcripts.length > 0 && (
          <div className="mt-6 border border-indigo-700 rounded-xl p-4">
            <h2 className="text-sm font-medium opacity-80 mb-3">
              {isConnected ? "Live Transcript" : "Conversation Transcript"}
            </h2>

            <div 
              ref={transcriptContainerRef}
              className="flex flex-col gap-3 text-sm max-h-64 overflow-y-auto"
            >
              {transcripts.map((t) => (
                <div 
                  key={t.id}
                  className={`p-3 rounded-lg ${
                    t.role === "assistant" 
                      ? "bg-indigo-900/30 border-l-4 border-indigo-500" 
                      : "bg-gray-800/30 border-l-4 border-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`h-2 w-2 rounded-full ${
                      t.role === "assistant" ? "bg-indigo-500" : "bg-gray-500"
                    }`} />
                    <span className="font-medium opacity-80">
                      {t.role === "assistant" ? "Agent" : "You"}
                    </span>
                  </div>
                  <p className="opacity-90">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- Footer ---------- */}
        <div className="text-center text-xs opacity-40">
          You can stop the session anytime. Insights will be prepared after the
          conversation ends.
        </div>

      </div>
    </div>
  );
}