import { Link } from 'react-router-dom';
import { ArrowRight, Check, CircleDashed } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useOnboarding } from '../hooks/useOnboarding';
import { STEPS } from '../utils/onboarding';
import { STATUS } from '../utils/constants';
import { formatDate } from '../utils/format';

export default function Dashboard() {
  const { user } = useAuth();
  const { progress, requirements, status, application, locked } = useOnboarding();
  const done = requirements.filter((r) => r.done);
  const pending = requirements.filter((r) => !r.done);
  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const nextStep = pending[0]?.stepIndex ?? 5;

  const cta = status === STATUS.DRAFT || status === STATUS.REJECTED
    ? { label: progress === 0 ? 'Start onboarding' : 'Continue onboarding', to: `/onboarding?step=${nextStep}` }
    : { label: 'View application status', to: '/tracking' };

  return (
    <div className="space-y-6">
      <section className="card flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Welcome back, {firstName}</h2>
          <p className="mt-1.5 text-ink-500">
            {status === STATUS.APPROVED ? 'Your store is approved. Time to add your first products.'
              : locked ? `Submitted ${formatDate(application?.submittedAt)}. We will email you when the review is done.`
              : pending.length ? `${pending.length} of ${requirements.length} sections still need your attention.`
              : 'Everything is filled in. Review and submit your application.'}
          </p>
          <div className="mt-5 max-w-md"><ProgressBar value={progress} label="Onboarding progress" /></div>
        </div>
        <Button to={cta.to} size="lg" icon={ArrowRight}>{cta.label}</Button>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <StatusCard status={status} className="lg:col-span-1">
          {status === STATUS.REJECTED && <Link to="/tracking" className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline">Read feedback</Link>}
        </StatusCard>
        <section className="card p-5 lg:col-span-1">
          <h3 className="font-bold">Completed <span className="text-ink-400">({done.length})</span></h3>
          <ul className="mt-3 space-y-2.5">
            {done.length === 0 && <li className="text-sm text-ink-500">Nothing completed yet. Start with your personal information.</li>}
            {done.map((r) => (
              <li key={r.key} className="flex items-center gap-2.5 text-sm"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"><Check size={13} /></span>{r.label}</li>
            ))}
          </ul>
        </section>
        <section className="card p-5 lg:col-span-1">
          <h3 className="font-bold">Pending <span className="text-ink-400">({pending.length})</span></h3>
          <ul className="mt-3 space-y-2.5">
            {pending.length === 0 && <li className="text-sm text-ink-500">All requirements are complete.</li>}
            {pending.map((r) => (
              <li key={r.key}><Link to={`/onboarding?step=${r.stepIndex}`} className="flex items-center gap-2.5 rounded-lg text-sm font-semibold hover:text-brand-700"><CircleDashed size={18} className="text-amber-500" />{r.label}</Link></li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h3 className="mb-3 text-lg font-bold">Jump to a section</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => {
            const isDone = requirements[i]?.done;
            return (
              <Link key={s.id} to={`/onboarding?step=${i}`} className="card group flex items-center gap-4 p-4 transition-shadow hover:shadow-lift">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${isDone ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-50 text-brand-700'}`}>{isDone ? <Check size={20} /> : i + 1}</span>
                <div className="min-w-0 flex-1"><p className="font-semibold">{s.title}</p><p className="truncate text-xs text-ink-500">{s.description}</p></div>
                <ArrowRight size={18} className="text-ink-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-700" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
