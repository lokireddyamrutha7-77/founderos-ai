import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Brain, FileText, Loader2, AlertCircle, Bot, User, RefreshCw } from "lucide-react";
import { sendChatMessage } from "../services/chat";

const SUGGESTED_PROMPTS = [
  "What are the immediate priorities for my business right now?",
  "Based on my financial numbers, how can I extend my runway?",
  "Summarize my recent memory notes and key decisions.",
  "Give me advice on pitch messaging for potential investors.",
];

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "assistant",
      text: "Hello! I'm your FounderOS AI Copilot. I have access to your saved business memories and latest AI Advisor report. How can I assist your startup journey today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(text.trim());

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: response.reply,
        usedMemoryIds: response.used_memory_ids || [],
        usedAdvisorReportId: response.used_advisor_report_id,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setError(err.message || "Failed to send message. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-6rem)] py-2 px-2 sm:px-4">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-4 border-b border-[var(--border)] shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-[var(--gold)]" size={24} />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">AI Copilot Chat</h1>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Context-aware AI conversation grounded in your memories & advisor data.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--muted)] bg-white px-3 py-1.5 rounded-full border border-[var(--border)] shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Context Enabled</span>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-in-up`}
            >
              {/* Avatar */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isUser
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-[var(--gold-light)] text-[var(--gold-dark)] border border-[var(--gold)]/30"
                }`}
              >
                {isUser ? <User size={16} /> : <Bot size={18} />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#1A1A1A] text-white rounded-tr-none shadow-xs"
                      : "bg-white text-[var(--text)] border border-[var(--border)] rounded-tl-none shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Context Badges (if assistant response used memories or advisor) */}
                {!isUser && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    {msg.usedMemoryIds && msg.usedMemoryIds.length > 0 && (
                      <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 font-medium text-blue-700 border border-blue-200">
                        <Brain size={12} />
                        Used {msg.usedMemoryIds.length} business {msg.usedMemoryIds.length === 1 ? "memory" : "memories"}
                      </span>
                    )}

                    {msg.usedAdvisorReportId && (
                      <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 font-medium text-amber-800 border border-amber-200">
                        <FileText size={12} />
                        Used Advisor Report
                      </span>
                    )}

                    <span className="text-[var(--muted)] text-[10px] ml-auto">{msg.timestamp}</span>
                  </div>
                )}

                {isUser && (
                  <div className="text-right text-[10px] text-[var(--muted)]">
                    {msg.timestamp}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3 animate-fade-in-up">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--gold-light)] text-[var(--gold-dark)] border border-[var(--gold)]/30">
              <Bot size={18} />
            </div>
            <div className="bg-white border border-[var(--border)] p-4 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--gold)]" />
              <span>Analyzing context & drafting response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Callout */}
      {error && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs font-semibold text-red-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Suggested Prompts (visible if conversation is short) */}
      {messages.length <= 2 && !loading && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
            Suggested Prompts:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-left text-xs p-2.5 rounded-xl border border-[var(--border)] bg-white hover:bg-[var(--gold-light)]/40 text-[var(--text)] transition-colors line-clamp-2"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="shrink-0 bg-white border border-[var(--border)] rounded-2xl p-2 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <textarea
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about strategy, pitch decks, financials, or memory notes..."
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-[var(--text)] focus:outline-none placeholder:text-[var(--muted)]"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1A1A1A] text-white hover:bg-black disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send size={18} className="text-[var(--gold)]" />
          </button>
        </form>
      </div>
    </div>
  );
}