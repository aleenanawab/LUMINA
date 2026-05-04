import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { generateSlug, calculateReadTime } from "@/lib/utils";

// GET — fetch published posts (with optional search)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");

    let query: any = { status: "published" };

    if (search) {
      query.$text = { $search: search };
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate("authorId", "name image role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST — create a new post (authors only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "author") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, coverImage, tags, status } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    await connectDB();

    const slug = generateSlug(title);
    const readTime = calculateReadTime(content);

    const post = await Post.create({
      title,
      slug,
      content,
      coverImage,
      tags: tags || [],
      status: status || "draft",
      authorId: (session.user as any).id,
      readTime,
    });

    return NextResponse.json({ post, slug: post.slug }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}