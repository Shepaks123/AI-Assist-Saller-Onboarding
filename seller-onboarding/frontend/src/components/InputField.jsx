import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// One component for text inputs, passwords (with show/hide), textareas and selects.
export default function InputField({
  label, name, value, onChange, error, hint, type = 'text', as = 'input', options = [], required = false, ...props
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const base = `w-full rounded-xl border bg-white px-4 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 disabled:bg-surface disabled:text-ink-500 ${error ? 'border-red-400' : 'border-line hover:border-ink-400'}`;

  let control;
  if (as === 'textarea') {
    control = <textarea id={id} name={name} value={value} onChange={onChange} rows={4} className={`${base} py-3`} aria-invalid={Boolean(error)} {...props} />;
  } else if (as === 'select') {
    control = (
      <select id={id} name={name} value={value} onChange={onChange} className={`${base} h-11`} aria-invalid={Boolean(error)} {...props}>
        <option value="">Select…</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  } else {
    control = (
      <div className="relative">
        <input id={id} name={name} value={value} onChange={onChange} type={isPassword && show ? 'text' : type} className={`${base} h-11 ${isPassword ? 'pr-12' : ''}`} aria-invalid={Boolean(error)} {...props} />
        {isPassword && (
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-ink-500 hover:text-brand-700" aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-700">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      {control}
      {error ? <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">{error}</p> : hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
