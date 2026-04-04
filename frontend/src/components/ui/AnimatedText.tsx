import { useEffect, useRef, useState } from "react";

export function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0,
    m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2])
      parts.push(
        <strong key={m.index} className="font-semibold text-c-text">
          {m[2]}
        </strong>,
      );
    else if (m[3])
      parts.push(
        <em key={m.index} className="italic text-c-text-2">
          {m[3]}
        </em>,
      );
    else if (m[4])
      parts.push(
        <code
          key={m.index}
          className="font-mono text-[13px] bg-c-accent-dim text-c-accent px-1.5 py-0.5 rounded-md border border-[var(--c-border-act)]"
        >
          {m[4]}
        </code>,
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === "string" ? (
    parts[0]
  ) : (
    <>{parts}</>
  );
}

export function renderContent(content: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let inCode = false,
    codeLines: string[] = [],
    codeLang = "";

  content.split("\n").forEach((line, i) => {
    if (line.startsWith("```")) {
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        inCode = false;
        nodes.push(
          <div
            key={i}
            className="my-2.5 rounded-xl overflow-hidden bg-c-code-bg border border-[var(--c-border)]"
          >
            {codeLang && (
              <div className="px-3.5 py-1.5 text-[11px] text-c-text-3 uppercase tracking-widest border-b border-[var(--c-border-sub)]">
                {codeLang}
              </div>
            )}
            <pre className="p-3.5 overflow-x-auto font-mono text-[13px] text-c-code-txt whitespace-pre">
              <code>{codeLines.join("\n")}</code>
            </pre>
          </div>,
        );
        codeLines = [];
        codeLang = "";
      }
      return;
    }
    if (inCode) {
      codeLines.push(line);
      return;
    }

    if (line.startsWith("### "))
      nodes.push(
        <h3
          key={i}
          className="text-[15px] font-semibold mt-2 mb-1 text-c-accent"
        >
          {parseInline(line.slice(4))}
        </h3>,
      );
    else if (line.startsWith("## "))
      nodes.push(
        <h2
          key={i}
          className="text-[17px] font-semibold mt-2.5 mb-1 text-c-text"
        >
          {parseInline(line.slice(3))}
        </h2>,
      );
    else if (line.startsWith("# "))
      nodes.push(
        <h1 key={i} className="text-[20px] font-bold mt-3 mb-1.5 text-c-text">
          {parseInline(line.slice(2))}
        </h1>,
      );
    else if (line.startsWith("- ") || line.startsWith("* "))
      nodes.push(
        <li key={i} className="ml-4 my-0.5 list-disc">
          {parseInline(line.slice(2))}
        </li>,
      );
    else if (/^\d+\.\s/.test(line))
      nodes.push(
        <li key={i} className="ml-4 my-0.5 list-decimal">
          {parseInline(line.replace(/^\d+\.\s/, ""))}
        </li>,
      );
    else if (line.trim() === "---")
      nodes.push(
        <hr key={i} className="my-2.5 border-[var(--c-border-sub)]" />,
      );
    else if (line.trim() === "") nodes.push(<div key={i} className="h-1.5" />);
    else
      nodes.push(
        <p key={i} className=" break-words">
          {parseInline(line)}
        </p>,
      );
  });

  return nodes;
}

export const AnimatedText: React.FC<{ content: string }> = ({ content }) => {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setShown("");
    setDone(false);
    const speed = content.length > 500 ? 4 : content.length > 200 ? 8 : 15;
    const timer = setInterval(() => {
      idx.current++;
      setShown(content.slice(0, idx.current));
      if (idx.current >= content.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [content]);

  return (
    <div className="text-[14.5px] text-c-text leading-[1.65]">
      {done ? (
        renderContent(content)
      ) : (
        <>
          {renderContent(shown)}
          <span className="inline-block w-[2px] h-[14px] bg-c-accent-hi ml-[2px] align-middle rounded-sm animate-blink" />
        </>
      )}
    </div>
  );
};
