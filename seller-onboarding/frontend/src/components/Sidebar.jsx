import { NavLink } from 'react-router-dom';
import { ClipboardCheck, LayoutDashboard, LogOut, MessagesSquare, Rocket, X } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/onboarding', label: 'Onboarding', icon: Rocket },
  { to: '/tracking', label: 'Application status', icon: ClipboardCheck },
  { to: '/assistant', label: 'AI assistant', icon: MessagesSquare },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  return (
    <>
      {/* Mobile backdrop */}
      <div onClick={onClose} className={`fixed inset-0 z-30 bg-ink-900/40 transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden="true" />
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-white p-5 transition-transform duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <Logo />
          <button onClick={onClose} className="rounded-lg p-2 text-ink-500 hover:bg-surface lg:hidden" aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-surface hover:text-ink-900'}`}
            >
              <Icon size={20} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="rounded-2xl bg-surface p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{user?.fullName?.[0]?.toUpperCase() || '?'}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.fullName}</p>
              <p className="truncate text-xs text-ink-500">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white py-2 text-sm font-semibold text-ink-700 hover:text-red-600">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
