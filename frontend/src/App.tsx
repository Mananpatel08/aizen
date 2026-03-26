import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage } from "./types/chat";
import { sendMessage } from "./api/chatApi";
import MessageBubble from "./components/MessageBubble";
import ChatInput from "./components/ChatInput";
import WelcomeScreen from "./components/WelcomeScreen";

/* ── Icons ───────────────────────────────────────────────── */
const SunIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Helpers ─────────────────────────────────────────────── */
let _id = 0;
const genId = () => `msg-${++_id}-${Date.now()}`;

type Theme = "dark" | "light";
const getSaved = (): Theme => {
  const v = localStorage.getItem("aizen-theme");
  return v === "light" || v === "dark" ? v : "dark";
};

/* ── App ─────────────────────────────────────────────────── */
export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(getSaved);
  const endRef = useRef<HTMLDivElement>(null);

  /* Apply / remove .dark on <html> */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("aizen-theme", theme);
  }, [theme]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));
  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const handleSend = useCallback(async (content: string) => {
    setError(null);
    const userMsg: ChatMessage = {
      id: genId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    const loadingMsg: ChatMessage = {
      id: genId(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((p) => [...p, userMsg, loadingMsg]);
    setIsLoading(true);

    try {
      const res = await sendMessage(content);
      const aiMsg: ChatMessage = {
        id: genId(),
        role: "assistant",
        content: res.answer,
        sources: res.sources,
        searchUsed: res.search_used,
        timestamp: new Date(),
        isLoading: false,
      };
      setMessages((p) => [...p.filter((m) => !m.isLoading), aiMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((p) => p.filter((m) => !m.isLoading));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isDark = theme === "dark";
  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen overflow-hidden bg-c-base font-inter transition-colors duration-300">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-[260px] shrink-0 bg-c-surface border-r border-[var(--c-border-sub)] flex flex-col py-5 px-4 overflow-hidden transition-colors duration-300">
        {/* Logo */}
        <div className="flex items-center justify-start pb-4 border-b border-[var(--c-border-sub)] mb-2">
          <img
            src={isDark ? "/logos/blue.svg" : "/logos/blue.svg"}
            alt="Aizen Logo"
            className="w-full h-auto max-w-[30px]"
          />
        </div>

        {/* New Chat */}
        <button
          id="new-chat-btn"
          onClick={clearChat}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-c-accent-dim border border-[var(--c-border-act)]
                     rounded-[14px] text-c-accent-hi font-inter text-sm font-medium cursor-pointer
                     transition-all duration-200 w-full
                     hover:bg-c-hover hover:shadow-glow hover:-translate-y-px"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          New Chat
        </button>

        {/* Features */}
        <p className="text-[10px] font-semibold uppercase tracking-[1.2px] text-c-text-3 px-1 pt-4 pb-1">
          Features
        </p>
        <div className="flex flex-col gap-1">
          {[
            {
              icon: "M11 11a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 10-4.35-4.35",
              label: "Real-time Web Search",
              isCircle: true,
            },
            {
              icon: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z",
              label: "Source Citations",
            },
            {
              icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
              label: "Powered by Groq LLM",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-2.5 py-2 text-[12.5px] text-c-text-2 rounded-lg"
            >
              <svg
                className="w-3.5 h-3.5 shrink-0 text-c-accent"
                viewBox="0 0 24 24"
                fill="none"
              >
                {f.isCircle ? (
                  <>
                    <circle
                      cx="11"
                      cy="11"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="m21 21-4.35-4.35"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  <path
                    d={f.icon}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
              {f.label}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-[var(--c-border-sub)] flex flex-col gap-2">
          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center gap-2 w-full px-3 py-2.5 bg-c-elevated border border-[var(--c-border)]
                       rounded-[14px] text-c-text-2 font-inter text-[13px] font-medium cursor-pointer
                       transition-all duration-200 group
                       hover:bg-c-card hover:border-[var(--c-border-act)] hover:text-c-accent-hi"
          >
            <span className="transition-transform duration-300 group-hover:rotate-[20deg]">
              {isDark ? <SunIcon /> : <MoonIcon />}
            </span>
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Status */}
          <div className="flex items-center gap-2 px-1 py-1">
            <span className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse-green" />
            <span className="text-[12px] text-c-text-2">Connected</span>
          </div>
        </div>
      </aside>

      {/* ── Main chat ───────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden bg-c-base bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,var(--c-accent-dim)_0%,transparent_60%)] transition-colors duration-300">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--c-border-sub)] backdrop-blur-md bg-c-surface transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#8a5cf6] to-[#6d28d9] flex items-center justify-center shadow-[0_0_16px_var(--c-accent-glow)]">
              <svg
                className="w-[18px] h-[18px] text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-c-text">
                Aizen AI
              </h2>
              <p className="text-[11.5px] text-c-text-3 mt-px">
                Real-time knowledge · Groq engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mobile theme toggle */}
            <button
              id="theme-toggle-mobile"
              onClick={toggleTheme}
              className="hidden max-sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-transparent border border-[var(--c-border)] rounded-lg text-c-text-2 text-[13px] cursor-pointer transition-all duration-200 hover:border-[var(--c-border-act)] hover:text-c-accent-hi"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {hasMessages && (
              <button
                id="clear-chat-btn"
                onClick={clearChat}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-transparent border border-[var(--c-border)] rounded-lg text-c-text-2 text-[13px] cursor-pointer transition-all duration-200 hover:border-red-400/50 hover:text-red-400 hover:bg-red-500/10"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Clear
              </button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scroll-custom">
          {!hasMessages ? (
            <WelcomeScreen onSuggestion={handleSend} />
          ) : (
            <div className="flex flex-col px-6 py-6 gap-1 max-w-[820px] mx-auto w-full">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}

              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2.5 px-4 py-3 mt-2 bg-red-500/10 border border-red-500/30 rounded-[14px] text-red-400 text-[13.5px] animate-msg-in"
                >
                  <svg
                    className="w-[18px] h-[18px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 8v4M12 16h.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </main>
    </div>
  );
}
