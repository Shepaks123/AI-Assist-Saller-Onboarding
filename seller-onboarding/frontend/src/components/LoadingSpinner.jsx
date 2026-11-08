import { Loader2 } from 'lucide-react';

// `fullScreen` centers it on the whole page; otherwise it fills its parent.
export default function LoadingSpinner({ label = 'Loading…', fullScreen = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-ink-500 ${fullScreen ? 'min-h-screen' : 'min-h-[40vh]'}`} role="status">
      <Loader2 className="animate-spin text-brand-600" size={32} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
