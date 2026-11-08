// Only rendered in mock mode (VITE_USE_MOCK=true). Lets you preview the
// "approved" and "rejected" screens without a real admin panel.
import { useState } from 'react';
import { USE_MOCK } from '../services/apiClient';
import { simulateReview } from './mockApi';

export default function DevReviewPanel({ onChange }) {
  const [busy, setBusy] = useState(false);
  if (!USE_MOCK) return null;
  async function run(decision) {
    setBusy(true);
    try { onChange(await simulateReview(decision)); } finally { setBusy(false); }
  }
  return (
    <div className="rounded-card border border-dashed border-ink-400 p-4 text-sm">
      <p className="font-semibold">Demo tools</p>
      <p className="text-ink-500">Pretend you are a reviewer (this panel disappears when you switch to the real backend).</p>
      <div className="mt-3 flex gap-2">
        <button disabled={busy} onClick={() => run('approved')} className="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white disabled:opacity-50">Approve</button>
        <button disabled={busy} onClick={() => run('rejected')} className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white disabled:opacity-50">Reject</button>
      </div>
    </div>
  );
}
