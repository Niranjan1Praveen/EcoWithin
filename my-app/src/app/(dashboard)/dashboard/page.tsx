"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type TranscriptItem = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
};

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

      // Request mic permission before starting
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // 👇 Start with just the assistant ID string
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
    <div className="flex flex-col h-screen p-6 gap-6 bg-black text-white">
      {/* Controls */}
      <Card className="p-4 border border-indigo-700 bg-black">
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

      {/* Transcript */}
      <Card className="flex-1 p-4 border border-indigo-700 bg-black">
        <h2 className="text-lg font-semibold mb-3 text-indigo-600">
          Communication Log
        </h2>

        <ScrollArea className="h-full pr-4">
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
    </div>
  );
}
