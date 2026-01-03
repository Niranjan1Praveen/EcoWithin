"use client";
import React, { useState } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  Settings,
  User,
  Bot,
  MessageSquare,
} from "lucide-react";

interface Message {
  speaker: "ai" | "user";
  text: string;
  time: string;
}

const Agent: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAccent, setSelectedAccent] = useState("Indian Neutral");
  const [isCallActive, setIsCallActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  const accents = [
    { id: "indian", name: "Indian Neutral", code: "IN" },
    { id: "british", name: "British Calm", code: "UK" },
    { id: "american", name: "American Warm", code: "US" },
  ];

  const startCall = () => {
    setIsCallActive(true);
    // Vapi integration will go here
  };

  const endCall = () => {
    setIsCallActive(false);
    // Vapi integration will go here
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Vapi integration will go here
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      speaker: "user",
      text: inputText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Vapi integration for text input will go here
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              EchoWithin Voice Session
            </h1>
            <p className="text-gray-400">
              Accent-adaptive AI for emotional discovery
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 ${
                isCallActive ? "text-green-400" : "text-gray-400"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  isCallActive ? "bg-green-500 animate-pulse" : "bg-gray-500"
                }`}
              ></div>
              <span className="text-sm">{isCallActive ? "Live" : "Ready"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Agent & User */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent and User Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Agent Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        EchoWithin AI
                      </h3>
                      <p className="text-sm text-gray-400">
                        Emotional Companion
                      </p>
                    </div>
                  </div>
                  {isCallActive && (
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Active</span>
                    </div>
                  )}
                </div>

                {/* Accent Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select AI Accent
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {accents.map((accent) => (
                      <button
                        key={accent.id}
                        onClick={() => setSelectedAccent(accent.name)}
                        disabled={isCallActive}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          selectedAccent === accent.name
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        } ${
                          isCallActive ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {accent.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4">
                  <div className="text-sm text-gray-400">
                    {isCallActive
                      ? "Active in conversation"
                      : "Ready to connect"}
                  </div>
                </div>
              </div>

              {/* User Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">You</h3>
                      <p className="text-sm text-gray-400">Speaking</p>
                    </div>
                  </div>
                  {isCallActive && (
                    <button
                      onClick={toggleMute}
                      className={`p-2 rounded-lg ${
                        isMuted ? "bg-red-500/20" : "bg-green-500/20"
                      }`}
                    >
                      {isMuted ? (
                        <MicOff className="w-5 h-5 text-red-400" />
                      ) : (
                        <Mic className="w-5 h-5 text-green-400" />
                      )}
                    </button>
                  )}
                </div>

                {/* User Status */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Status</span>
                      <span
                        className={
                          isCallActive ? "text-green-400" : "text-gray-400"
                        }
                      >
                        {isCallActive ? "In Conversation" : "Ready"}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          isCallActive
                            ? "bg-green-500 w-full"
                            : "bg-gray-600 w-1/4"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Area */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Conversation
                </h3>
                <div className="text-sm text-gray-400">
                  {isCallActive
                    ? "Live transcription"
                    : "Start a call to begin"}
                </div>
              </div>

              {/* Messages Container */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {isCallActive
                      ? "Start speaking to see the conversation here..."
                      : "Start a conversation to begin your emotional discovery journey"}
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.speaker === "ai" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          msg.speaker === "ai"
                            ? "bg-gray-700/50 rounded-tl-none"
                            : "bg-indigo-600/20 border border-indigo-500/30 rounded-tr-none"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              msg.speaker === "ai"
                                ? "bg-green-400"
                                : "bg-blue-400"
                            }`}
                          ></div>
                          <span className="text-xs text-gray-400">
                            {msg.speaker === "ai" ? "EchoWithin AI" : "You"} •{" "}
                            {msg.time}
                          </span>
                        </div>
                        <p className="text-white">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="space-y-4">
                {isCallActive ? (
                  <>
                    {/* Speech Input Visualizer */}
                    <div className="flex items-center justify-center gap-1 py-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-6 bg-indigo-500 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-400">
                      Speaking... Voice is being transcribed in real-time
                    </p>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-400 mb-4">
                      Ready to start your emotional discovery conversation?
                    </p>
                  </div>
                )}

                {/* Text Input Fallback */}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    placeholder={
                      isCallActive
                        ? "Type or speak..."
                        : "Start a call to begin"
                    }
                    disabled={!isCallActive}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!isCallActive || !inputText.trim()}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl text-white transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* Call Controls */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Session Controls
              </h3>

              <div className="space-y-4">
                {!isCallActive ? (
                  <button
                    onClick={startCall}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition-colors"
                  >
                    <Mic className="w-5 h-5" />
                    Start Conversation
                  </button>
                ) : (
                  <button
                    onClick={endCall}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors"
                  >
                    <PhoneOff className="w-5 h-5" />
                    End Conversation
                  </button>
                )}

                <button
                  className="w-full flex items-center justify-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors"
                  disabled={!isCallActive}
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
              </div>

              {/* Status Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Accent Selected</span>
                  <span className="text-sm font-medium text-white">
                    {selectedAccent}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Call Status</span>
                  <span
                    className={`text-sm font-medium ${
                      isCallActive ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {isCallActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Microphone</span>
                  <span
                    className={`text-sm font-medium ${
                      isMuted ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {isMuted ? "Muted" : "Active"}
                  </span>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agent;
