import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, Source } from '../types/chat';
import TypingDots from './TypingDots';

/* ── Inline markdown parser ───────────────────────────────── */
function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2]) parts.push(<strong key={m.index} className="font-semibold text-c-text">{m[2]}</strong>);
    else if (m[3]) parts.push(<em key={m.index} className="italic text-c-text-2">{m[3]}</em>);
    else if (m[4]) parts.push(
      <code key={m.index} className="font-mono text-[13px] bg-c-accent-dim text-c-accent px-1.5 py-0.5 rounded-md border border-[var(--c-border-act)]">
        {m[4]}
      </code>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}

function renderContent(content: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let inCode = false, codeLines: string[] = [], codeLang = '';

  content.split('\n').forEach((line, i) => {
    if (line.startsWith('```')) {
      if (!inCode) { inCode = true; codeLang = line.slice(3).trim(); codeLines = []; }
      else {
        inCode = false;
        nodes.push(
          <div key={i} className="my-2.5 rounded-xl overflow-hidden bg-c-code-bg border border-[var(--c-border)]">
            {codeLang && (
              <div className="px-3.5 py-1.5 text-[11px] text-c-text-3 uppercase tracking-widest border-b border-[var(--c-border-sub)]">
                {codeLang}
              </div>
            )}
            <pre className="p-3.5 overflow-x-auto font-mono text-[13px] text-c-code-txt whitespace-pre">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
        codeLines = []; codeLang = '';
      }
      return;
    }
    if (inCode) { codeLines.push(line); return; }

    if (line.startsWith('### ')) nodes.push(<h3 key={i} className="text-[15px] font-semibold mt-2 mb-1 text-c-accent">{line.slice(4)}</h3>);
    else if (line.startsWith('## ')) nodes.push(<h2 key={i} className="text-[17px] font-semibold mt-2.5 mb-1 text-c-text">{line.slice(3)}</h2>);
    else if (line.startsWith('# '))  nodes.push(<h1 key={i} className="text-[20px] font-bold mt-3 mb-1.5 text-c-text">{line.slice(2)}</h1>);
    else if (line.startsWith('- ') || line.startsWith('* '))
      nodes.push(<li key={i} className="ml-4 my-0.5 list-disc">{parseInline(line.slice(2))}</li>);
    else if (/^\d+\.\s/.test(line))
      nodes.push(<li key={i} className="ml-4 my-0.5 list-decimal">{parseInline(line.replace(/^\d+\.\s/, ''))}</li>);
    else if (line.trim() === '---') nodes.push(<hr key={i} className="my-2.5 border-[var(--c-border-sub)]" />);
    else if (line.trim() === '')    nodes.push(<div key={i} className="h-1.5" />);
    else nodes.push(<p key={i} className="my-1 break-words">{parseInline(line)}</p>);
  });

  return nodes;
}

/* ── Animated streaming text ──────────────────────────────── */
const AnimatedText: React.FC<{ content: string }> = ({ content }) => {
  const [shown, setShown] = useState('');
  const [done, setDone]   = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setShown('');
    setDone(false);
    const speed = content.length > 500 ? 4 : content.length > 200 ? 8 : 15;
    const timer = setInterval(() => {
      idx.current++;
      setShown(content.slice(0, idx.current));
      if (idx.current >= content.length) { clearInterval(timer); setDone(true); }
    }, speed);
    return () => clearInterval(timer);
  }, [content]);

  return (
    <div className="text-[14.5px] text-c-text leading-[1.65]">
      {done ? renderContent(content) : (
        <>
          {renderContent(shown)}
          <span className="inline-block w-[2px] h-[14px] bg-c-accent-hi ml-[2px] align-middle rounded-sm animate-blink" />
        </>
      )}
    </div>
  );
};

