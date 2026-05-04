import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "author") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const posts = await Post.find({ authorId: (session.user as any).id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}