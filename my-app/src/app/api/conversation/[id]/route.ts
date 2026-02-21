import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// For Next.js 15, params is a Promise that needs to be awaited
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Note: params is a Promise
) {
  console.log("✅ DELETE /api/conversation/[id] called");
  
  try {
    // IMPORTANT: Await the params Promise before accessing its properties
    const { id } = await params;
    
    console.log("Conversation ID from params:", id);

    if (!id) {
      console.log("❌ No conversationId provided");
      return NextResponse.json(
        { success: false, error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // Check if conversation exists
    const existingConversation = await prisma.conversation.findUnique({
      where: { id: id },
    });

    console.log("Existing conversation:", existingConversation ? "Found" : "Not found");

    if (!existingConversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Delete the conversation
    await prisma.conversation.delete({
      where: { id: id },
    });

    console.log(`✅ Conversation ${id} deleted successfully`);

    return NextResponse.json({
      success: true,
      message: "Conversation deleted successfully",
      id: id,
    });

  } catch (error: any) {
    console.error("❌ Error deleting conversation:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to delete conversation",
        code: error.code 
      },
      { status: 500 }
    );
  }
}