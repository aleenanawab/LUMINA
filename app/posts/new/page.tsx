"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Upload, Tag, Save, Send, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import RichEditor from "@/components/editor/RichEditor";
import MeshBackground from "@/components/ui/MeshBackground";
import AiAssistant from "@/components/editor/AiAssistant";
import Image from "next/image";

export default function NewPostPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      setCoverImage(data.url);
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSave = async (status: "draft" | "published") => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, coverImage, tags, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push(status === "published" ? `/posts/${data.slug}` : "/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <MeshBackground />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-bold dark:text-white text-gray-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              New Post
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 dark:text-gray-300 text-gray-600 text-sm hover:border-white/20 transition-all disabled:opacity-50"
              >
                <Save size={15} />
                Save Draft
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send size={15} />
                Publish
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full text-3xl font-bold bg-transparent border-none outline-none dark:text-white text-gray-900 placeholder-gray-400"
            style={{ fontFamily: "var(--font-display)" }}
          />

          {/* Cover Image */}
          <div className="relative">
            {coverImage ? (
              <div className="relative rounded-2xl overflow-hidden h-64">
                <Image src={coverImage} alt="Cover" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                <button
                  onClick={() => setCoverImage("")}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 rounded-2xl glass border border-dashed border-white/20 cursor-pointer hover:border-cyan-500/40 transition-all group">
                <Upload size={24} className="dark:text-gray-500 text-gray-400 group-hover:text-cyan-400 transition-colors mb-2" />
                <span className="text-sm dark:text-gray-500 text-gray-400">
                  {uploading ? "Uploading..." : "Upload cover image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm border border-cyan-500/20"
                >
                  <Tag size={12} />
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Add a tag (press Enter)..."
              className="w-full px-0 py-2 bg-transparent border-none border-b dark:border-white/10 border-gray-200 outline-none dark:text-white text-gray-900 placeholder-gray-500 text-sm"
            />
          </div>

          {/* Editor */}
          <div>
            <RichEditor content={content} onChange={setContent} />
          </div>
        </motion.div>
      </main>

      <AiAssistant
        title={title}
        content={content}
        onInsert={(text) => setContent((prev) => prev + "<p>" + text + "</p>")}
      />
    </div>
  );
}