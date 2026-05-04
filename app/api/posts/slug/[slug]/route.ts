import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await Post.findOne({ slug })
      .populate("authorId", "name image role")
      .lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await Post.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
    return NextResponse.json({ post });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}