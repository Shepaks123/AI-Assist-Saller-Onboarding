import { CheckCircle2, Clock3, FileEdit, XCircle } from 'lucide-react';
import { STATUS } from '../utils/constants';

export const STATUS_META = {
  [STATUS.DRAFT]: { label: 'Draft', icon: FileEdit, tone: 'bg-brand-50 text-brand-700', text: 'Finish your application and submit it for review.' },
  [STATUS.PENDING]: { label: 'Under review', icon: Clock3, tone: 'bg-amber-50 text-amber-700', text: 'Our team is checking your details. This usually takes a few business days.' },
  [STATUS.APPROVED]: { label: 'Approved', icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-700', text: 'Your store is verified and ready to sell.' },
  [STATUS.REJECTED]: { label: 'Needs changes', icon: XCircle, tone: 'bg-red-50 text-red-700', text: 'Read the reviewer feedback, update your details and submit again.' },
};

export function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.draft;
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${m.tone}`}>
      <Icon size={14} /> {m.label}
    </span>
  );
}

export default function StatusCard({ status, children, className = '' }) {
  const m = STATUS_META[status] || STATUS_META.draft;
  const Icon = m.icon;
  return (
    <div className={`card flex gap-4 p-5 ${className}`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${m.tone}`}><Icon size={24} /></div>
      <div className="min-w-0">
        <p className="text-sm text-ink-500">Application status</p>
        <p className="text-lg font-bold">{m.label}</p>
        <p className="mt-0.5 text-sm text-ink-500">{m.text}</p>
        {children}
      </div>
    </div>
  );
}
