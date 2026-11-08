import { useEffect, useRef, useState } from 'react';
import { Bot, RotateCcw, Send } from 'lucide-react';
import { useChat } from '../hooks/useChat';

// Chat UI. `compact` is the smaller version used inside the floating panel.
export default function Chatbot({ currentStep = 0, compact = false }) {
  const { messages, sending, send, reset } = useChat(currentStep);
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, sending]);

  function onSubmit(e) {
    e.preventDefault();
    send(text);
    setText('');
  }
  const last = messages[messages.length - 1];

  return (
    <div className={`flex flex-col ${compact ? 'h-full' : 'card h-[calc(100vh-10rem)] min-h-[420px] overflow-hidden'}`}>
      {!compact && (
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white"><Bot size={22} /></span>
          <div>
            <p className="font-bold">Seller assistant</p>
            <p className="text-xs text-ink-500">Ask about steps, documents, or what is missing</p>
          </div>
          <button onClick={reset} className="ml-auto rounded-lg p-2 text-ink-500 hover:bg-surface" aria-label="Start a new chat"><RotateCcw size={18} /></button>
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-md bg-brand-600 text-white' : m.error ? 'rounded-bl-md bg-red-50 text-red-700' : 'rounded-bl-md bg-surface text-ink-900'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 rounded-2xl rounded-bl-md bg-surface px-4 py-3.5" aria-label="Assistant is typing"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {last?.role === 'assistant' && last.suggestions?.length > 0 && !sending && (
        <div className="flex flex-wrap gap-2 px-4 pb-3 sm:px-5">
          {last.suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100">{s}</button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex gap-2 border-t border-line p-3 sm:p-4">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your question…" aria-label="Your message" className="h-11 flex-1 rounded-xl border border-line px-4 text-sm placeholder:text-ink-400 focus:border-brand-500" />
        <button type="submit" disabled={!text.trim() || sending} className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:bg-brand-300" aria-label="Send message"><Send size={18} /></button>
      </form>
    </div>
  );
}
