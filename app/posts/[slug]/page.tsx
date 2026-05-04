"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Eye,
  Clock,
  MessageSquare,
  ArrowLeft,
  Send,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MeshBackground from "@/components/ui/MeshBackground";
import { formatDate } from "@/lib/utils";

interface Post {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  likes: string[];
  views: number;
  readTime: number;
  createdAt: string;
  authorId: { _id: string; name: string; image?: string };
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  authorId: { name: string; image?: string };
}

export default function PostPage() {
  const { slug } = useParams();
  const { data: session } = useSession();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/slug/${slug}`)
      .then((r) => r.json())
      .then(({ post }) => {
        if (post) {
          setPost(post);
          setLikeCount(post.likes.length);
          if (session?.user) {
            setLiked(post.likes.includes((session.user as any).id));
          }
        }
        setLoading(false);
      });
  }, [slug, session]);

  useEffect(() => {
    if (post?._id) {
      fetch(`/api/posts/${post._id}/comments`)
        .then((r) => r.json())
        .then(({ comments }) => setComments(comments || []));
    }
  }, [post?._id]);

  const handleLike = async () => {
    if (!session) return;
    const res = await fetch(`/api/posts/${post!._id}/like`, { method: "POST" });
    const data = await res.json();
    setLiked(data.liked);
    setLikeCount(data.count);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !session) return;

    const res = await fetch(`/api/posts/${post!._id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });

    const data = await res.json();
    if (data.comment) {
      setComments([data.comment, ...comments]);
      setCommentText("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MeshBackground />
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <MeshBackground />
        <p className="dark:text-gray-400 text-gray-500">Post not found</p>
        <Link href="/" className="text-cyan-400 hover:underline text-sm">
          ← Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MeshBackground />
      <Navbar />

      <article className="max-w-3xl mx-auto px-4 pt-24 pb-20">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm dark:text-gray-400 text-gray-500 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to stories
          </Link>
        </motion.div>

        {/* Cover */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-72 rounded-2xl overflow-hidden mb-8"
          >
            <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>
        )}

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-4"
        >
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-4xl sm:text-5xl font-bold dark:text-white text-gray-900 mb-6 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {post.title}
        </motion.h1>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-10 pb-6 border-b dark:border-white/10 border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 overflow-hidden">
              {post.authorId?.image && (
                <Image src={post.authorId.image} alt={post.authorId.name} width={36} height={36} />
              )}
            </div>
            <div>
              <p className="text-sm font-medium dark:text-white text-gray-900">
                {post.authorId?.name}
              </p>
              <p className="text-xs dark:text-gray-500 text-gray-400">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm dark:text-gray-500 text-gray-400">
            <span className="flex items-center gap-1.5">
              <Eye size={15} />
              {post.views}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} />
              {post.readTime} min
            </span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose dark:prose-invert max-w-none dark:text-gray-300 text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Like button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex items-center gap-4"
        >
          <button
            onClick={handleLike}
            disabled={!session}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${
              liked
                ? "border-pink-500/50 bg-pink-500/10 text-pink-400"
                : "dark:border-white/10 border-gray-200 dark:text-gray-400 text-gray-500 hover:border-pink-500/30"
            } ${!session ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            <span className="text-sm">{likeCount}</span>
          </button>
          {!session && (
            <span className="text-xs dark:text-gray-500 text-gray-400">
              <Link href="/login" className="text-cyan-400">Sign in</Link> to like
            </span>
          )}
        </motion.div>

        {/* Comments */}
        <div className="mt-16">
          <h3
            className="text-xl font-bold dark:text-white text-gray-900 mb-6 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <MessageSquare size={20} className="text-cyan-400" />
            Comments ({comments.length})
          </h3>

          {/* Add comment */}
          {session ? (
            <form onSubmit={handleComment} className="flex gap-3 mb-8">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave a comment..."
                className="flex-1 px-4 py-3 rounded-xl glass border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
              />
              <button
                type="submit"
                className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90"
              >
                <Send size={16} />
              </button>
            </form>
          ) : (
            <p className="text-sm dark:text-gray-500 text-gray-400 mb-8">
              <Link href="/login" className="text-cyan-400">Sign in</Link> to comment
            </p>
          )}

          {/* Comment List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4 border border-white/5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 overflow-hidden">
                    {comment.authorId?.image && (
                      <Image src={comment.authorId.image} alt={comment.authorId.name} width={28} height={28} />
                    )}
                  </div>
                  <span className="text-sm font-medium dark:text-white text-gray-900">
                    {comment.authorId?.name}
                  </span>
                  <span className="text-xs dark:text-gray-600 text-gray-400">
                    · {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm dark:text-gray-300 text-gray-600 pl-9">
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}