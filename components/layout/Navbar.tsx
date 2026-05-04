"use client";

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Sun, Moon, PenSquare, LogOut, User, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const btnClass = "p-2 rounded-xl glass text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors";

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-gray-200 dark:border-cyan-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap size={16} className="text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white text-gray-900">
              LUMINA
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={btnClass}>
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {session ? (
              <>
                {(session.user as any)?.role === "author" && (
                  <Link
                    href="/posts/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <PenSquare size={16} />
                    <span>Write</span>
                  </Link>
                )}
                <Link href="/dashboard" className={btnClass}>
                  <User size={18} />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
