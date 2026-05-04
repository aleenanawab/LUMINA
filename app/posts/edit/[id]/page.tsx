"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Save, Send, X, Upload, Tag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import RichEditor from "@/components/editor/RichEditor";
import MeshBackground from "@/components/ui/MeshBackground";
import Image from "next/image";

export default function EditPostPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then(({ post }) => {
        if (post) {
          setTitle(post.title);
          setContent(post.content);
          setCoverImage(post.coverImage || "");
          setTags(post.tags || []);
          setLoaded(true);
        }
      });
  }, [id]);

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
      setError("Upload failed");
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

  const handleSave = async (status: "draft" | "published") => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, coverImage, tags, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MeshBackground />
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

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
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-bold dark:text-white text-gray-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Edit Post
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

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full text-3xl font-bold bg-transparent border-none outline-none dark:text-white text-gray-900 placeholder-gray-400"
            style={{ fontFamily: "var(--font-display)" }}
          />

          <div className="relative">
            {coverImage ? (
              <div className="relative rounded-2xl overflow-hidden h-64">
                <Image src={coverImage} alt="Cover" fill className="object-cover" />
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
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm border border-cyan-500/20">
                  <Tag size={12} />
                  {tag}
                  <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
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

          <div className="dark:text-white">
            <RichEditor content={content} onChange={setContent} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}