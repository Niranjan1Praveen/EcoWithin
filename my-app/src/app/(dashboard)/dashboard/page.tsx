"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GLBLoader from "@/components/glb-loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ripple } from "@/components/ui/ripple";

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

  const [isConnected, setIsConnected] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false); // New state for agent speaking status

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

    vapi.on("call-start", () => setIsConnected(true));
    vapi.on("call-end", () => {
      setIsConnected(false);
      setIsAgentSpeaking(false); // Reset speaking state when call ends
    });

    vapi.on("message", (message: any) => {
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

      // Check for speech-start and speech-end events
      if (message?.type === "speech-start" && message.role === "assistant") {
        setIsAgentSpeaking(true);
      }

      if (message?.type === "speech-end" && message.role === "assistant") {
        setIsAgentSpeaking(false);
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
      setIsAgentSpeaking(false); // Reset speaking state when manually stopping
    } catch (err) {
      console.error("Error stopping Vapi:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* ---------- Header ---------- */}
        <Card className="border border-indigo-700 bg-black p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
          <div className="flex flex-col gap-1 text-white">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Your Private Voice Space
            </h1>
            <p className="text-sm opacity-60 max-w-xl text-white">
              A calm, judgment-free AI companion designed to listen, understand,
              and gently guide you through your thoughts.
            </p>
          </div>

          <div className="flex items-center gap-4 text-white">
            {/* Connection status */}
            <div className="flex items-center gap-2 text-sm opacity-70 text-white">
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
        </Card>

        {/* ---------- Guidance Strip ---------- */}
        <div className="text-sm opacity-60 flex flex-wrap gap-x-6 gap-y-2 justify-center text-white">
          <span>• Speak naturally</span>
          <span>• You are in control</span>
          <span>• Your data stays private</span>
          <span>• No judgments, only listening</span>
        </div>

        {/* ---------- Main Models ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">

          {/* Assistant Model */}
          <Card className="relative border border-indigo-700 bg-black rounded-xl overflow-hidden group text-white">
            <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/40 to-transparent" />

            <div className="absolute top-4 left-4 z-10 flex flex-col text-white">
              <span className="text-sm font-medium opacity-80 text-white">
                Primary Listener
              </span>
              <span className="text-xs opacity-50 text-white">
                Leads the conversation
              </span>
            </div>

            <div className="h-full transition-transform duration-700 group-hover:scale-[1.02]">
              <GLBLoader
                modelPath="/assets/cutie_robo.glb"
                scale={1.2}
                cameraPosition={[0, 1.2, 5]}
                autoPlay={true}
                loop={true}
                enableZoom={true}
              />
            </div>
          </Card>

          {/* Companion Model */}
          <Card className="relative border border-indigo-700 bg-black rounded-xl overflow-hidden group text-white">
            <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/40 to-transparent" />

            <div className="absolute top-4 left-4 z-10 flex flex-col text-white">
              <span className="text-sm font-medium opacity-80 text-white">
                Emotional Mirror
              </span>
              <span className="text-xs opacity-50 text-white">
                Reflects your emotional state
              </span>
            </div>

            <div className="h-full transition-transform duration-700 group-hover:scale-[1.02]">
              <GLBLoader
                modelPath="/assets/female_robo.glb"
                scale={1.2}
                cameraPosition={[0, 1.2, 5]}
                autoPlay={true}
                loop={true}
                enableZoom={true}
              />
            </div>
          </Card>
        </div>

        {/* ---------- Footer Hint ---------- */}
        <div className="text-center text-xs opacity-40 text-white">
          You can stop the session anytime. Insights will be prepared after the
          conversation ends.
        </div>

        {/* Transcript intentionally kept commented */}
      </div>
    </div>
  );
}
