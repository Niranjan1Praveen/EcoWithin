"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bot,
  User,
  Mic,
  MicOff,
  Loader2,
  MessageSquare,
  Download,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { featureCards } from "../../../../../public/assets/data/agentSteps";
import { ShinyButton } from "@/components/ui/shiny-button";

// ---------------- Types ----------------
type TranscriptItem = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  transcriptType: "partial" | "final";
  sequence: number; // For ordering
};

type ConversationTurn = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  duration?: number;
};

// ---------------- Component ----------------
export default function VapiAgent() {
  const vapiRef = useRef<Vapi | null>(null);
  const initializedRef = useRef(false);

  const [isConnected, setIsConnected] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [isConversationEnded, setIsConversationEnded] = useState(false);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [conversationStartTime, setConversationStartTime] = useState<number>(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [userSpeakingTimeout, setUserSpeakingTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // For transcript processing
  const partialBufferRef = useRef<Map<string, TranscriptItem>>(new Map());
  const finalTurnsRef = useRef<Map<string, ConversationTurn>>(new Map());
  const sequenceCounterRef = useRef(0);
  const lastFinalRef = useRef<{ role: string; text: string } | null>(null);

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
      setIsConnecting(false);
      setIsConversationEnded(false); // Reset when new call starts
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      setConversationStartTime(Date.now());
      // Reset conversation on new call
      setTranscripts([]);
      setConversation([]);
      partialBufferRef.current.clear();
      finalTurnsRef.current.clear();
      sequenceCounterRef.current = 0;
      lastFinalRef.current = null;
    });

    vapi.on("call-end", () => {
      setIsConnected(false);
      setIsAgentSpeaking(false);
      setIsUserSpeaking(false);
      setIsConversationEnded(true); // Add this line

      if (userSpeakingTimeout) {
        clearTimeout(userSpeakingTimeout);
      }
      // Finalize any remaining partials
      finalizeAllPartials();
    });

    vapi.on("message", (message: any) => {
      console.log("Vapi Message:", message);

      // Handle transcripts
      if (message?.type === "transcript" && message.transcript) {
        const transcriptId = `${message.role}-${Date.now()}-${Math.random()}`;
        const sequence = sequenceCounterRef.current++;

        const transcriptItem: TranscriptItem = {
          id: transcriptId,
          role: message.role === "assistant" ? "assistant" : "user",
          text: message.transcript,
          timestamp: Date.now(),
          transcriptType: message.transcriptType || "partial",
          sequence,
        };

        // Add to transcripts list for debugging
        setTranscripts((prev) => [...prev, transcriptItem]);

        // Process based on transcript type
        if (message.transcriptType === "partial") {
          handlePartialTranscript(transcriptItem);
        } else if (message.transcriptType === "final") {
          handleFinalTranscript(transcriptItem);
        }
      }

      // Speech detection for ASSISTANT
      if (message?.type === "speech-start" && message.role === "assistant") {
        setIsAgentSpeaking(true);
      }

      if (message?.type === "speech-end" && message.role === "assistant") {
        setIsAgentSpeaking(false);
      }

      // Speech detection for USER
      if (message?.type === "speech-start" && message.role === "user") {
        setIsUserSpeaking(true);
        if (userSpeakingTimeout) {
          clearTimeout(userSpeakingTimeout);
        }
      }

      if (message?.type === "speech-end" && message.role === "user") {
        const timeout = setTimeout(() => {
          setIsUserSpeaking(false);
        }, 300);

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

  /* -------- Transcript Processing Functions -------- */
  const handlePartialTranscript = (transcript: TranscriptItem) => {
    // Store in buffer for this role
    partialBufferRef.current.set(transcript.role, transcript);

    // Update conversation with latest partial
    updateConversationFromBuffer();
  };

  const handleFinalTranscript = (transcript: TranscriptItem) => {
    // Remove partial for this role
    partialBufferRef.current.delete(transcript.role);

    // Create conversation turn
    const turn: ConversationTurn = {
      id: transcript.id,
      role: transcript.role,
      text: transcript.text,
      timestamp: transcript.timestamp,
    };

    // Store in final turns
    finalTurnsRef.current.set(transcript.id, turn);

    // Update conversation
    updateConversationFromFinalTurns();

    // Update last final reference
    lastFinalRef.current = { role: transcript.role, text: transcript.text };
  };

  const updateConversationFromBuffer = () => {
    const turns: ConversationTurn[] = [];

    // Add all final turns first
    finalTurnsRef.current.forEach((turn) => {
      turns.push(turn);
    });

    // Add partials for ongoing speech
    partialBufferRef.current.forEach((transcript) => {
      turns.push({
        id: transcript.id,
        role: transcript.role,
        text: transcript.text,
        timestamp: transcript.timestamp,
      });
    });

    // Sort by sequence/timestamp
    turns.sort((a, b) => {
      const aTime = a.timestamp;
      const bTime = b.timestamp;
      return aTime - bTime;
    });

    setConversation(turns);
  };

  const updateConversationFromFinalTurns = () => {
    const turns: ConversationTurn[] = Array.from(
      finalTurnsRef.current.values(),
    );

    // Sort by timestamp
    turns.sort((a, b) => a.timestamp - b.timestamp);

    setConversation(turns);
  };

  const finalizeAllPartials = () => {
    // Convert remaining partials to finals
    partialBufferRef.current.forEach((transcript, role) => {
      const turn: ConversationTurn = {
        id: transcript.id + "-finalized",
        role: transcript.role,
        text: transcript.text,
        timestamp: transcript.timestamp,
      };
      finalTurnsRef.current.set(turn.id, turn);
    });

    partialBufferRef.current.clear();
    updateConversationFromFinalTurns();
  };

  /* -------- Audio Level Detection -------- */
  const startAudioLevelDetection = (stream: MediaStream) => {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const detectAudio = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setAudioLevel(average);

        // If audio level is high and we're connected, user might be speaking
        if (average > 20 && isConnected && isMicOn && !isAgentSpeaking) {
          setIsUserSpeaking(true);
        }

        requestAnimationFrame(detectAudio);
      };

      detectAudio();
    } catch (err) {
      console.error("Audio level detection error:", err);
    }
  };

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
      setIsConnecting(true);

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

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
      setIsMicOn(true);

      // Start audio level detection
      startAudioLevelDetection(stream);

      await vapiRef.current.start(agentId);
    } catch (err) {
      console.error("Error starting Vapi:", err);
      setIsConnecting(false);
      alert(
        "Failed to start conversation. Please check your microphone permissions.",
      );
    }
  };

  /* -------- Stop Call -------- */
  const stopConversation = () => {
    try {
      vapiRef.current?.stop();

      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;

      if (analyserRef.current) {
        analyserRef.current = null;
      }

      setIsMicOn(false);
      setIsAgentSpeaking(false);
      setIsUserSpeaking(false);
      setIsConversationEnded(true); // Add this line

      if (userSpeakingTimeout) {
        clearTimeout(userSpeakingTimeout);
      }
    } catch (err) {
      console.error("Error stopping Vapi:", err);
    }
  };

  /* -------- Utility Functions -------- */
  const formatTranscript = () => {
    return conversation
      .map(
        (turn) => `${turn.role === "assistant" ? "Echo" : "You"}: ${turn.text}`,
      )
      .join("\n\n");
  };

  const downloadTranscript = () => {
    const transcript = formatTranscript();
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `echowithin-conversation-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  // Add this function inside your VapiAgent component
  const saveConversation = async (conversationData: ConversationTurn[]) => {
    const totalMessages = conversationData.length;
    const userMessages = conversationData.filter(
      (t) => t.role === "user",
    ).length;
    const assistantMessages = conversationData.filter(
      (t) => t.role === "assistant",
    ).length;
    const duration = conversationStartTime
      ? Date.now() - conversationStartTime
      : 0;

    const payload = {
      session_id: sessionId,
      start_time: new Date(conversationStartTime).toISOString(),
      end_time: new Date().toISOString(),
      total_duration: duration,
      total_messages: totalMessages,
      user_messages: userMessages,
      assistant_messages: assistantMessages,
      transcript_json: conversationData,
      transcript_summary: `${totalMessages} messages conversation`,
    };

    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Saved ${totalMessages} messages!`);
        return true;
      } else {
        alert(`❌ Error: ${data.error}`);
        return false;
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("❌ Network error");
      return false;
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
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* ---------- Header ---------- */}
          <div className="border-0 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Your Private Voice Space
              </h1>
              <p className="text-sm opacity-60 max-w-xl">
                A calm, judgment-free AI companion designed to listen,
                understand, and gently guide you through your thoughts.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Connection status */}
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
                  className="bg-indigo-600 hover:bg-indigo-700 border-0"
                  disabled={isConnecting}
                  asChild
                >
                  <ShinyButton>
                    {isConnecting ? "Connecting..." : "Start Conversation"}
                  </ShinyButton>
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

          {/* ---------- Features Cards ---------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="rounded-xl p-4 transition-all hover:bg-gray-800/40"
                >
                  <div className="flex items-start gap-3">
                    <div className={`${feature.color} p-2 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* ---------- Main Models ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            {/* ---------- AI Assistant ---------- */}
            <Card className="relative bg-transparent border-2 min-h-100 border-indigo-700 rounded-2xl flex flex-col justify-between overflow-hidden">
              <div className="flex items-center gap-2 p-4 text-sm opacity-70">
                <Bot className="h-4 w-4" />
                Echo
              </div>

              <div className="flex flex-1 items-center justify-center relative">
                {isAgentSpeaking && (
                  <>
                    <div className="absolute flex items-center justify-center">
                      <div className="h-28 w-28 rounded-full bg-indigo-600 opacity-30 animate-ping-fixed"></div>
                    </div>
                    <div className="absolute flex items-center justify-center">
                      <div
                        className="h-24 w-24 rounded-full bg-indigo-600 opacity-40 animate-ping-fixed"
                        style={{ animationDelay: "0.5s" }}
                      ></div>
                    </div>
                    <div className="absolute flex items-center justify-center">
                      <div
                        className="h-20 w-20 rounded-full bg-indigo-600 opacity-50 animate-ping-fixed"
                        style={{ animationDelay: "1s" }}
                      ></div>
                    </div>
                  </>
                )}

                <div
                  className={`h-24 w-24 rounded-full border-2 flex items-center justify-center relative transition-all duration-300 z-10 ${
                    isAgentSpeaking
                      ? "border-indigo-400 shadow-lg shadow-indigo-500/30 scale-105"
                      : "border-indigo-600"
                  }`}
                >
                  <Bot
                    className={`h-10 w-10 transition-all duration-300 ${
                      isAgentSpeaking
                        ? "text-indigo-300 scale-110"
                        : "text-white"
                    }`}
                  />

                  {isAgentSpeaking && (
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center animate-bounce">
                      <Mic className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* ---------- User ---------- */}
            <Card className="relative bg-transparent border-2 min-h-100 border-indigo-700 rounded-2xl flex flex-col justify-between overflow-hidden">
              <div className="flex items-center gap-2 p-4 text-sm opacity-70">
                <User className="h-4 w-4" />
                You
              </div>

              <div className="flex flex-1 items-center justify-center relative">
                {isUserSpeaking && isMicOn && (
                  <>
                    <div className="absolute flex items-center justify-center">
                      <div className="h-28 w-28 rounded-full bg-indigo-600 opacity-30 animate-ping-fixed"></div>
                    </div>
                    <div className="absolute flex items-center justify-center">
                      <div
                        className="h-24 w-24 rounded-full bg-indigo-600 opacity-40 animate-ping-fixed"
                        style={{ animationDelay: "0.5s" }}
                      ></div>
                    </div>
                    <div className="absolute flex items-center justify-center">
                      <div
                        className="h-20 w-20 rounded-full bg-indigo-600 opacity-50 animate-ping-fixed"
                        style={{ animationDelay: "1s" }}
                      ></div>
                    </div>
                  </>
                )}

                <div
                  className={`h-24 w-24 rounded-full border-2 flex items-center justify-center relative transition-all duration-300 z-10 ${
                    isUserSpeaking && isMicOn
                      ? "border-indigo-400 shadow-lg shadow-indigo-500/30 scale-105"
                      : "border-indigo-600"
                  }`}
                >
                  <User
                    className={`h-10 w-10 transition-all duration-300 ${
                      isUserSpeaking && isMicOn
                        ? "text-indigo-300 scale-110"
                        : "text-white"
                    }`}
                  />

                  {isUserSpeaking && isMicOn && (
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center animate-bounce">
                      <Mic className="h-4 w-4" />
                    </div>
                  )}

                  {isConnected && isMicOn && !isUserSpeaking && (
                    <Mic className="absolute -bottom-2 -right-2 h-5 w-5 text-indigo-500 opacity-60" />
                  )}

                  {isConnected && !isMicOn && (
                    <MicOff className="absolute -bottom-2 -right-2 h-5 w-5 text-red-500" />
                  )}
                </div>

                {/* Audio level indicator */}
                {isConnected && (
                  <div className="absolute bottom-4 w-full px-4">
                    <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-100"
                        style={{ width: `${Math.min(100, audioLevel)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
          {/* Show "View Transcript" button when conversation ends but transcript isn't expanded */}
          {isConversationEnded &&
            conversation.length > 0 &&
            !showFullTranscript && (
              <div className="text-center">
                <Button
                  onClick={() => setShowFullTranscript(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Conversation Transcript
                </Button>
                <p className="text-sm text-gray-400 mt-2">
                  Your conversation has ended. Click to view the transcript.
                </p>
              </div>
            )}
          {/* ---------- Conversation Transcript ---------- */}
          {isConversationEnded && conversation.length > 0 && (
            <Card className="bg-transparent border-0 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-lg text-white font-bold">
                      Conversation Transcript
                    </h2>
                    <span className="text-sm text-muted-foreground ml-2">
                      {conversation.length} messages
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setShowFullTranscript(!showFullTranscript)}
                      className="bg-transparent"
                    >
                      {showFullTranscript ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Show More
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      onClick={downloadTranscript}
                      className="bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => saveConversation(conversation)}
                      disabled={conversation.length === 0}
                      className="bg-transparent hover:bg-green-600/20"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>

                <div
                  className={`space-y-4 transition-all duration-300 ${
                    showFullTranscript ? "max-h-150" : "max-h-75"
                  } overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-transparent`}
                >
                  {conversation.map((turn, index) => (
                    <div
                      key={turn.id}
                      className={`flex gap-4 p-4 rounded-lg ${
                        turn.role === "assistant"
                          ? "bg-indigo-900/20 border border-indigo-800/30"
                          : "bg-gray-800/20 border border-gray-700/30"
                      }`}
                    >
                      <div className="shrink-0">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            turn.role === "assistant"
                              ? "bg-indigo-600"
                              : "bg-gray-600"
                          }`}
                        >
                          {turn.role === "assistant" ? (
                            <Bot className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold">
                            {turn.role === "assistant" ? "Echo" : "You"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(turn.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-200 whitespace-pre-wrap wrap-break-word">
                          {turn.text}
                          {partialBufferRef.current.has(turn.role) &&
                            index === conversation.length - 1 && (
                              <span className="inline-block h-3 w-1 bg-indigo-400 ml-1 animate-pulse" />
                            )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {!showFullTranscript && conversation.length > 3 && (
                  <div className="text-center pt-4 border-t border-gray-800 mt-4">
                    <button
                      onClick={() => setShowFullTranscript(true)}
                      className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center justify-center gap-1 mx-auto"
                    >
                      Show {conversation.length - 3} more messages
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
