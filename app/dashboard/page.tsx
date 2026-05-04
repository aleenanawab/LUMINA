"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  PenSquare,
  Eye,
  Heart,
  MessageSquare,
  FileText,
  Globe,
  Trash2,
  Edit,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MeshBackground from "@/components/ui/MeshBackground";
import { formatDate } from "@/lib/utils";

interface Post {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  views: number;
  likes: string[];
  readTime: number;
  createdAt: string;
  tags: string[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    fetch("/api/dashboard/posts")
      .then((r) => r.json())
      .then(({ posts }) => {
        setPosts(posts || []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p._id !== id));
  };

  const handleToggleStatus = async (post: Post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    await fetch(`/api/posts/${post._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, status: newStatus }),
    });
    setPosts(posts.map((p) => (p._id === post._id ? { ...p, status: newStatus } : p)));
  };

  const filtered = posts.filter((p) =>
    filter === "all" ? true : p.status === filter
  );

  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const totalLikes = posts.reduce((s, p) => s + p.likes.length, 0);
  const published = posts.filter((p) => p.status === "published").length;

  return (
    <div className="min-h-screen">
      <MeshBackground />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1
              className="text-3xl font-bold dark:text-white text-gray-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Dashboard
            </h1>
            <p className="dark:text-gray-500 text-gray-400 text-sm mt-1">
              Welcome back, {session?.user?.name}
            </p>
          </div>
          <Link
            href="/posts/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <PenSquare size={16} />
            New Post
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Posts", value: posts.length, icon: FileText, color: "cyan" },
            { label: "Published", value: published, icon: Globe, color: "green" },
            { label: "Total Views", value: totalViews, icon: Eye, color: "purple" },
            { label: "Total Likes", value: totalLikes, icon: Heart, color: "pink" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-4 border border-white/5"
            >
              <stat.icon
                size={18}
                className={`text-${stat.color}-400 mb-2`}
              />
              <p className="text-2xl font-bold dark:text-white text-gray-900">
                {stat.value}
              </p>
              <p className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize transition-all ${
                filter === f
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "glass border border-white/10 dark:text-gray-400 text-gray-500 hover:border-white/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="dark:text-gray-500 text-gray-400">
              No posts here yet.{" "}
              <Link href="/posts/new" className="text-cyan-400">
                Write your first post →
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4 hover:border-white/10 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        post.status === "published"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {post.status}
                    </span>
                    <span className="text-xs dark:text-gray-600 text-gray-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <Link
                    href={
                      post.status === "published"
                        ? `/posts/${post.slug}`
                        : "#"
                    }
                    className="text-sm font-medium dark:text-white text-gray-900 hover:text-cyan-400 transition-colors truncate block"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-xs dark:text-gray-600 text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye size={11} /> {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={11} /> {post.likes.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleStatus(post)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      post.status === "published"
                        ? "glass border border-yellow-500/20 text-yellow-400 hover:border-yellow-500/40"
                        : "glass border border-green-500/20 text-green-400 hover:border-green-500/40"
                    }`}
                  >
                    {post.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    href={`/posts/edit/${post._id}`}
                    className="p-2 rounded-lg glass border border-white/10 dark:text-gray-400 text-gray-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                  >
                    <Edit size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="p-2 rounded-lg glass border border-white/10 dark:text-gray-400 text-gray-500 hover:text-red-400 hover:border-red-500/30 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}