// components/ConversationAnalysis.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Brain,
  Heart,
  Mic,
  Activity,
  Clock,
  MessageSquare,
  TrendingUp,
  Hash,
  Loader2,
} from "lucide-react";

interface Session {
  session_id: string;
  user_name: string;
  date: string;
  message_count: number;
  duration: number;
}

interface AnalysisData {
  success: boolean;
  metadata: {
    session_id: string;
    user_id: string;
    user_name: string;
    created_at: string;
  };
  overall_metrics: {
    session_id: string;
    total_user_messages: number;
    conversation_date: string;
    duration_seconds: number;
    dominant_emotion: string;
    emotional_shifts: number;
    avg_message_length: number;
    vocabulary_richness: number;
  };
  layers: {
    layer1_audio: any[];
    layer2_semantic: any[];
    layer3_patterns: any;
    layer4_journey: any;
  };
  charts: {
    emotion_timeline: { index: number; emotion: string; score: number }[];
    emotion_distribution: { name: string; value: number }[];
    message_lengths: { message: number; length: number }[];
  };
}

const COLORS = [
  "#8B8DF8", // Soft Lavender
  "#FF8A65", // Warm Coral
  "#4ECDC4", // Mint Glow
  "#FF6B6B", // Coral Red
  "#45B7D1", // Sky Blue
  "#96CEB4", // Sage
];

