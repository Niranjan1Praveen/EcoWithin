import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || "https://your-worker.your-subdomain.workers.dev";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// For Next.js 15, params is a Promise that needs to be awaited
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
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

    // Call Cloudflare Worker to delete the conversation
    // Use the exact table name "Conversation" with capital C
    const response = await fetch(`${WORKER_URL}/Conversation?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
    });

    console.log("Worker response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Worker DELETE error:", errorText);
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = { raw: errorText };
      }

      // Handle specific error cases
      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Conversation not found",
            details: errorDetails 
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to delete conversation",
          details: errorDetails,
          status: response.status 
        },
        { status: response.status }
      );
    }

    // Try to parse response body (might be empty for DELETE)
    let deletedData = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        deletedData = JSON.parse(responseText);
      } catch {
        // Ignore parsing errors for empty responses
      }
    }

    console.log(`✅ Conversation ${id} deleted successfully`);

    return NextResponse.json({
      success: true,
      message: "Conversation deleted successfully",
      id: id,
      data: deletedData,
    });

  } catch (error: any) {
    console.error("❌ Error deleting conversation:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to delete conversation",
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}