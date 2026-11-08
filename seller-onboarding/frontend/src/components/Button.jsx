import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const VARIANTS = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 disabled:bg-brand-300',
  secondary: 'bg-white text-ink-900 border border-line hover:bg-surface disabled:text-ink-400',
  ghost: 'text-ink-700 hover:bg-brand-50 hover:text-brand-700',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
};
const SIZES = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-5 text-sm', lg: 'h-12 px-6 text-base' };

// Renders a <Link> when `to` is given, otherwise a <button>.
export default function Button({ variant = 'primary', size = 'md', loading = false, to, className = '', children, icon: Icon, ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  if (to) return <Link to={to} className={cls} {...props}>{Icon && <Icon size={18} />}{children}</Link>;
  return (
    <button className={cls} disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 size={18} className="animate-spin" /> : Icon && <Icon size={18} />}
      {children}
    </button>
  );
}
