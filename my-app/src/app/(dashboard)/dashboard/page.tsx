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
    <div className="p-6 border-0 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-8 max-w-4xl w-full">
        {/* Header / Controls */}
        <Card className="p-8 w-full flex flex-col items-center justify-center gap-6 bg-transparent border-0 text-background">
          {/* Title and description */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold py-2">EchoAI</h1>
            <p className="text-sm opacity-60">
              Real-time voice interaction with animated agents
            </p>
          </div>

          {/* Button */}
          <div className="flex flex-col items-center gap-4">
            {!isConnected ? (
              <Button
                onClick={startConversation}
                className="bg-indigo-600 hover:bg-indigo-700 px-8 py-6 text-lg"
              >
                Start Conversation
              </Button>
            ) : (
              <Button
                onClick={stopConversation}
                className="bg-indigo-700 hover:bg-indigo-600 px-8 py-6 text-lg"
              >
                Stop Conversation
              </Button>
            )}
          </div>
        </Card>

        {/* Ripple component */}
        {/* {isConnected && (
          <div className="w-full flex items-center justify-center">
            <div className="relative w-full h-100 flex items-center justify-center">
              <Ripple
                className={`absolute inset-0 transition-opacity duration-300${
                  isAgentSpeaking ? "opacity-100" : "opacity-30"
                }`}
              />
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
