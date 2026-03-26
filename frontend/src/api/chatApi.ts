import type { ChatResponse } from "../types/chat";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://192.168.1.21:8000";

export async function sendMessage(question: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
