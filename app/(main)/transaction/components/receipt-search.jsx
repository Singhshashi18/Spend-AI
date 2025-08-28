
"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Send, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ReceiptAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Hey Nitin! How can I help you today?", time: new Date() }
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const handleSend = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { role: "user", text: trimmed, time: new Date() }]);
    setQuery("");
    setLoading(true);
    setTyping(true);

    try {
      const res = await fetch("/api/receipt-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed })
      });
      const data = await res.json();
      const results = data.results || [];

      setTimeout(() => {
        if (results.length === 0) {
          setMessages(prev => [
            ...prev,
            { role: "assistant", text: `😕 Sorry, I couldn’t find anything for "${trimmed}". Try a different phrase.`, time: new Date() }
          ]);
        } else {
          setMessages(prev => ([
            ...prev,
            { role: "assistant", text: `✅ Found ${results.length} matching receipt${results.length > 1 ? "s" : ""} for "${trimmed}":`, time: new Date() },
            ...results.map(r => ({
              role: "assistant",
              text: `🧾 ${r.text}\n💰 ₹${r.amount}\n📦 ${r.category}\n🗓️ ${r.date ? new Date(r.date).toLocaleDateString() : "N/A"}\n🏪 ${r.merchant || "N/A"}`,
              time: new Date()
            }))
          ]));
        }
        setTyping(false);
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error("Search failed");
      setMessages(prev => [...prev, { role: "assistant", text: "⚠️ Something went wrong while searching. Try again later.", time: new Date() }]);
      setTyping(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto h-[90vh] flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-4 text-xl font-semibold">
        Receipt Assistant
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
              )}

              <div className={`max-w-[75%] p-3 rounded-2xl shadow text-sm ${msg.role === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-white rounded-bl-none"}`}>
                {msg.text.split("\n").map((line, i) => <p key={i}>{line}</p>)}
                <p className="text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <User size={18} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-gray-500">
            <Loader2 className="animate-spin" size={16} />
            <span>Assistant is typing...</span>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="border-t p-3 bg-white flex gap-2 sticky bottom-0">
        <input
          type="text"
          placeholder="Ask me anything about your receipts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <motion.button
          onClick={handleSend}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full flex items-center justify-center shadow-lg"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
        </motion.button>
      </div>
    </div>
  );
}
