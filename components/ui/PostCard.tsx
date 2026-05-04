"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, Clock, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: {
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
    authorId: {
      name: string;
      image?: string;
    };
  };
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const excerpt = post.content
    .replace(/<[^>]*>/g, "")
    .substring(0, 120) + "...";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden
        bg-white dark:bg-[#0d0d0d]
        border border-gray-200 dark:border-[#1a1a1a]
        hover:border-cyan-400/50 dark:hover:border-cyan-500/30
        hover:shadow-xl hover:shadow-cyan-500/5
        dark:hover:shadow-cyan-500/10
        transition-all duration-300 hover-glow-border"
    >
      <Link href={`/posts/${post.slug}`}>
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cyan-900/20 to-purple-900/20">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-900/30 to-purple-900/30 flex items-center justify-center">
              <span className="text-4xl opacity-20">✦</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2
            className="text-lg font-bold dark:text-white text-gray-900 mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm dark:text-gray-400 text-gray-500 line-clamp-2 mb-4">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 overflow-hidden">
                {post.authorId?.image && (
                  <Image
                    src={post.authorId.image}
                    alt={post.authorId.name}
                    width={24}
                    height={24}
                  />
                )}
              </div>
              <span className="text-xs dark:text-gray-400 text-gray-500">
                {post.authorId?.name}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs dark:text-gray-500 text-gray-400">
              <span className="flex items-center gap-1">
                <Heart size={12} />
                {post.likes.length}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {post.views}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readTime}m
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}