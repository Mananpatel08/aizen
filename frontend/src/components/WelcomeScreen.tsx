import { ChartBar, Globe, Lightbulb, Search } from "lucide-react";
import React from "react";

const suggestions = [
  { icon: <Globe className="w-4 h-4" />, text: "What's the latest in AI?" },
  { icon: <ChartBar className="w-4 h-4" />, text: "Explain quantum computing" },
  { icon: <Lightbulb className="w-4 h-4" />, text: "How does React work?" },
  { icon: <Search className="w-4 h-4" />, text: "Current Bitcoin price" },
];

interface WelcomeScreenProps {
  onSuggestion: (text: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestion }) => (
  <div className="flex flex-col items-center justify-center h-full gap-5 px-6 py-10 text-center">
    {/* Logo */}
    <div className="flex items-center justify-center">
      {/* <div className="absolute inset-[-10px] rounded-full bg-[radial-gradient(circle,var(--c-accent-glow)_0%,transparent_70%)] animate-logo-pulse" /> */}
      <img
        src={"/logos/blue.svg"}
        alt="Aizen Logo"
        className="w-full h-auto max-w-[50px]"
      />
    </div>

    {/* Heading */}
    <h1 className="text-4xl font-bold text-c-text tracking-tight leading-tight">
      Meet{" "}
      <span className="bg-gradient-to-br from-c-accent to-c-accent-hi bg-clip-text text-transparent">
        Aizen
      </span>
    </h1>
    <p className="text-[15px] text-c-text-2 max-w-[380px] leading-relaxed">
      Your AI assistant with real-time internet access. Ask me anything.
    </p>

    {/* Suggestion cards */}
    <div className="grid grid-cols-2 gap-3 mt-2 w-full max-w-[540px]">
      {suggestions.map((s, i) => (
        <button
          key={i}
          id={`suggestion-${i}`}
          onClick={() => onSuggestion(s.text)}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-c-card border border-[var(--c-border-sub)] rounded-[8px]
                     cursor-pointer text-left transition-all duration-200
                     hover:border-[var(--c-border-act)] hover:bg-c-hover"
        >
          <span className="text-xl shrink-0">{s.icon}</span>
          <span className="text-[13px] text-c-text-2 leading-snug">
            {s.text}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default WelcomeScreen;
