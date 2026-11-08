import { Outlet } from 'react-router-dom';
import { ShieldCheck, Sparkles, Zap } from 'lucide-react';
import Logo from '../components/Logo';

const POINTS = [
  { icon: Sparkles, text: 'An assistant that explains every field in plain language' },
  { icon: Zap, text: 'Save progress and pick up where you stopped' },
  { icon: ShieldCheck, text: 'Clear feedback if anything needs fixing' },
];

// Split screen used by the Login and Register pages.
export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-8 sm:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10"><Outlet /></div>
      </div>
      <aside className="relative hidden flex-col justify-end overflow-hidden bg-brand-700 p-14 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/40" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-900/50" aria-hidden="true" />
        <div className="relative">
          <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight">Open your store without the paperwork headache.</h2>
          <ul className="mt-10 space-y-5">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15"><Icon size={20} /></span>
                <span className="text-brand-100">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