/* ── Source card ──────────────────────────────────────────── */
const SourceCard: React.FC<{ source: Source; index: number }> = ({ source, index }) => {
  const title   = (typeof source === 'string' ? source : source.title || source.link) || `Source ${index + 1}`;
  const url     = typeof source !== 'string' ? source.link  : undefined;
  const snippet = typeof source !== 'string' ? source.snippet : undefined;

  return (
    <div className="flex gap-2.5 items-start p-2.5 bg-c-card border border-[var(--c-border-sub)] rounded-xl transition-colors hover:border-[var(--c-border-act)]">
      <span className="min-w-[20px] h-5 rounded-full bg-c-accent-dim border border-[var(--c-border-act)] text-c-accent-hi text-[10px] font-semibold flex items-center justify-center shrink-0">
        {index + 1}
      </span>
      <div className="flex flex-col gap-0.5 min-w-0">
        {url
          ? <a href={url} target="_blank" rel="noopener noreferrer" className="text-[12.5px] text-c-accent font-medium truncate hover:underline">{title}</a>
          : <span className="text-[12.5px] text-c-text-2 font-medium">{title}</span>
        }
        {snippet && <p className="text-[11.5px] text-c-text-3 leading-snug line-clamp-2">{snippet}</p>}
      </div>
    </div>
  );
};

/* ── Shared avatar SVGs ───────────────────────────────────── */
const AiAvatar = () => (
  <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#8a5cf6] to-[#6d28d9] flex items-center justify-center shrink-0 shadow-avatar">
    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const UserAvatar = () => (
  <div className="w-[34px] h-[34px] rounded-full bg-c-card border border-[var(--c-border)] flex items-center justify-center shrink-0 text-c-text-2">
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

/* ── Main component ───────────────────────────────────────── */
const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  const [showSources, setShowSources] = useState(false);
  const hasSources = message.sources && message.sources.length > 0;

  if (message.isLoading) {
    return (
      <div className="flex items-start gap-3 py-1.5 animate-msg-in">
        <AiAvatar />
        <div className="max-w-[75%] rounded-[20px] rounded-bl-[8px] px-[18px] py-4 bg-c-ai-bg border border-[var(--c-border-sub)] shadow-card">
          <TypingDots />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 py-1.5 animate-msg-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {isUser ? <UserAvatar /> : <AiAvatar />}

      <div className={`
        max-w-[75%] rounded-[20px] px-[18px] py-3.5 transition-colors duration-300
        ${isUser
          ? 'rounded-br-[8px] bg-gradient-to-br from-[#8a5cf6] to-[#6d28d9] shadow-user-msg'
          : 'rounded-bl-[8px] bg-c-ai-bg border border-[var(--c-border-sub)] shadow-card'
        }
      `}>
        {isUser ? (
          <p className="text-[14.5px] text-white/95 whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <>
            <AnimatedText content={message.content} />

            {/* Search badge */}
            {message.searchUsed?.length && (
              <div className="flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-c-accent-dim rounded-lg border border-[var(--c-border-act)] text-[12px] text-c-text-3">
                <svg className="w-3 h-3 text-c-accent shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Searched: {message.searchUsed.join(', ')}
              </div>
            )}

            {/* Sources */}
            {hasSources && (
              <div className="mt-3.5">
                <button
                  onClick={() => setShowSources(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 w-full text-left bg-c-card border border-[var(--c-border)] rounded-lg text-c-text-2 text-[12.5px] cursor-pointer transition-all duration-200 hover:border-[var(--c-border-act)] hover:text-c-accent-hi hover:bg-c-accent-dim"
                >
                  <svg className="w-3.5 h-3.5 text-c-accent shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {message.sources!.length} source{message.sources!.length !== 1 ? 's' : ''}
                  <svg className={`w-3.5 h-3.5 ml-auto transition-transform duration-200 ${showSources ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none">
                    <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                {showSources && (
                  <div className="flex flex-col gap-1.5 mt-2 animate-slide-down">
                    {message.sources!.map((src, i) => <SourceCard key={i} source={src} index={i} />)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
