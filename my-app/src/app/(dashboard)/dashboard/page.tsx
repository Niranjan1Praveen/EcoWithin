"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, User, Mic, MicOff, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false); // Track user speech
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false); // Loading modal state
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [userSpeakingTimeout, setUserSpeakingTimeout] = useState<NodeJS.Timeout | null>(null);

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
      setIsConnecting(false); // Close loading modal
    });

    vapi.on("call-end", () => {
      setIsConnected(false);
      setIsAgentSpeaking(false);
      setIsUserSpeaking(false);
      if (userSpeakingTimeout) {
        clearTimeout(userSpeakingTimeout);
      }
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

      // Check for speech-start and speech-end events for ASSISTANT
      if (message?.type === "speech-start" && message.role === "assistant") {
        setIsAgentSpeaking(true);
      }

      if (message?.type === "speech-end" && message.role === "assistant") {
        setIsAgentSpeaking(false);
      }

      // Check for speech-start and speech-end events for USER
      if (message?.type === "speech-start" && message.role === "user") {
        setIsUserSpeaking(true);
        // Clear any existing timeout
        if (userSpeakingTimeout) {
          clearTimeout(userSpeakingTimeout);
        }
      }

      if (message?.type === "speech-end" && message.role === "user") {
        // Set a timeout to hide user speaking indicator after 500ms
        // This gives time for VAD (voice activity detection) to settle
        const timeout = setTimeout(() => {
          setIsUserSpeaking(false);
        }, 500);
        
        if (userSpeakingTimeout) {
          clearTimeout(userSpeakingTimeout);
        }
        setUserSpeakingTimeout(timeout);
      }
    });

    return () => {
      vapi.stop();
      vapiRef.current = null;
      if (userSpeakingTimeout) {
        clearTimeout(userSpeakingTimeout);
      }
    };
  }, []);

  /* -------- Toggle Microphone -------- */
  const toggleMic = () => {
    if (!mediaStreamRef.current) return;

    mediaStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMicOn(track.enabled);
    });
  };

  /* -------- Start Call -------- */
  const startConversation = async () => {
    try {
      setIsConnecting(true); // Show loading modal
      
      if (!vapiRef.current) {
        setIsConnecting(false);
        return;
      }

      const agentId = process.env.NEXT_PUBLIC_VAPI_AGENT_ID;
      if (!agentId) {
        console.error("Missing NEXT_PUBLIC_VAPI_AGENT_ID");
        setIsConnecting(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setIsMicOn(true);

      await vapiRef.current.start(agentId);
      // Note: The modal will automatically close when call-start event fires
    } catch (err) {
      console.error("Error starting Vapi:", err);
      setIsConnecting(false); // Hide loading modal on error
      alert("Failed to start conversation. Please check your microphone permissions.");
    }
  };

  /* -------- Stop Call -------- */
  const stopConversation = () => {
    try {
      vapiRef.current?.stop();

      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;

      setIsMicOn(false);
      setIsAgentSpeaking(false);
      setIsUserSpeaking(false);
      if (userSpeakingTimeout) {
        clearTimeout(userSpeakingTimeout);
      }
    } catch (err) {
      console.error("Error stopping Vapi:", err);
    }
  };

  return (
    <>
      {/* Loading Modal */}
      <Dialog open={isConnecting} onOpenChange={setIsConnecting}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-0">
          <DialogHeader>
            <DialogTitle className="text-white text-center">
              Connecting to AI Assistant
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-center">
              Please wait while we establish your secure voice connection...
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">                        
              {/* Inner spinner */}
              <div className="relative h-16 w-16 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              This usually takes 5-10 seconds...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen text-white p-6">
        {/* Add custom CSS for ping animation */}
        <style jsx global>{`
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          .animate-ping-fixed {
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
        `}</style>
        
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          {/* ---------- Header ---------- */}
          <div className="border-0 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
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
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Start Conversation"}
                </Button>
              ) : (
                <Button
                  onClick={stopConversation}
                  className="bg-indigo-700 hover:bg-indigo-600"
                >
                  End Session
                </Button>
              )}
              {isConnected && (
                <button
                  onClick={toggleMic}
                  className="h-10 w-10 rounded-full border border-indigo-600 flex items-center justify-center hover:bg-indigo-600/10 transition"
                  aria-label="Toggle microphone"
                >
                  {isMicOn ? (
                    <Mic className="h-5 w-5 text-indigo-500" />
                  ) : (
                    <MicOff className="h-5 w-5 text-indigo-500" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ---------- Main Models ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">

            {/* ---------- AI Assistant ---------- */}
            <Card className="relative bg-transparent border min-h-100 border-indigo-700 rounded-2xl flex flex-col justify-between overflow-hidden">

              {/* Header */}
              <div className="flex items-center gap-2 p-4 text-sm opacity-70 text-white">
                <Bot className="h-4 w-4 text-white" />
                Echo
              </div>

              {/* Center Avatar */}
              <div className="flex flex-1 items-center justify-center relative">

                {/* Ping animation when AI speaks - FIXED */}
                {isAgentSpeaking && (
                  <>
                    <div className="absolute flex items-center justify-center">
                      <div className="h-28 w-28 rounded-full bg-indigo-600 opacity-30 animate-ping-fixed"></div>
                    </div>
                    <div className="absolute flex items-center justify-center">
                      <div 
                        className="h-24 w-24 rounded-full bg-indigo-600 opacity-40 animate-ping-fixed"
                        style={{ animationDelay: '0.5s' }}
                      ></div>
                    </div>
                    <div className="absolute flex items-center justify-center">
                      <div 
                        className="h-20 w-20 rounded-full bg-indigo-600 opacity-50 animate-ping-fixed"
                        style={{ animationDelay: '1s' }}
                      ></div>
                    </div>
                  </>
                )}

                <div className={`h-24 w-24 rounded-full border flex items-center justify-center relative transition-all duration-300 z-10 ${
                  isAgentSpeaking 
                    ? 'border-indigo-400 shadow-lg shadow-indigo-500/30 scale-105' 
                    : 'border-indigo-600'
                }`}>
                  <Bot className={`h-10 w-10 transition-all duration-300 ${
                    isAgentSpeaking ? 'text-indigo-300 scale-110' : 'text-white'
                  }`} />

                  {/* Mic popup when AI speaks */}
                  {isAgentSpeaking && (
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center animate-bounce">
                      <Mic className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* ---------- User ---------- */}
            <Card className="relative bg-transparent border min-h-100 border-indigo-700 rounded-2xl flex flex-col justify-between overflow-hidden">

              {/* Header */}
              <div className="flex items-center gap-2 p-4 text-sm opacity-70 text-white">
                <User className="h-4 w-4 text-white" />
                You
              </div>

              {/* Center Avatar */}
              <div className="flex flex-1 items-center justify-center relative">

                {/* Ping animation when user speaks - FIXED */}
                {isUserSpeaking && isMicOn && (
                  <>
                    <div className="absolute flex items-center justify-center">
                      <div className="h-28 w-28 rounded-full bg-indigo-600 opacity-30 animate-ping-fixed"></div>
                    </div>
                    <div className="absolute flex items-center justify-center">
                      <div 
                        className="h-24 w-24 rounded-full bg-indigo-600 opacity-40 animate-ping-fixed"
                        style={{ animationDelay: '0.5s' }}
                      ></div>
                    </div>
                    <div className="absolute flex items-center justify-center">
                      <div 
                        className="h-20 w-20 rounded-full bg-indigo-600 opacity-50 animate-ping-fixed"
                        style={{ animationDelay: '1s' }}
                      ></div>
                    </div>
                  </>
                )}

                <div className={`h-24 w-24 rounded-full border flex items-center justify-center relative transition-all duration-300 z-10 ${
                  isUserSpeaking && isMicOn
                    ? 'border-indigo-400 shadow-lg shadow-indigo-500/30 scale-105' 
                    : 'border-indigo-600'
                }`}>
                  <User className={`h-10 w-10 transition-all duration-300 ${
                    isUserSpeaking && isMicOn ? 'text-indigo-300 scale-110' : 'text-white'
                  }`} />

                  {/* Mic popup when user speaks and mic is on */}
                  {isUserSpeaking && isMicOn && (
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center animate-bounce">
                      <Mic className="h-4 w-4 text-white" />
                    </div>
                  )}

                  {/* Static mic when connected but not speaking */}
                  {isConnected && isMicOn && !isUserSpeaking && (
                    <Mic className="absolute -bottom-2 -right-2 h-5 w-5 text-indigo-500 opacity-60" />
                  )}
                  
                  {/* Mic off indicator */}
                  {isConnected && !isMicOn && (
                    <MicOff className="absolute -bottom-2 -right-2 h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}