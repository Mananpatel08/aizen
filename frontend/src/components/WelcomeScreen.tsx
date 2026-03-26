import React from 'react';

const suggestions = [
  { icon: '🌐', text: "What's the latest in AI?" },
  { icon: '📊', text: 'Explain quantum computing' },
  { icon: '💡', text: 'How does React work?' },
  { icon: '🔍', text: 'Current Bitcoin price' },
];

interface WelcomeScreenProps {
  onSuggestion: (text: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestion }) => (
  <div className="flex flex-col items-center justify-center h-full gap-5 px-6 py-10 text-center">
    {/* Logo */}
    <div className="relative w-20 h-20 flex items-center justify-center">
      <div className="absolute inset-[-10px] rounded-full bg-[radial-gradient(circle,var(--c-accent-glow)_0%,transparent_70%)] animate-logo-pulse" />
      <svg
        className="w-12 h-12 text-c-accent-hi relative z-10 drop-shadow-[0_0_12px_var(--c-accent-glow)]"
        viewBox="0 0 24 24" fill="none"
      >
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </div>

    {/* Heading */}
    <h1 className="text-4xl font-bold text-c-text tracking-tight leading-tight">
      Meet{' '}
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
          className="flex items-center gap-2.5 px-4 py-3.5 bg-c-card border border-[var(--c-border-sub)] rounded-2xl
                     cursor-pointer text-left transition-all duration-200
                     hover:border-[var(--c-border-act)] hover:bg-c-hover hover:-translate-y-0.5 hover:shadow-card"
        >
          <span className="text-xl shrink-0">{s.icon}</span>
          <span className="text-[13px] text-c-text-2 leading-snug">{s.text}</span>
        </button>
      ))}
    </div>
  </div>
);

export default WelcomeScreen;
