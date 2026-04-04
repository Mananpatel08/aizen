import { Moon, PanelRight, Plus, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChatMessage, Theme } from "../types";
import { getSaved } from "../utils";

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AizenSidebar = ({ setMessages, setError }: Props) => {
  const [theme, setTheme] = useState<Theme>(getSaved);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("aizen-theme", theme);
  }, [theme]);

  return (
    <aside className="w-[260px] shrink-0 bg-c-surface flex flex-col py-5 px-4 overflow-hidden transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--c-border-sub)] mb-4">
        <img
          src={isDark ? "/logos/blue.svg" : "/logos/blue.svg"}
          alt="Aizen Logo"
          className="w-full h-auto max-w-[25px]"
        />
        <button className="p-2 rounded-md hover:bg-c-hover transition-colors duration-200">
          <PanelRight className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat */}
      <button
        id="new-chat-btn"
        onClick={clearChat}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-c-accent-dim border-[0.5px] border-[var(--c-border-act)]
                     rounded-[8px] text-c-accent-hi font-inter text-sm font-medium cursor-pointer
                     transition-all duration-200 w-full"
      >
        <Plus className="w-4 h-4 shrink-0" />
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
          className="p-2 rounded-md hover:bg-c-hover transition-colors duration-200 w-fit"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Status */}
        {/* <div className="flex items-center gap-2 px-1 py-1">
          <span className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse-green" />
          <span className="text-[12px] text-c-text-2">Connected</span>
        </div> */}
      </div>
    </aside>
  );
};
