// The single source of truth for the onboarding steps, validation and progress.
// The wizard, the dashboard, the tracking page and the mock chatbot all use this file.
import { DOCUMENT_TYPES } from './constants';
import { required, validatePhone, validateEmail, hasErrors } from './validators';

export const STEPS = [
  { id: 'personal', title: 'Personal information', short: 'Personal', description: 'Who is opening the store' },
  { id: 'business', title: 'Business information', short: 'Business', description: 'Your registered business details' },
  { id: 'store', title: 'Store information', short: 'Store', description: 'How your store appears to buyers' },
  { id: 'categories', title: 'Product categories', short: 'Categories', description: 'What you plan to sell' },
  { id: 'documents', title: 'Business documents', short: 'Documents', description: 'Upload proof for verification' },
  { id: 'review', title: 'Review and submit', short: 'Review', description: 'Check everything, then send it in' },
];

export const emptyDraft = () => ({
  personal: { firstName: '', lastName: '', phone: '', city: '' },
  business: { businessName: '', businessType: '', registrationNumber: '', taxId: '', businessAddress: '' },
  store: { storeName: '', storeDescription: '', supportEmail: '' },
  categories: [],
  documents: {}, // { governmentId: { id, name, size }, ... }
});

// Returns { fieldName: 'error message' } for one step. Step 5 (review) has no fields.
export function validateStep(stepIndex, draft) {
  const d = draft;
  const e = {};
  if (stepIndex === 0) {
    e.firstName = required(d.personal.firstName, 'First name');
    e.lastName = required(d.personal.lastName, 'Last name');
    e.phone = validatePhone(d.personal.phone);
    e.city = required(d.personal.city, 'City');
  }
  if (stepIndex === 1) {
    e.businessName = required(d.business.businessName, 'Business name');
    e.businessType = required(d.business.businessType, 'Business type');
    e.businessAddress = required(d.business.businessAddress, 'Business address');
    if (d.business.businessType && d.business.businessType !== 'individual') {
      e.registrationNumber = required(d.business.registrationNumber, 'Registration number');
    }
    e.taxId = required(d.business.taxId, 'Tax ID');
  }
  if (stepIndex === 2) {
    const name = d.store.storeName.trim();
    e.storeName = !name ? 'Store name is required' : name.length < 3 ? 'Use at least 3 characters' : '';
    const desc = d.store.storeDescription.trim();
    e.storeDescription = !desc ? 'Add a short description' : desc.length < 30 ? 'Write at least 30 characters so buyers know what you offer' : '';
    e.supportEmail = validateEmail(d.store.supportEmail);
  }
  if (stepIndex === 3) {
    e.categories = d.categories.length === 0 ? 'Pick at least one category' : d.categories.length > 3 ? 'Pick up to 3 categories' : '';
  }
  if (stepIndex === 4) {
    DOCUMENT_TYPES.filter((t) => t.required).forEach((t) => {
      const skip = t.key === 'businessRegistration' && d.business.businessType === 'individual';
      e[t.key] = !skip && !d.documents[t.key] ? `${t.label} is required` : '';
    });
  }
  // keep only real errors
  return Object.fromEntries(Object.entries(e).filter(([, v]) => v));
}

export const isStepValid = (i, draft) => !hasErrors(validateStep(i, draft));

// Index of the first step that still has errors, or -1 if everything is valid.
export function firstInvalidStep(draft) {
  for (let i = 0; i < 5; i++) if (!isStepValid(i, draft)) return i;
  return -1;
}

// Flat checklist used by the dashboard, tracking page and chatbot.
export function getRequirements(draft) {
  return STEPS.slice(0, 5).map((s, i) => ({
    key: s.id,
    label: s.title,
    stepIndex: i,
    done: isStepValid(i, draft),
  }));
}

export function calcProgress(draft) {
  const reqs = getRequirements(draft);
  return Math.round((reqs.filter((r) => r.done).length / reqs.length) * 100);
}

// Human readable list of what's missing (used by the AI assistant context).
export function listMissingFields(draft) {
  const out = [];
  for (let i = 0; i < 5; i++) {
    const errs = validateStep(i, draft);
    Object.values(errs).forEach((msg) => out.push({ stepIndex: i, step: STEPS[i].title, message: msg }));
  }
  return out;
}
