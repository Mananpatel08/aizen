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
  const [collapsed, setCollapsed] = useState(false);

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
    <aside
      className={`${collapsed ? "w-[50px]" : "w-[260px]"} shrink-0 bg-c-surface flex flex-col py-4 overflow-hidden transition-all duration-300 ease-in-out`}
    >
      <div
        className={`px-2 pb-3 border-b border-[var(--c-border-sub)] flex items-center ${collapsed ? "mx-auto" : "mx-2"}`}
      >
        <img src="/logos/blue.svg" alt="Aizen Logo" className="w-5 h-5" />
      </div>

      <button
        id="new-chat-btn"
        onClick={clearChat}
        className="flex items-center gap-2 px-2 py-2 hover:bg-c-hover
                     rounded-[8px] text-c-accent-hi font-inter text-sm font-medium cursor-pointer
                     transition-all duration-200 mx-2 mt-2"
      >
        <Plus className="w-4 h-4 shrink-0" />
        {!collapsed && <span>New Chat</span>}
      </button>

      <div
        className={`mt-auto px-2 pt-3 border-t border-[var(--c-border-sub)] flex items-center justify-between ${collapsed ? "flex-col gap-1" : ""}`}
      >
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 rounded-md hover:bg-c-hover transition-colors duration-200 w-fit"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          onClick={() => {
            setCollapsed(!collapsed);
          }}
          className="p-2 rounded-md hover:bg-c-hover transition-colors duration-200"
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
