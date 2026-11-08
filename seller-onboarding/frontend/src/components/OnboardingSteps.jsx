import { Check } from 'lucide-react';
import { STEPS } from '../utils/onboarding';

// Stepper shown above the wizard. Completed steps can be clicked to jump back.
export default function OnboardingSteps({ current, completed = [], onSelect }) {
  return (
    <>
      {/* Mobile: compact label */}
      <p className="text-sm font-semibold text-ink-700 sm:hidden">
        Step {current + 1} of {STEPS.length}: <span className="text-brand-700">{STEPS[current].short}</span>
      </p>
      {/* Desktop: full stepper */}
      <ol className="hidden items-center sm:flex">
        {STEPS.map((s, i) => {
          const done = completed.includes(i) && i !== current;
          const active = i === current;
          return (
            <li key={s.id} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => onSelect?.(i)}
                className="group flex items-center gap-2.5 rounded-xl p-1 text-left"
                aria-current={active ? 'step' : undefined}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${active ? 'bg-brand-600 text-white ring-4 ring-brand-100' : done ? 'bg-emerald-500 text-white' : 'bg-white text-ink-500 ring-1 ring-line group-hover:ring-brand-300'}`}>
                  {done ? <Check size={16} /> : i + 1}
                </span>
                <span className={`hidden text-sm font-semibold lg:block ${active ? 'text-ink-900' : 'text-ink-500'}`}>{s.short}</span>
              </button>
              {i < STEPS.length - 1 && <span className={`mx-2 h-0.5 flex-1 rounded ${done ? 'bg-emerald-300' : 'bg-line'}`} />}
            </li>
          );
        })}
      </ol>
    </>
  );
}
