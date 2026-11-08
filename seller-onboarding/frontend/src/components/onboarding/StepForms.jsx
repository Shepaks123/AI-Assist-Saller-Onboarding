// The six wizard steps. Each receives { draft, errors, onChange... } from pages/Onboarding.jsx.
import { Check, Pencil } from 'lucide-react';
import InputField from '../InputField';
import FileUpload from '../FileUpload';
import { BUSINESS_TYPES, CATEGORIES, DOCUMENT_TYPES } from '../../utils/constants';
import { STEPS } from '../../utils/onboarding';

const grid = 'grid gap-5 sm:grid-cols-2';

export function PersonalStep({ draft, errors, update }) {
  const p = draft.personal;
  const set = (e) => update('personal', { [e.target.name]: e.target.value });
  return (
    <div className={grid}>
      <InputField label="First name" name="firstName" value={p.firstName} onChange={set} error={errors.firstName} required autoComplete="given-name" />
      <InputField label="Last name" name="lastName" value={p.lastName} onChange={set} error={errors.lastName} required autoComplete="family-name" />
      <InputField label="Mobile number" name="phone" type="tel" value={p.phone} onChange={set} error={errors.phone} hint="We use it for account verification only." required autoComplete="tel" placeholder="0917 123 4567" />
      <InputField label="City" name="city" value={p.city} onChange={set} error={errors.city} required autoComplete="address-level2" />
    </div>
  );
}

export function BusinessStep({ draft, errors, update }) {
  const b = draft.business;
  const set = (e) => update('business', { [e.target.name]: e.target.value });
  const individual = b.businessType === 'individual';
  return (
    <div className={grid}>
      <InputField label="Business name" name="businessName" value={b.businessName} onChange={set} error={errors.businessName} required />
      <InputField label="Business type" name="businessType" as="select" options={BUSINESS_TYPES} value={b.businessType} onChange={set} error={errors.businessType} required />
      <InputField label="Registration number" name="registrationNumber" value={b.registrationNumber} onChange={set} error={errors.registrationNumber} required={!individual} disabled={individual} hint={individual ? 'Not needed for individual sellers.' : 'Found on your DTI or SEC certificate.'} />
      <InputField label="Tax ID" name="taxId" value={b.taxId} onChange={set} error={errors.taxId} required />
      <div className="sm:col-span-2">
        <InputField label="Business address" name="businessAddress" as="textarea" value={b.businessAddress} onChange={set} error={errors.businessAddress} required />
      </div>
    </div>
  );
}

export function StoreStep({ draft, errors, update }) {
  const s = draft.store;
  const set = (e) => update('store', { [e.target.name]: e.target.value });
  return (
    <div className="space-y-5">
      <div className={grid}>
        <InputField label="Store name" name="storeName" value={s.storeName} onChange={set} error={errors.storeName} hint="This is what buyers see on your store page." required />
        <InputField label="Customer support email" name="supportEmail" type="email" value={s.supportEmail} onChange={set} error={errors.supportEmail} required />
      </div>
      <InputField label="Store description" name="storeDescription" as="textarea" value={s.storeDescription} onChange={set} error={errors.storeDescription} hint={`${s.storeDescription.trim().length} characters · tell buyers what you sell and what makes it special`} required />
    </div>
  );
}

export function CategoryStep({ draft, errors, setCategories }) {
  const selected = draft.categories;
  function toggle(id) {
    setCategories(selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id]);
  }
  return (
    <div>
      <p className="mb-4 text-sm text-ink-500">Pick up to 3. <span className="font-semibold text-ink-700">{selected.length}/3 selected</span></p>
      <div className="grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map((c) => {
          const on = selected.includes(c.id);
          const blocked = !on && selected.length >= 3;
          return (
            <button key={c.id} type="button" onClick={() => toggle(c.id)} disabled={blocked} aria-pressed={on}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors disabled:opacity-50 ${on ? 'border-brand-500 bg-brand-50' : 'border-line bg-white hover:border-brand-300'}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${on ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-400'}`}>{on && <Check size={14} />}</span>
              <span>
                <span className="block text-sm font-semibold">{c.label}</span>
                <span className="block text-xs text-ink-500">{c.hint}</span>
              </span>
            </button>
          );
        })}
      </div>
      {errors.categories && <p className="mt-3 text-sm font-medium text-red-600" role="alert">{errors.categories}</p>}
    </div>
  );
}

export function DocumentsStep({ draft, errors, setDocument, locked }) {
  const individual = draft.business.businessType === 'individual';
  return (
    <div className="space-y-6">
      {DOCUMENT_TYPES.map((t) => {
        const skipped = t.key === 'businessRegistration' && individual;
        return (
          <FileUpload key={t.key} label={t.label + (skipped ? ' (not needed)' : '')} description={t.description} docType={t.key}
            required={t.required && !skipped} disabled={locked || skipped} value={draft.documents[t.key]} error={errors[t.key]} onChange={(doc) => setDocument(t.key, doc)} />
        );
      })}
    </div>
  );
}

function Section({ title, stepIndex, onEdit, children }) {
  return (
    <section className="rounded-xl border border-line p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <button type="button" onClick={() => onEdit(stepIndex)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"><Pencil size={13} /> Edit</button>
      </div>
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">{children}</dl>
    </section>
  );
}
const Row = ({ label, value }) => (
  <div><dt className="text-xs text-ink-500">{label}</dt><dd className="break-words font-medium">{value || '—'}</dd></div>
);

export function ReviewStep({ draft, onEdit, confirmed, setConfirmed, locked, error }) {
  const { personal: p, business: b, store: s } = draft;
  const typeLabel = BUSINESS_TYPES.find((t) => t.value === b.businessType)?.label;
  const cats = draft.categories.map((id) => CATEGORIES.find((c) => c.id === id)?.label).join(', ');
  return (
    <div className="space-y-4">
      <Section title={STEPS[0].title} stepIndex={0} onEdit={onEdit}>
        <Row label="Name" value={`${p.firstName} ${p.lastName}`.trim()} /><Row label="Mobile" value={p.phone} /><Row label="City" value={p.city} />
      </Section>
      <Section title={STEPS[1].title} stepIndex={1} onEdit={onEdit}>
        <Row label="Business" value={b.businessName} /><Row label="Type" value={typeLabel} /><Row label="Registration no." value={b.registrationNumber} /><Row label="Tax ID" value={b.taxId} /><Row label="Address" value={b.businessAddress} />
      </Section>
      <Section title={STEPS[2].title} stepIndex={2} onEdit={onEdit}>
        <Row label="Store name" value={s.storeName} /><Row label="Support email" value={s.supportEmail} /><Row label="Description" value={s.storeDescription} />
      </Section>
      <Section title={STEPS[3].title} stepIndex={3} onEdit={onEdit}><Row label="Selected" value={cats} /></Section>
      <Section title={STEPS[4].title} stepIndex={4} onEdit={onEdit}>
        {DOCUMENT_TYPES.map((t) => <Row key={t.key} label={t.label} value={draft.documents[t.key]?.name} />)}
      </Section>
      {!locked && (
        <label className="flex items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-600" />
          <span>I confirm the information and documents are accurate and belong to me or my business.</span>
        </label>
      )}
      {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}
    </div>
  );
}
