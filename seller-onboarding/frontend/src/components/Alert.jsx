import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const TONES = {
  error: { cls: 'border-red-200 bg-red-50 text-red-700', icon: AlertCircle },
  success: { cls: 'border-emerald-200 bg-emerald-50 text-emerald-800', icon: CheckCircle2 },
  info: { cls: 'border-brand-200 bg-brand-50 text-brand-800', icon: Info },
};

export default function Alert({ tone = 'info', children, className = '' }) {
  if (!children) return null;
  const { cls, icon: Icon } = TONES[tone];
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${cls} ${className}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
