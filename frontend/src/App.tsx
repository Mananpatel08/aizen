import { useState } from "react";
import type { ChatMessage } from "./types/chat";
import { AizenSidebar } from "./layout";
import { AizenMainWindow } from "./components/MainWindow";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex h-screen overflow-hidden bg-c-base font-inter transition-colors duration-300">
      <AizenSidebar setMessages={setMessages} setError={setError} />

      <AizenMainWindow
        messages={messages}
        error={error}
        setMessages={setMessages}
        setError={setError}
      />
    </div>
  );
}
