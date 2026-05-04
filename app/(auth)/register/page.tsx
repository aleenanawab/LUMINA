"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, Zap, PenSquare, BookOpen } from "lucide-react";
import MeshBackground from "@/components/ui/MeshBackground";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "reader" as "reader" | "author",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/login");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <MeshBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Zap size={20} className="text-black" />
            </div>
            <span
              className="text-2xl font-bold dark:text-white text-gray-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              LUMINA
            </span>
          </div>
          <p className="dark:text-gray-400 text-gray-500 text-sm">
            Join the community
          </p>
        </div>

        <div className="glass dark:bg-obsidian-card rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl dark:bg-white/5 bg-gray-50 border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email address"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl dark:bg-white/5 bg-gray-50 border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password (min 6 chars)"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-xl dark:bg-white/5 bg-gray-50 border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
              />
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "reader" })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  form.role === "reader"
                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                    : "border-white/10 dark:text-gray-400 text-gray-500 hover:border-white/20"
                }`}
              >
                <BookOpen size={20} />
                <span className="text-xs font-medium">Reader</span>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "author" })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  form.role === "author"
                    ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
                    : "border-white/10 dark:text-gray-400 text-gray-500 hover:border-white/20"
                }`}
              >
                <PenSquare size={20} />
                <span className="text-xs font-medium">Author</span>
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm dark:text-gray-500 text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}