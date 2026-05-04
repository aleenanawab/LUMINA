import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });

    await connectDB();
    const userId = (session.user as any).id;
    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const liked = post.likes.map(String).includes(String(userId));
    if (liked) {
      post.likes = post.likes.filter((id) => String(id) !== String(userId)) as any;
    } else {
      post.likes.push(userId as any);
    }
    await post.save();

    return NextResponse.json({ liked: !liked, count: post.likes.length });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
