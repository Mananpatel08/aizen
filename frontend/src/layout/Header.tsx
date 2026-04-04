import { SunIcon, MoonIcon } from "lucide-react";

type HeaderProps = {
  toggleTheme: () => void;
  clearChat: () => void;
  hasMessages: boolean;
  isDark: boolean;
};

const Header = ({
  toggleTheme,
  clearChat,
  hasMessages,
  isDark,
}: HeaderProps) => {
  return (
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
          <h2 className="text-[15px] font-semibold text-c-text">Aizen AI</h2>
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
  );
};

export default Header;
