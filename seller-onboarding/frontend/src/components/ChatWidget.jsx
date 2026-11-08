import { useState } from 'react';
import { Bot, X } from 'lucide-react';
import Chatbot from './Chatbot';

// Floating assistant button shown on every dashboard page except /assistant.
export default function ChatWidget({ currentStep }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-40 flex h-[min(34rem,calc(100vh-8rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-card border border-line bg-white shadow-lift sm:right-6 sm:w-96">
          <div className="flex items-center justify-between bg-brand-600 px-4 py-3 text-white">
            <p className="font-bold">Seller assistant</p>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-white/15" aria-label="Close assistant"><X size={18} /></button>
          </div>
          <div className="min-h-0 flex-1"><Chatbot compact currentStep={currentStep} /></div>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lift transition-colors hover:bg-brand-700 sm:right-6" aria-label={open ? 'Close assistant' : 'Open assistant'}>
        {open ? <X size={24} /> : <Bot size={26} />}
      </button>
    </>
  );
}
