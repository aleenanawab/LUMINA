import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { calculateReadTime } from "@/lib/utils";

// GET — single post by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const post = await Post.findById(id).populate("authorId", "name image role").lean();
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// PUT — update post (author only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (post.authorId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { title, content, coverImage, tags, status } = await req.json();
    const updated = await Post.findByIdAndUpdate(
      id,
      { title, content, coverImage, tags, status, readTime: calculateReadTime(content) },
      { new: true }
    );
    return NextResponse.json({ post: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE — delete post (author only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (post.authorId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await Post.findByIdAndDelete(id);
    return NextResponse.json({ message: "Post deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}