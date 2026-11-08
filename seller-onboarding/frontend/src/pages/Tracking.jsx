import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, CircleDashed, Pencil, RefreshCw } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import Button from '../components/Button';
import Alert from '../components/Alert';
import DevReviewPanel from '../mocks/DevReviewPanel';
import { useOnboarding } from '../hooks/useOnboarding';
import { STATUS } from '../utils/constants';
import { formatDate } from '../utils/format';

export default function Tracking() {
  const { status, application, requirements, refresh, replaceApplication } = useOnboarding();
  const location = useLocation();
  const [refreshing, setRefreshing] = useState(false);

  const submitted = Boolean(application?.submittedAt);
  const missing = application?.missingRequirements || [];
  const timeline = [
    { label: 'Application started', done: true, date: null },
    { label: 'Submitted for review', done: submitted, date: application?.submittedAt },
    { label: 'Review decision', done: status === STATUS.APPROVED || status === STATUS.REJECTED, date: null },
    { label: 'Store approved', done: status === STATUS.APPROVED, date: null },
  ];

  async function onRefresh() { setRefreshing(true); await refresh(); setRefreshing(false); }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {location.state?.justSubmitted && <Alert tone="success">Application submitted. We will review it and update this page.</Alert>}

      <StatusCard status={status} />

      {status === STATUS.REJECTED && (
        <section className="card border-red-200 p-6">
          <h2 className="font-bold">Feedback from our review team</h2>
          <p className="mt-2 text-ink-700">{application?.feedback || 'No feedback was provided.'}</p>
          {missing.length > 0 && (
            <>
              <h3 className="mt-5 text-sm font-bold">Missing or incorrect</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-700">{missing.map((m) => <li key={m}>{m}</li>)}</ul>
            </>
          )}
          <Button to="/onboarding?step=4" icon={Pencil} className="mt-6">Update my application</Button>
        </section>
      )}

      {status === STATUS.APPROVED && application?.feedback && <Alert tone="success">{application.feedback}</Alert>}

      {status === STATUS.DRAFT && (
        <section className="card p-6">
          <h2 className="font-bold">Not submitted yet</h2>
          <ul className="mt-3 space-y-2">
            {requirements.map((r) => (
              <li key={r.key}><Link to={`/onboarding?step=${r.stepIndex}`} className="flex items-center gap-2.5 text-sm hover:text-brand-700">
                {r.done ? <Check size={16} className="text-emerald-600" /> : <CircleDashed size={16} className="text-amber-500" />}
                <span className={r.done ? 'text-ink-500' : 'font-semibold'}>{r.label}</span></Link></li>
            ))}
          </ul>
          <Button to="/onboarding" className="mt-5">Continue onboarding</Button>
        </section>
      )}

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Timeline</h2>
          <Button variant="ghost" size="sm" icon={RefreshCw} loading={refreshing} onClick={onRefresh}>Refresh</Button>
        </div>
        <ol className="mt-4 space-y-5">
          {timeline.map((t, i) => (
            <li key={t.label} className="relative flex gap-4">
              {i < timeline.length - 1 && <span className={`absolute left-[13px] top-7 h-[calc(100%-4px)] w-0.5 ${timeline[i + 1].done ? 'bg-emerald-300' : 'bg-line'}`} />}
              <span className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${t.done ? (i === 2 && status === STATUS.REJECTED ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white') : 'border-2 border-line bg-white'}`}>{t.done && <Check size={15} />}</span>
              <div><p className={`text-sm ${t.done ? 'font-semibold' : 'text-ink-500'}`}>{t.label}</p>{t.date && <p className="text-xs text-ink-500">{formatDate(t.date)}</p>}</div>
            </li>
          ))}
        </ol>
        {status === STATUS.PENDING && <p className="mt-5 rounded-xl bg-surface p-3 text-sm text-ink-500">You cannot edit while the review is in progress. If you spot a mistake, contact support and we will reopen it.</p>}
      </section>

      <DevReviewPanel onChange={replaceApplication} />
    </div>
  );
}
