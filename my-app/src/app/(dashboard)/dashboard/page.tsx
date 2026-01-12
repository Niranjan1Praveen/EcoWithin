"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GLBLoader from "@/components/glb-loader";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    vapi.on("call-end", () => setIsConnected(false));

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
    } catch (err) {
      console.error("Error stopping Vapi:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-rows-[auto_1fr] gap-6 h-full">
        {/* Header / Controls */}
        <Card className="p-4 border border-indigo-700 bg-black flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">Voice AI Assistant</h1>
            <p className="text-sm opacity-60">
              Real-time voice interaction with animated agents
            </p>
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
              Stop Conversation
            </Button>
          )}
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Model 1 */}
          <Card className="relative border border-indigo-700 bg-black rounded-lg overflow-hidden">
            <div className="absolute top-3 left-3 z-10 text-sm opacity-70">
              Assistant Model
            </div>
            <GLBLoader
              modelPath="/assets/cutie_robo.glb"
              scale={1.2}
              cameraPosition={[0, 1.2, 5]}
              autoPlay={true}
              loop={true}
              enableZoom={true}
            />
          </Card>

          {/* Model 2 */}
          <Card className="relative border border-indigo-700 bg-black rounded-lg overflow-hidden">
            <div className="absolute top-3 left-3 z-10 text-sm opacity-70">
              Companion Model
            </div>
            <GLBLoader
              modelPath="/assets/female_robo.glb"
              scale={1.2}
              cameraPosition={[0, 1.2, 5]}
              autoPlay={true}
              loop={true}
              enableZoom={true}
            />
          </Card>
        </div>

        {/* Transcript (kept commented intentionally)
        <Card className="p-4 border border-indigo-700 bg-black">
          <h2 className="text-lg font-semibold mb-3">Communication Log</h2>
          <ScrollArea className="h-64 pr-4">
            <div className="flex flex-col gap-3">
              {transcripts.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border ${
                    item.role === "assistant"
                      ? "border-indigo-700 bg-indigo-700/10"
                      : "border-indigo-600 bg-indigo-600/10"
                  }`}
                >
                  <div className="text-xs opacity-60 mb-1">
                    {item.role === "assistant" ? "AI" : "You"} ·{" "}
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                  <div>{item.text}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
        */}
      </div>
    </div>
  );
}
