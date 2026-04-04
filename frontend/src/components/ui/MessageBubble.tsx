import React, { useState } from "react";
import type { ChatMessage } from "../../types";
import TypingDots from "./TypingDots";
import { AiAvatar } from "./AiAvatar";
import { AnimatedText } from "./AnimatedText";
import { SourceCard } from "./SourceCard";
import { File } from "lucide-react";

export const MessageBubble: React.FC<{ message: ChatMessage }> = ({
  message,
}) => {
  const isUser = message.role === "user";
  const [showSources, setShowSources] = useState(false);
  const hasSources = message.sources && message.sources.length > 0;

  if (message.isLoading) {
    return (
      <div className="flex items-start gap-3 py-1.5 animate-msg-in">
        <AiAvatar />
        <div className="max-w-[75%] rounded-[8px] rounded-tl-[2px] px-[18px] py-3.5 bg-c-ai-bg border border-[var(--c-border-sub)]">
          <TypingDots />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-2 py-1.5 animate-msg-in ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && <AiAvatar />}

      <div className="max-w-[75%]">
        <div
          className={`
            rounded-[8px] px-[18px] transition-colors duration-300
            ${
              isUser
                ? "rounded-tr-[2px] bg-gradient-to-br from-[#8a5cf6] to-[#6d28d9] py-2"
                : "rounded-tl-[2px] bg-c-ai-bg border border-[var(--c-border-sub)] py-4"
            }
          `}
        >
          {isUser ? (
            <p className="text-[14.5px] text-white/95 whitespace-pre-wrap break-words">
              {message.content}
            </p>
          ) : (
            <AnimatedText content={message.content} />
          )}
        </div>

        {hasSources && (
          <div>
            <button
              // onClick={() => setShowSources((v) => !v)}
              className="flex items-center mt-1 gap-1.5 px-2 py-1.5 w-full text-left text-c-text-2 text-[12.5px]"
            >
              <File className="w-4 h-4" />
              <p className="text-xs">
                {message.sources!.length} source
                {message.sources!.length !== 1 ? "s" : ""}
              </p>
              {/* <ChevronDown className="w-4 h-4" /> */}
            </button>

            {showSources && (
              <div className="flex flex-col gap-1.5 mt-2 animate-slide-down">
                {message.sources!.map((src, i) => (
                  <SourceCard key={i} source={src} index={i} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
