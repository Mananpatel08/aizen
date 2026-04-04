import { ArrowUp, SendHorizontalIcon } from "lucide-react";
import React, { useState, useRef } from "react";
import type { KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  hasMessages: boolean;
}

const SendIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 2L11 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 2L15 22l-4-9-9-4 20-7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin-btn" viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      strokeDasharray="32"
      strokeDashoffset="16"
    />
  </svg>
);

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  hasMessages,
}) => {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const t = value.trim();
    if (!t || isLoading) return;
    onSend(t);
    setValue("");
    if (ref.current) ref.current.style.height = "auto";
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const canSend = value.trim() && !isLoading;

  return (
    <div className="px-6 pb-3 pt-4 bg-gradient-to-t from-c-base to-transparent transition-colors duration-300">
      {/* Input wrapper */}
      <div
        className={`
          flex items-center gap-2.5 bg-c-elevated border-[0.5px] border-[var(--c-border)]
          rounded-[10px] pl-[18px] pr-2.5 py-2 transition-all duration-200
          max-w-[820px] mx-auto
          focus-within:border-[var(--c-border-act)]
          focus-within:shadow-[0_0_0_3px_var(--c-accent-dim),0_0_30px_var(--c-accent-glow)]
          ${isLoading ? "opacity-70" : ""}
        `}
      >
        <textarea
          ref={ref}
          id="chat-input"
          rows={1}
          value={value}
          disabled={isLoading}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          onInput={handleInput}
          placeholder="Ask Aizen anything..."
          aria-label="Chat message input"
          className="
            flex-1 bg-transparent border-0 outline-none resize-none
            font-inter text-[14.5px] text-c-text leading-[1.55]
            min-h-[24px] max-h-[160px] overflow-y-auto scroll-thin
            placeholder:text-c-text-3
          "
        />
        <button
          id="send-button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className={`
            w-[38px] h-[38px] rounded-[8px] flex items-center justify-center
            shrink-0 transition-all duration-200
            ${
              canSend
                ? "bg-gradient-to-br from-[#8a5cf6] to-[#6d28d9] text-white cursor-pointer"
                : "bg-c-card text-c-text-3 cursor-not-allowed"
            }
          `}
        >
          {isLoading ? (
            <SpinnerIcon />
          ) : (
            <ArrowUp
              className={`w-4 h-4 ${canSend ? "rotate-0" : "rotate-90"} transition-transform duration-300`}
            />
          )}
        </button>
      </div>
      {!hasMessages && (
        <p className="text-center text-[11.5px] text-c-text-3 mt-2 max-w-[820px] mx-auto">
          Press Enter to send · Shift+Enter for new line
        </p>
      )}
    </div>
  );
};

export default ChatInput;