export default function ConversationAnalysis() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      const response = await fetch("http://localhost:5000/api/sessions");
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
      } else {
        setError("Failed to load sessions");
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Could not connect to analysis server");
    } finally {
      setSessionsLoading(false);
    }
  };

  const fetchAnalysis = async (sessionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/analyze/${sessionId}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data);
      } else {
        setError(data.error || "Failed to analyze conversation");
      }
    } catch (err) {
      console.error("Error fetching analysis:", err);
      setError("Could not connect to analysis server");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelect = (value: string) => {
    setSelectedSession(value);
    fetchAnalysis(value);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-11/12 mx-auto flex-col min-h-screen space-y-6">
      {/* Session Selector */}
      <Card className="p-6 bg-gray-900/50 border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label className="text-sm text-gray-400 mb-2 block">
              Select Conversation to Analyze
            </label>
            <Select onValueChange={handleSessionSelect} disabled={sessionsLoading}>
              <SelectTrigger className="w-full md:w-[400px] bg-gray-800 border-gray-700">
                <SelectValue placeholder={
                  sessionsLoading ? "Loading sessions..." : "Choose a conversation"
                } />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {sessions.map((session) => (
                  <SelectItem key={session.session_id} value={session.session_id}>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400">{session.user_name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({session.message_count} messages)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto mb-4" />
            <p className="text-gray-400">Analyzing conversation...</p>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <div className="space-y-6">
          {/* Overall Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-800 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">Dominant Emotion</p>
                  <p className="text-2xl font-bold text-white mt-1 capitalize">
                    {analysis.overall_metrics.dominant_emotion}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-indigo-400" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">Messages</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {analysis.overall_metrics.total_user_messages}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">User messages</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-400" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {formatDuration(analysis.overall_metrics.duration_seconds)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-400" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">Emotional Shifts</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {analysis.overall_metrics.emotional_shifts}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emotion Timeline */}
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-400">
                <Activity className="h-5 w-5 text-indigo-400" />
                Emotional Journey
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.charts.emotion_timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="index" 
                      stroke="#9CA3AF"
                      label={{ value: 'Message Sequence', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8B8DF8" 
                      name="Emotion Score"
                      strokeWidth={2}
                      dot={{ fill: '#8B8DF8', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Emotion Distribution */}
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-400">
                <Brain className="h-5 w-5 text-indigo-400" />
                Emotion Distribution
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysis.charts.emotion_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analysis.charts.emotion_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Message Lengths */}
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-400">
                <MessageSquare className="h-5 w-5 text-indigo-400" />
                Message Length Progression
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.charts.message_lengths}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="message" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                    />
                    <Bar dataKey="length" fill="#4ECDC4" name="Words per message" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Vocabulary */}
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-400">
                <Hash className="h-5 w-5 text-indigo-400" />
                Vocabulary & Engagement
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Vocabulary Size:</span>
                  <span className="text-2xl font-bold text-indigo-400">
                    {analysis.overall_metrics.vocabulary_richness}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Avg Message Length:</span>
                  <span className="text-xl font-semibold text-white">
                    {analysis.overall_metrics.avg_message_length} words
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Emotional Stability:</span>
                  <span className="text-xl font-semibold text-white">
                    {analysis.layers.layer4_journey.emotional_stability || "Medium"}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="layer1" className="w-full">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="layer1" className="text-indigo-400">Layer 1: Audio</TabsTrigger>
              <TabsTrigger value="layer2" className="text-indigo-400">Layer 2: Semantic</TabsTrigger>
              <TabsTrigger value="layer3" className="text-indigo-400">Layer 3: Patterns</TabsTrigger>
              <TabsTrigger value="layer4" className="text-indigo-400">Layer 4: Journey</TabsTrigger>
            </TabsList>

            <TabsContent value="layer1" className="mt-4">
              <Card className="p-6 bg-gray-900/50 border-gray-800">
                <div className="space-y-4">
                  {analysis.layers.layer1_audio.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-800 pb-4 last:border-0">
                      <p className="text-sm text-gray-400 mb-2">{item.text}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Energy</p>
                          <p className="font-medium text-indigo-400">{item.analysis.energy}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Pattern</p>
                          <p className="font-medium text-indigo-400">{item.analysis.speech_pattern}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Rate</p>
                          <p className="font-medium text-indigo-400">{item.analysis.speaking_rate} wpm</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Pauses</p>
                          <p className="font-medium text-indigo-400">{item.analysis.pauses_detected}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="layer2" className="mt-4">
              <Card className="p-6 bg-gray-900/50 border-gray-800">
                <div className="space-y-4">
                  {analysis.layers.layer2_semantic.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-800 pb-4 last:border-0">
                      <p className="text-sm text-gray-400 mb-2">{item.text}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Emotion</p>
                          <p className="font-medium text-indigo-400">
                            {item.analysis.primary_emotion}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Confidence</p>
                          <p className="font-medium text-indigo-400">{item.analysis.emotion_confidence}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Sentiment</p>
                          <p className="font-medium text-indigo-400">{item.analysis.sentiment}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Key Phrases</p>
                          <p className="font-medium text-sm text-indigo-400">
                            {item.analysis.key_phrases.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="layer3" className="mt-4">
              <Card className="p-6 bg-gray-900/50 border-gray-800">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">User Messages</p>
                    <p className="text-3xl font-bold text-indigo-400">
                      {analysis.layers.layer3_patterns.total_user_messages}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">Avg Length (You)</p>
                    <p className="text-3xl font-bold text-purple-400">
                      {analysis.layers.layer3_patterns.avg_user_message_length}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">Vocabulary</p>
                    <p className="text-3xl font-bold text-green-400">
                      {analysis.layers.layer3_patterns.vocabulary_size}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">Trend</p>
                    <p className="text-3xl font-bold text-cyan-400">
                      {analysis.layers.layer3_patterns.message_length_trend}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">Echo Avg</p>
                    <p className="text-3xl font-bold text-orange-400">
                      {analysis.layers.layer3_patterns.avg_assistant_message_length}
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="layer4" className="mt-4">
              <Card className="p-6 bg-gray-900/50 border-gray-800">
                <div className="space-y-4 max-h-100 overflow-y-scroll">
                  {analysis.layers.layer4_journey.emotional_journey.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-3 bg-gray-800/30 rounded-lg">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <span className="text-sm font-bold">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-indigo-300">
                            {item.emotion}
                          </span>
                          <span className="text-xs text-gray-500">
                            Score: {item.emotion_score}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.sentiment}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{item.text_preview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}