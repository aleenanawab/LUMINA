"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, Bot, User, Wand2, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiAssistantProps {
  title: string;
  content: string;
  onInsert: (text: string) => void;
}

const QUICK_PROMPTS = [
  "Write an intro for this post",
  "Suggest 5 blog post titles",
  "Make this more engaging",
  "Add a conclusion",
  "Suggest relevant tags",
  "Improve the structure",
];

export default function AiAssistant({ title, content, onInsert }: AiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Lumina AI ✨ I'm here to help you write an amazing post. Ask me anything or use a quick prompt below!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.filter((_, i) => i > 0), // skip initial greeting
          title,
          content,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch (err: any) {
      setMessages([...newMessages, {
        role: "assistant",
        content: "Sorry, something went wrong. Please check your OpenAI API key.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow"
      >
        <Sparkles size={18} />
        <span className="text-sm font-medium">AI Assistant</span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-40 right-6 z-50 w-[380px] max-h-[560px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 dark:border-white/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-500/90 to-purple-600/90 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                  <Wand2 size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Lumina AI</p>
                  <p className="text-white/70 text-xs">Writing Assistant</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-[#0d0d0d] min-h-0 max-h-[340px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs
                    ${msg.role === "assistant"
                      ? "bg-gradient-to-br from-cyan-500 to-purple-600"
                      : "bg-gray-300 dark:bg-gray-600"
                    }`}>
                    {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${msg.role === "assistant"
                      ? "bg-gray-100 dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 rounded-tl-sm"
                      : "bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-tr-sm"
                    }`}>
                    {msg.content}
                    {/* Insert button for assistant messages */}
                    {msg.role === "assistant" && i > 0 && (
                      <button
                        onClick={() => onInsert(msg.content)}
                        className="block mt-2 text-xs text-cyan-500 dark:text-cyan-400 hover:underline"
                      >
                        + Insert into editor
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-[#1a1a1a]">
                    <Loader2 size={16} className="text-cyan-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-3 py-2 bg-white dark:bg-[#0d0d0d] border-t border-gray-100 dark:border-white/5">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    disabled={loading}
                    className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 bg-white dark:bg-[#0d0d0d] border-t border-gray-100 dark:border-white/5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask AI anything about your post..."
                className="flex-1 px-3 py-2 rounded-xl text-sm bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
