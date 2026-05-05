"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Zap, Globe2 } from "lucide-react";
import MeshBackground from "@/components/ui/MeshBackground";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <MeshBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
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
            Sign in to continue your journey
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-white/10">
          {/* Google Sign In */}
          <button
            onClick={() => signIn("google", { callbackUrl: `${window.location.origin}/` })}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 dark:border-[#2a2a2a] text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222] transition-all mb-6 text-sm font-medium"
          >
            <Globe2 size={18} />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px dark:bg-white/10 bg-gray-200" />
            <span className="text-xs dark:text-gray-500 text-gray-400">or</span>
            <div className="flex-1 h-px dark:bg-white/10 bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#2a2a2a] dark:text-white text-gray-900 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-all text-sm"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#2a2a2a] dark:text-white text-gray-900 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-all text-sm"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm dark:text-gray-500 text-gray-400 mt-6">
            No account?{" "}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}