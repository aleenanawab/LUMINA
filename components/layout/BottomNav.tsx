"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PenSquare, LayoutDashboard, User } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAuthor = (session?.user as any)?.role === "author";

  const links = [
    { href: "/", icon: Home, label: "Home" },
    ...(isAuthor ? [{ href: "/posts/new", icon: PenSquare, label: "Write" }] : []),
    ...(session ? [{ href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }] : []),
    { href: session ? "#" : "/login", icon: User, label: session ? "Profile" : "Login" },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 sm:hidden"
    >
      <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] shadow-lg">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                active
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "dark:text-gray-500 text-gray-400 hover:text-cyan-400"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}