import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Info, Save, Send } from 'lucide-react';
import OnboardingSteps from '../components/OnboardingSteps';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { PersonalStep, BusinessStep, StoreStep, CategoryStep, DocumentsStep, ReviewStep } from '../components/onboarding/StepForms';
import { useOnboarding } from '../hooks/useOnboarding';
import { getErrorMessage } from '../services/apiClient';
import { STEPS, validateStep, firstInvalidStep, isStepValid } from '../utils/onboarding';
import { formatTime } from '../utils/format';

const LAST = STEPS.length - 1;

export default function Onboarding() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { application, draft, locked, status, progress, updateSection, setCategories, setDocument, saveProgress, submitApplication } = useOnboarding();

  const fromUrl = Number(params.get('step'));
  const [step, setStep] = useState(Number.isInteger(fromUrl) && params.has('step') && fromUrl >= 0 && fromUrl <= LAST ? fromUrl : Math.min(application?.currentStep ?? 0, LAST));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { tone, text }
  const [confirmed, setConfirmed] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [savedAt, setSavedAt] = useState(application?.updatedAt || null);

  // Keep ?step= in the URL so refresh / back button work.
  useEffect(() => { setParams({ step: String(step) }, { replace: true }); }, [step, setParams]);

  const goTo = (i) => { setStep(i); setErrors({}); setMessage(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // Changing a field clears that field's error and any old banner.
  const update = (section, patch) => {
    updateSection(section, patch);
    setErrors((e) => { const n = { ...e }; Object.keys(patch).forEach((k) => delete n[k]); return n; });
    setMessage(null);
  };
  const clearErrorFor = (key) => setErrors((e) => { const n = { ...e }; delete n[key]; return n; });

  async function persist(nextStep) {
    setSaving(true);
    setMessage(null);
    try {
      const saved = await saveProgress(nextStep);
      setSavedAt(saved.updatedAt);
      return true;
    } catch (err) {
      setMessage({ tone: 'error', text: getErrorMessage(err, 'We could not save your progress.') });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function onSaveProgress() {
    if (locked) return;
    if (await persist(step)) setMessage({ tone: 'success', text: 'Progress saved. You can leave and continue later.' });
  }

  async function onNext() {
    if (!locked) {
      const found = validateStep(step, draft);
      setErrors(found);
      if (Object.keys(found).length) { setMessage({ tone: 'error', text: 'Please fix the highlighted fields to continue.' }); return; }
      if (!(await persist(step + 1))) return;
    }
    goTo(step + 1);
  }

  async function onSubmit() {
    setReviewError('');
    const bad = firstInvalidStep(draft);
    if (bad !== -1) { setReviewError(`"${STEPS[bad].title}" still has missing information.`); goTo(bad); setErrors(validateStep(bad, draft)); return; }
    if (!confirmed) { setReviewError('Please confirm that the information is accurate.'); return; }
    setSaving(true);
    try {
      await submitApplication();
      navigate('/tracking', { replace: true, state: { justSubmitted: true } });
    } catch (err) {
      setReviewError(getErrorMessage(err, 'We could not submit your application.'));
    } finally {
      setSaving(false);
    }
  }

  const completed = STEPS.map((_, i) => i).filter((i) => i < LAST && isStepValid(i, draft));
  const common = { draft, errors, update };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card p-5 sm:p-6">
        <OnboardingSteps current={step} completed={completed} onSelect={goTo} />
        <div className="mt-5"><ProgressBar value={progress} label="Overall progress" size="sm" /></div>
      </div>

      {locked && (
        <Alert tone="info">
          {status === 'approved' ? 'Your application is approved, so these details are read-only.' : 'Your application is under review, so it is read-only for now.'}{' '}
          <Link to="/tracking" className="font-semibold underline">View status</Link>
        </Alert>
      )}
      {status === 'rejected' && <Alert tone="error">Your application needs changes. <Link to="/tracking" className="font-semibold underline">Read the feedback</Link>, update the details, then submit again.</Alert>}

      <div className="card p-5 sm:p-8">
        <h2 className="text-xl font-extrabold tracking-tight">{STEPS[step].title}</h2>
        <p className="mb-6 mt-1 text-sm text-ink-500">{STEPS[step].description}</p>

        <fieldset disabled={locked} className="min-w-0 border-0 p-0">
          {step === 0 && <PersonalStep {...common} />}
          {step === 1 && <BusinessStep {...common} />}
          {step === 2 && <StoreStep {...common} />}
          {step === 3 && <CategoryStep {...common} setCategories={(c) => { setCategories(c); clearErrorFor('categories'); }} />}
          {step === 4 && <DocumentsStep {...common} locked={locked} setDocument={(k, d) => { setDocument(k, d); clearErrorFor(k); setMessage(null); }} />}
          {step === 5 && <ReviewStep draft={draft} onEdit={goTo} confirmed={confirmed} setConfirmed={setConfirmed} locked={locked} error={reviewError} />}
        </fieldset>

        {message && <Alert tone={message.tone} className="mt-6">{message.text}</Alert>}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <Button variant="secondary" icon={ArrowLeft} onClick={() => goTo(step - 1)} disabled={step === 0 || saving}>Previous</Button>
          <div className="flex-1 sm:text-center">
            {!locked && <button type="button" onClick={onSaveProgress} disabled={saving} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-50"><Save size={16} /> Save progress</button>}
            {savedAt && !locked && <p className="text-xs text-ink-400">Last saved at {formatTime(savedAt)}</p>}
          </div>
          {step < LAST ? (
            <Button onClick={onNext} loading={saving} icon={ArrowRight}>Next</Button>
          ) : !locked ? (
            <Button onClick={onSubmit} loading={saving} icon={Send}>Submit application</Button>
          ) : (
            <Button to="/tracking" icon={Info}>View status</Button>
          )}
        </div>
      </div>
    </div>
  );
}
