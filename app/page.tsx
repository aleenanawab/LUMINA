"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useDebounce } from "use-debounce";
import Navbar from "@/components/layout/Navbar";
import PostCard from "@/components/ui/PostCard";
import MeshBackground from "@/components/ui/MeshBackground";

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  tags: string[];
  likes: string[];
  views: number;
  readTime: number;
  createdAt: string;
  authorId: { name: string; image?: string };
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [debouncedSearch] = useDebounce(search, 400);

  const fetchPosts = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const url = q ? `/api/posts?search=${encodeURIComponent(q)}` : "/api/posts";
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(debouncedSearch);
  }, [debouncedSearch, fetchPosts]);

  return (
    <div className="min-h-screen">
      <MeshBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-cyan-400 text-sm mb-6 border border-cyan-500/20">
            <Sparkles size={14} className="animate-glow-pulse" />
            <span>AI-Augmented Blogging Platform</span>
          </div>

          <h1
            className="text-5xl sm:text-7xl font-bold dark:text-white text-gray-900 mb-6 leading-none tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Where Ideas
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Ignite
            </span>
          </h1>

          <p className="text-lg dark:text-gray-400 text-gray-500 mb-10 max-w-xl mx-auto">
            Discover stories, ideas, and perspectives from writers who illuminate the future.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles, topics, tags..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass dark:bg-white/5 bg-white border border-gray-200 dark:border-white/10 dark:text-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto px-4 mb-12"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} className="text-cyan-400" />
          <span
            className="text-sm font-semibold dark:text-gray-300 text-gray-600"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {search ? `Results for "${search}"` : "Latest Stories"}
          </span>
          <span className="text-sm dark:text-gray-600 text-gray-400">
            · {posts.length} posts
          </span>
        </div>
      </motion.section>

      {/* Posts Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl shimmer dark:bg-[#0d0d0d] bg-gray-200 h-72"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 opacity-20">◇</div>
            <p className="dark:text-gray-500 text-gray-400">
              {search ? "No posts found for that search." : "No posts yet. Be the first to write!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}