import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, AlertCircle, Bot, User, Brain } from "lucide-react";
import { sendChatMessage } from "../services/chat";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hello! I'm Altora, your AI co-founder. I have access to your saved business memories and recent advisor reports. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await sendChatMessage(trimmed);
      const aiReply = res.reply || "I didn't receive a response. Please try asking again.";
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiReply,
        usedMemoryIds: res.used_memory_ids || [],
        usedAdvisorReportId: res.used_advisor_report_id,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err.message || "Failed to generate chat response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-[var(--gold-light)]/40 text-[var(--gold-dark)]">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Altora Chat</h1>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Ask questions, refine your strategy, or brainstorm using your company context.
          </p>
        </div>
      </header>

      {/* Main Chat Container */}
      <div className="rounded-2xl border border-[var(--border)] bg-white shadow-sm flex flex-col h-[620px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF7F0]/20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-[var(--gold-light)] text-[var(--gold-dark)]"
                }`}
              >
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Content */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm space-y-2 shadow-xs ${
                  msg.role === "user"
                    ? "bg-[#1A1A1A] text-white rounded-tr-xs"
                    : "bg-white border border-[var(--border)] text-neutral-800 rounded-tl-xs"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                {/* Used Memory / Context badge */}
                {msg.role === "ai" && msg.usedMemoryIds && msg.usedMemoryIds.length > 0 && (
                  <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] text-[var(--muted)] font-medium">
                    <Brain className="h-3.5 w-3.5 text-[var(--gold)]" />
                    <span>Informed by {msg.usedMemoryIds.length} saved memory {msg.usedMemoryIds.length === 1 ? "entry" : "entries"}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-3 flex-row animate-fade-in-up">
              <div className="h-8 w-8 rounded-full bg-[var(--gold-light)] text-[var(--gold-dark)] flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-[var(--border)] text-neutral-600 rounded-2xl rounded-tl-xs px-4 py-3 text-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[var(--gold)]" />
                <span>Altora is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="px-4 py-2.5 bg-red-50 border-t border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-[var(--border)] flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 rounded-xl border border-[var(--border)] bg-[#FAF7F0]/40 px-4 py-2.5 text-sm text-neutral-900 focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--gold)] disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#1A1A1A] text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-[var(--gold)] disabled:opacity-50 transition-all shrink-0 cursor-pointer"
          >
            <Send size={16} className="text-[var(--gold)]" />
          </button>
        </form>
      </div>
    </div>
  );
}