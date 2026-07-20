import React, { useEffect, useState } from 'react';

const RAW_LINES = [
  [{ t: 'const ', c: 'kw' }, { t: 'you', c: 'id' }, { t: ' = {', c: 'punc' }],
  [{ t: '  learns', c: 'id' }, { t: ': ', c: 'punc' }, { t: 'true', c: 'val' }, { t: ',', c: 'punc' }],
  [{ t: '  builds', c: 'id' }, { t: ': ', c: 'punc' }, { t: 'true', c: 'val' }, { t: ',', c: 'punc' }],
  [{ t: '  grows', c: 'id' }, { t: ': ', c: 'punc' }, { t: 'true', c: 'val' }, { t: ',', c: 'punc' }],
  [{ t: '};', c: 'punc' }],
  [{ t: 'teknon', c: 'kw' }, { t: '.launch(', c: 'punc' }, { t: 'you', c: 'id' }, { t: ');', c: 'punc' }],
  [{ t: '// career-ready', c: 'comment' }],
];

// plain text is derived from the tokens so the typed-length and the
// colored render can never drift out of sync with each other.
const LINES = RAW_LINES.map((tokens) => ({
  tokens,
  plain: tokens.map((tok) => tok.t).join(''),
}));

const COLOR_MAP = {
  kw: 'text-[#5FA8FF]',
  id: 'text-white/90',
  val: 'text-gold',
  punc: 'text-white/40',
  comment: 'text-white/35 italic',
};

function renderTokensUpTo(tokens, charCount) {
  let remaining = charCount;
  const out = [];
  for (let i = 0; i < tokens.length; i += 1) {
    if (remaining <= 0) break;
    const tok = tokens[i];
    const slice = tok.t.length <= remaining ? tok.t : tok.t.slice(0, remaining);
    out.push(
      <span key={i} className={COLOR_MAP[tok.c]}>
        {slice}
      </span>
    );
    remaining -= tok.t.length;
  }
  return out;
}

export default function CodeWindow() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (lineIndex >= LINES.length) {
      setDone(true);
      return undefined;
    }
    const currentLine = LINES[lineIndex].plain;

    if (charIndex < currentLine.length) {
      const delay = 26 + Math.random() * 34;
      const t = setTimeout(() => setCharIndex((c) => c + 1), delay);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setLineIndex((l) => l + 1);
      setCharIndex(0);
    }, 280);
    return () => clearTimeout(t);
  }, [lineIndex, charIndex]);

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      <div className="absolute -inset-6 bg-royal/25 blur-3xl rounded-full pointer-events-none" aria-hidden="true" />
      <div className="relative glass rounded-2xl shadow-card-lg overflow-hidden animate-float">
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-white/10 bg-white/5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="ml-3 font-mono text-[11px] text-white/45">teknon.js</span>
        </div>
        <div className="p-6 font-mono text-[13px] sm:text-sm leading-7 min-h-[230px]">
          {LINES.map((line, i) => {
            if (i > lineIndex) return null;
            const isCurrent = i === lineIndex && !done;
            const count = isCurrent ? charIndex : line.plain.length;
            return (
              <div key={i} className="whitespace-pre">
                {renderTokensUpTo(line.tokens, count)}
                {isCurrent && (
                  <span className="inline-block w-[7px] h-[1em] bg-accent align-middle ml-0.5 cursor-blink" />
                )}
              </div>
            );
          })}
          {done && <span className="inline-block w-[7px] h-[1em] bg-accent align-middle cursor-blink" />}
        </div>
      </div>
    </div>
  );
}
