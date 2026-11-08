import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { StatusBadge } from './StatusCard';
import { useOnboarding } from '../hooks/useOnboarding';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/onboarding': 'Seller onboarding',
  '/tracking': 'Application status',
  '/assistant': 'AI assistant',
};

export default function Navbar({ onMenu }) {
  const { pathname } = useLocation();
  const { status, progress } = useOnboarding();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur sm:px-8">
      <button onClick={onMenu} className="rounded-lg p-2 text-ink-700 hover:bg-surface lg:hidden" aria-label="Open menu"><Menu size={22} /></button>
      <h1 className="text-lg font-bold">{TITLES[pathname] || 'SellerPath'}</h1>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm font-semibold text-ink-500 sm:block">{progress}% complete</span>
        <StatusBadge status={status} />
      </div>
    </header>
  );
}
