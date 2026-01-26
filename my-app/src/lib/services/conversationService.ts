// lib/services/conversationService.ts
export interface ConversationTurn {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  duration?: number;
}

export interface SaveConversationData {
  session_id?: string;
  start_time: number;
  end_time: number;
  total_duration: number;
  conversation: ConversationTurn[];
  emotional_summary?: string;
  key_insights?: string[];
}

export class ConversationService {
  async saveConversation(data: SaveConversationData) {
    try {
      const totalMessages = data.conversation.length;
      const userMessages = data.conversation.filter(
        (t) => t.role === "user",
      ).length;
      const assistantMessages = data.conversation.filter(
        (t) => t.role === "assistant",
      ).length;

      const payload = {
        session_id:
          data.session_id ||
          `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        start_time: new Date(data.start_time).toISOString(),
        end_time: new Date(data.end_time).toISOString(),
        total_duration: data.total_duration,
        total_messages: totalMessages,
        user_messages: userMessages,
        assistant_messages: assistantMessages,
        transcript_json: data.conversation,
        transcript_summary: this.generateSummary(data.conversation),
        emotional_summary: data.emotional_summary,
        key_insights: data.key_insights,
      };

      console.log("Saving conversation:", payload.session_id);

      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save conversation");
      }

      return {
        success: true,
        data: result.data,
        session_id: payload.session_id,
      };
    } catch (error: any) {
      console.error("Error saving conversation:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private generateSummary(conversation: ConversationTurn[]): string {
    if (conversation.length === 0) return "Empty conversation";

    const firstUser = conversation.find((t) => t.role === "user");
    const lastAssistant = [...conversation]
      .reverse()
      .find((t) => t.role === "assistant");

    let summary = `${conversation.length} messages`;

    if (firstUser) {
      summary += ` | Started: "${firstUser.text.substring(0, 50)}${firstUser.text.length > 50 ? "..." : ""}"`;
    }

    if (lastAssistant) {
      summary += ` | Ended: "${lastAssistant.text.substring(0, 50)}${lastAssistant.text.length > 50 ? "..." : ""}"`;
    }

    return summary;
  }
}

export const conversationService = new ConversationService();
