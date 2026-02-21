import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// GET all conversations (temporarily ignore user filter)
export async function GET(request: NextRequest) {
  console.log("✅ GET /api/conversation called - fetching all conversations");

  try {
    // Fetch ALL conversations from Supabase (no user filter for now)
    const conversations = await prisma.conversation.findMany({
      orderBy: { created_at: "desc" },
    });

    console.log(`Found ${conversations.length} total conversations`);

    // Format the data for frontend
    const formattedConversations = conversations.map((conv) => ({
      id: conv.id,
      session_id: conv.session_id,
      user_id: conv.user_id,
      user_name: conv.user_name || "Anonymous",
      date: conv.created_at,
      start_time: conv.start_time,
      end_time: conv.end_time,
      duration_seconds: Math.floor((conv.total_duration || 0) / 1000),
      total_messages: conv.total_messages,
      user_messages: conv.user_messages,
      assistant_messages: conv.assistant_messages,
      summary: conv.transcript_summary,
      emotional_summary: conv.emotional_summary || "No analysis yet",
    }));

    return NextResponse.json({
      success: true,
      conversations: formattedConversations,
      count: formattedConversations.length,
    });
  } catch (error: any) {
    console.error("❌ Error in GET /api/conversation:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch conversations",
        code: error.code,
      },
      { status: 500 },
    );
  }
}

// POST new conversation (keeping your existing POST method)
export async function POST(request: NextRequest) {
  try {
    // Get Clerk auth session
    const { userId } = await auth();

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 },
      );
    }

    // Get user details from Clerk
    const user = await currentUser();

    // Get user name from Clerk (fallback to email or anonymous)
    const userName =
      user?.firstName ||
      user?.username ||
      user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
      "User";

    const body = await request.json();

    console.log(`Saving conversation for user: ${userId} (${userName})`);

    const conversation = await prisma.conversation.create({
      data: {
        session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId, // Real Clerk user ID
        user_name: userName, // Real user name
        start_time: new Date(body.start_time || Date.now()),
        end_time: new Date(body.end_time || Date.now()),
        total_duration: body.total_duration || body.duration || 0,
        total_messages: body.total_messages || 0,
        user_messages: body.user_messages || 0,
        assistant_messages: body.assistant_messages || 0,
        transcript_json: body.transcript_json || [],
        transcript_summary:
          body.transcript_summary ||
          `Conversation with ${body.total_messages || 0} messages`,
        emotional_summary: body.emotional_summary,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Conversation saved successfully!",
      data: {
        id: conversation.id,
        session_id: conversation.session_id,
        user_id: conversation.user_id,
        user_name: conversation.user_name,
      },
    });
  } catch (error: any) {
    console.error("Save error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to save conversation",
        code: error.code,
      },
      { status: 500 },
    );
  }
}
