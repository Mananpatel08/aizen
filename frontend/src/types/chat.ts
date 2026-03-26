export type MessageRole = 'user' | 'assistant';

export interface Source {
  title?: string;
  link?: string;
  snippet?: string;
  [key: string]: string | undefined;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  sources?: Source[];
  searchUsed?: string[] | null;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
  search_used: string[] | null;
}
