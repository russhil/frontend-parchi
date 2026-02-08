"use client";

import { useState, useRef, useEffect } from "react";
import { chat } from "@/lib/api";
import type { ChatMessage } from "@/types";
import ReactMarkdown from "react-markdown";

interface AskAIPanelProps {
  patientId: string;
}

export default function AskAIPanel({ patientId }: AskAIPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await chat(patientId, userMsg.content, [...messages, userMsg]);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process that request. Please check if the backend is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What are her current medications?",
    "Summarize recent lab results",
    "Any drug interactions to watch?",
  ];

  return (
    <div className="bg-surface rounded-2xl border border-border-light shadow-sm overflow-hidden flex flex-col h-[380px]">
      <div className="px-5 py-4 border-b border-border-light flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
        <h3 className="text-sm font-bold text-text-primary">Ask AI</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-4">
            <span className="material-symbols-outlined text-gray-300 text-[40px] mb-2 block">forum</span>
            <p className="text-xs text-text-secondary mb-3">Ask questions about this patient&apos;s records</p>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="block w-full text-left px-3 py-2 bg-bg rounded-xl text-xs text-text-secondary hover:bg-primary-light hover:text-primary transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${msg.role === "user"
                ? "bg-primary text-white rounded-br-md"
                : "bg-bg text-text-primary rounded-bl-md"
                }`}
            >
              <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5">
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }: any) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({ node, ...props }: any) => <ul className="list-disc pl-4 mb-2 last:mb-0" {...props} />,
                    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-4 mb-2 last:mb-0" {...props} />,
                    li: ({ node, ...props }: any) => <li className="mb-0.5" {...props} />,
                    h1: ({ node, ...props }: any) => <h1 className="text-sm font-bold mb-2 mt-2 first:mt-0" {...props} />,
                    h2: ({ node, ...props }: any) => <h2 className="text-sm font-bold mb-2 mt-2 first:mt-0" {...props} />,
                    h3: ({ node, ...props }: any) => <h3 className="text-sm font-bold mb-1 mt-2 first:mt-0" {...props} />,
                    strong: ({ node, ...props }: any) => <strong className="font-bold" {...props} />,
                    em: ({ node, ...props }: any) => <em className="italic" {...props} />,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-bg rounded-2xl rounded-bl-md px-3 py-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-border-light">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this patient..."
            className="flex-1 px-3 py-2 bg-bg rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border-light"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary-dark transition disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
