import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const comments = await Comment.find({ postId: id })
      .populate("authorId", "name image")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
    const { content } = await req.json();
    if (!content?.trim()) return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    await connectDB();
    const comment = await Comment.create({
      content: content.trim(),
      postId: id,
      authorId: (session.user as any).id,
    });
    const populated = await comment.populate("authorId", "name image");
    return NextResponse.json({ comment: populated }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}