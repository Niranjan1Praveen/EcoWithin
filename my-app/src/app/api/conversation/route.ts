import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Saving to Conversation model...");
    
    const conversation = await prisma.conversation.create({
      data: {
        session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: "test_user_" + Date.now(),
        user_name: "Test User",
        start_time: new Date(),
        end_time: new Date(),
        total_duration: body.duration || 0,
        total_messages: body.total_messages || 0,
        user_messages: body.user_messages || 0,
        assistant_messages: body.assistant_messages || 0,
        transcript_json: body.transcript_json || [], // ✅ CORRECT FIELD NAME
        transcript_summary: body.transcript_summary || "Test conversation",
        // audio_features, emotion_analysis, emotional_summary are optional
      },
    });

    return NextResponse.json({
      success: true,
      message: "Saved to Conversation table!",
      data: conversation
    });

  } catch (error: any) {
    console.error("Save error:", error);
    return NextResponse.json(
      { 
        error: error.message,
        code: error.code,
        meta: error.meta
      },
      { status: 500 }
    );
  }
}