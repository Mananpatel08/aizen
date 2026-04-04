import React, { useCallback, useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import type { ChatMessage } from "../types";
import { genId } from "../utils";
import { sendMessage } from "../api/chatApi";
import { ErrorBox, MessageBubble } from "./ui";

type Props = {
  messages: ChatMessage[];
  error: string | null;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AizenMainWindow = (props: Props) => {
  const { messages, error, setMessages, setError } = props;

  const endRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

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

  const hasMessages = messages.length > 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="h-full w-full flex flex-col bg-c-surface pl-0 p-3">
      <main className="flex-1 flex flex-col rounded-[12px] overflow-hidden bg-c-base transition-colors duration-300">
        <div className="flex-1 overflow-y-auto scroll-custom">
          {!hasMessages ? (
            <WelcomeScreen onSuggestion={handleSend} />
          ) : (
            <div className="flex flex-col px-2 py-6 gap-1 max-w-[1000px] mx-auto w-full">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}

              {error && <ErrorBox error={error} />}

              <div ref={endRef} />
            </div>
          )}
        </div>

        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          hasMessages={hasMessages}
        />
      </main>
    </section>
  );
};
