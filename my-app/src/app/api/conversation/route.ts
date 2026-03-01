import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

const WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || "https://your-worker.your-subdomain.workers.dev";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// GET all conversations
export async function GET(request: NextRequest) {
  console.log("✅ GET /api/conversation called - fetching all conversations");

  try {
    // Use capital C for table name
    const url = new URL(`${WORKER_URL}/Conversation`);
    url.searchParams.append('select', '*');
    url.searchParams.append('order', 'created_at.desc');

    console.log("Fetching from worker URL:", url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Worker error response:", errorText);
      
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch conversations",
          details: errorText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    
    console.log(`Found ${data.length} total conversations`);

    const formattedConversations = data.map((conv: any) => ({
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
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// app/api/conversation/route.ts - Complete updated POST

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 },
      );
    }

    const user = await currentUser();
    const userName =
      user?.firstName ||
      user?.username ||
      user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
      "User";

    const body = await request.json();

    console.log(`Saving conversation for user: ${userId} (${userName})`);

    // Helper function to generate CUID-like ID
    function generateCuid() {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 10);
      const counter = Math.floor(Math.random() * 1000).toString(36);
      return `c${timestamp}${random}${counter}`;
    }

    // Prepare data with ALL required fields
    const conversationData = {
      id: generateCuid(),
      session_id: body.session_id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      user_name: userName,
      start_time: new Date(body.start_time || Date.now()).toISOString(),
      end_time: new Date(body.end_time || Date.now()).toISOString(),
      total_duration: body.total_duration || body.duration || 0,
      created_at: new Date().toISOString(),
      total_messages: body.total_messages || 0,
      user_messages: body.user_messages || 0,
      assistant_messages: body.assistant_messages || 0,
      transcript_json: body.transcript_json || [],
      transcript_summary:
        body.transcript_summary ||
        `Conversation with ${body.total_messages || 0} messages`,
      audio_features: null,
      emotion_analysis: null,
      emotional_summary: body.emotional_summary || null,
    };

    console.log("Sending to worker with generated ID:", conversationData.id);

    const response = await fetch(`${WORKER_URL}/Conversation`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(conversationData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Worker POST error:", errorText);
      
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save conversation",
          details: errorText,
        },
        { status: response.status },
      );
    }

    const savedData = await response.json();
    const savedConversation = Array.isArray(savedData) ? savedData[0] : savedData;

    return NextResponse.json({
      success: true,
      message: "Conversation saved successfully!",
      data: {
        id: savedConversation?.id,
        session_id: savedConversation?.session_id,
        user_id: savedConversation?.user_id,
        user_name: savedConversation?.user_name,
      },
    });
    
  } catch (error: any) {
    console.error("❌ Save error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}