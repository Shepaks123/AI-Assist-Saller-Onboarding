export default function ProgressBar({ value = 0, label, size = 'md' }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex justify-between text-xs font-semibold text-ink-700">
          <span>{label}</span><span>{v}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-brand-100 ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-brand-600 transition-[width] duration-500" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
