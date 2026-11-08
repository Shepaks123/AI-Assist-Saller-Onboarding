import { Link } from 'react-router-dom';

export default function Logo({ to = '/', light = false }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2.5 rounded-lg">
      <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill={light ? '#fff' : '#5A3FE0'} />
        <path d="M9 21c4 0 5-10 9-10 2 0 3 1.5 5 1.5" stroke={light ? '#5A3FE0' : '#fff'} strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="23" cy="12.5" r="2.4" fill={light ? '#5A3FE0' : '#fff'} />
      </svg>
      <span className={`text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink-900'}`}>SellerPath</span>
    </Link>
  );
}
