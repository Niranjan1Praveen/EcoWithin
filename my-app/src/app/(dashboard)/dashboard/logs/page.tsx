"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Trash2,
  MoreVertical,
  Calendar,
  Clock,
  User,
  Loader2,
  Search,
  RefreshCw,
  Download,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface Conversation {
  id: string;
  session_id: string;
  user_id: string;
  user_name: string;
  date: string;
  duration_seconds: number;
  total_messages: number;
  user_messages: number;
  assistant_messages: number;
  summary: string;
  emotional_summary: string;
}

export default function LogsPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Filter conversations based on search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(
        (conv) =>
          conv.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.emotional_summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          format(new Date(conv.date), "PPP").toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchTerm, conversations]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching all conversations...");
      const response = await fetch("/api/conversation");
      
      console.log("Response status:", response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error("Server returned HTML instead of JSON");
      }
      
      const data = await response.json();
      console.log("Data received:", data);

      if (data.success) {
        setConversations(data.conversations);
        setFilteredConversations(data.conversations);
      } else {
        setError(data.error || "Failed to fetch conversations");
      }
    } catch (error: any) {
      console.error("Error fetching conversations:", error);
      setError(error.message || "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(id);
      console.log("Deleting conversation:", id);
      
      const response = await fetch(`/api/conversation/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error("Server returned HTML instead of JSON");
      }
      
      const data = await response.json();
      console.log("Delete response:", data);

      if (response.ok && data.success) {
        // Remove from state
        setConversations((prev) => prev.filter((conv) => conv.id !== id));
        setFilteredConversations((prev) => prev.filter((conv) => conv.id !== id));
        setDeleteDialogOpen(false);
        setConversationToDelete(null);
      } else {
        console.error("Delete failed:", data.error);
        alert("Failed to delete conversation: " + (data.error || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Error deleting:", error);
      alert("An error occurred while deleting: " + error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getEmotionBadgeColor = (summary: string) => {
    if (summary.toLowerCase().includes("anxiety") || summary.toLowerCase().includes("anxious"))
      return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30";
    if (summary.toLowerCase().includes("happy") || summary.toLowerCase().includes("joy"))
      return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
    if (summary.toLowerCase().includes("sad") || summary.toLowerCase().includes("lonely"))
      return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
    if (summary.toLowerCase().includes("anger") || summary.toLowerCase().includes("frustrated"))
      return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
    return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-11/12 mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Conversation Logs</h1>
        <p className="text-gray-400">
          View and manage all conversations
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-800 p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-900/30 rounded-full">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-red-400 font-medium">Error Loading Conversations</h3>
              <p className="text-red-300 text-sm">{error}</p>
              <Button 
                onClick={fetchConversations} 
                variant="outline" 
                size="sm"
                className="mt-2 border-red-800 text-red-400 hover:bg-red-900/20"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-900/50 border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/20 rounded-lg">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Conversations</p>
              <p className="text-2xl font-bold text-white">{conversations.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <User className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Unique Users</p>
              <p className="text-2xl font-bold text-white">
                {new Set(conversations.map(c => c.user_id)).size}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold text-white">
                {conversations.reduce((acc, conv) => acc + conv.total_messages, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-600/20 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Latest Session</p>
              <p className="text-2xl font-bold text-white">
                {conversations.length > 0
                  ? format(new Date(conversations[0].date), "MMM d")
                  : "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Refresh Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search conversations by user, summary, emotion, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500"
          />
        </div>
        <Button
          onClick={fetchConversations}
          className=" text-green-400 hover:bg-gray-800 bg-transparent"
        >
          <RefreshCw className="h-4 w-4 mr-2 text-green-400" />
          Refresh
        </Button>
      </div>

      {/* Conversations Table */}
      <Card className="bg-gray-900/50 border-gray-800 overflow-hidden p-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Date & Time</TableHead>
                <TableHead className="text-gray-400">User</TableHead>
                <TableHead className="text-gray-400">Summary</TableHead>
                <TableHead className="text-gray-400">Emotional Analysis</TableHead>
                <TableHead className="text-gray-400 text-center">Duration</TableHead>
                <TableHead className="text-gray-400 text-center">Messages</TableHead>
                <TableHead className="text-gray-400 text-center">You/Echo</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConversations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                    {searchTerm ? "No conversations match your search" : "No conversations found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredConversations.map((conv) => (
                  <TableRow key={conv.id} className="border-gray-800 hover:bg-gray-800/30">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-white">
                          {format(new Date(conv.date), "MMM d, yyyy")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(conv.date), "h:mm a")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-indigo-600/20 flex items-center justify-center">
                          <User className="h-3 w-3 text-indigo-400" />
                        </div>
                        <span className="text-indigo-400 text-sm">{conv.user_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-gray-300 text-sm truncate" title={conv.summary}>
                        {conv.summary}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEmotionBadgeColor(conv.emotional_summary)}>
                        {conv.emotional_summary}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-gray-300">
                      {formatDuration(conv.duration_seconds)}
                    </TableCell>
                    <TableCell className="text-center text-gray-300">
                      {conv.total_messages}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-indigo-400 font-medium">{conv.user_messages}</span>
                      <span className="text-gray-500 mx-1">/</span>
                      <span className="text-purple-400 font-medium">{conv.assistant_messages}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={() => router.push(`/dashboard/analysis?session=${conv.session_id}`)}
                          title="View Analysis"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => {
                            console.log("Delete clicked for ID:", conv.id); // Add this log
                            setConversationToDelete(conv.id);
                            setDeleteDialogOpen(true);
                          }}
                          disabled={deleteLoading === conv.id}
                          title="Delete Conversation"
                        >
                          {deleteLoading === conv.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Conversation</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-700 text-foreground"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (conversationToDelete) {
                  handleDelete(conversationToDelete);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}