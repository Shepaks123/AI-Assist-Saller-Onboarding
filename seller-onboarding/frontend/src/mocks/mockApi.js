// ═══════════════════════════════════════════════════════════════
//  MOCK BACKEND – only used when VITE_USE_MOCK=true
//  Fake "database" stored in the browser's localStorage so the app is
//  fully usable without a server. It is NOT secure – demo data only.
//  The real services in src/services call the real backend instead.
// ═══════════════════════════════════════════════════════════════
import { STATUS, TOKEN_KEY } from '../utils/constants';
import { DOCUMENT_TYPES } from '../utils/constants';
import { emptyDraft, listMissingFields, STEPS, validateStep } from '../utils/onboarding';

const USERS_KEY = 'sp_mock_users';
const APPS_KEY = 'sp_mock_apps';

const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));
const read = (key) => JSON.parse(localStorage.getItem(key) || '{}');
const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const fail = (message, status = 400) => {
  const err = new Error(message);
  err.isMock = true;
  err.status = status;
  return err;
};

function currentUser() {
  const token = localStorage.getItem(TOKEN_KEY) || '';
  const id = token.replace('mock-token-', '');
  const user = read(USERS_KEY)[id];
  if (!user) throw fail('Your session expired. Please log in again.', 401);
  return user;
}
const publicUser = ({ id, email, fullName }) => ({ id, email, fullName });

function getApp(userId) {
  const apps = read(APPS_KEY);
  return (
    apps[userId] || {
      status: STATUS.DRAFT,
      currentStep: 0,
      draft: emptyDraft(),
      feedback: '',
      missingRequirements: [],
      submittedAt: null,
      updatedAt: null,
    }
  );
}
function saveApp(userId, app) {
  const apps = read(APPS_KEY);
  apps[userId] = { ...app, updatedAt: new Date().toISOString() };
  write(APPS_KEY, apps);
  return apps[userId];
}

// ── auth ──
export async function register({ fullName, email, password }) {
  await wait();
  const users = read(USERS_KEY);
  if (Object.values(users).some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw fail('An account with this email already exists.', 409);
  }
  const id = String(Date.now());
  users[id] = { id, fullName, email, password };
  write(USERS_KEY, users);
  return { token: `mock-token-${id}`, user: publicUser(users[id]) };
}

export async function login({ email, password }) {
  await wait();
  const user = Object.values(read(USERS_KEY)).find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) throw fail('Incorrect email or password.', 401);
  return { token: `mock-token-${user.id}`, user: publicUser(user) };
}

// ── seller profile ──
export async function getProfile() {
  await wait(250);
  return publicUser(currentUser());
}
export async function updateProfile({ fullName }) {
  await wait();
  const user = currentUser();
  const users = read(USERS_KEY);
  users[user.id] = { ...user, fullName };
  write(USERS_KEY, users);
  return publicUser(users[user.id]);
}

// ── onboarding ──
export async function getStatus() {
  await wait(300);
  return getApp(currentUser().id);
}

export async function saveDraft({ currentStep, draft }) {
  await wait(400);
  const user = currentUser();
  const app = getApp(user.id);
  if (app.status === STATUS.PENDING) throw fail('Your application is under review and cannot be edited right now.', 409);
  if (app.status === STATUS.APPROVED) throw fail('Approved applications cannot be edited here.', 409);
  return saveApp(user.id, { ...app, currentStep, draft });
}

export async function submit({ draft }) {
  await wait(900);
  const user = currentUser();
  const app = getApp(user.id);
  if (app.status === STATUS.PENDING || app.status === STATUS.APPROVED) throw fail('This application was already submitted.', 409);
  const missing = listMissingFields(draft);
  if (missing.length) throw fail('Some required information is still missing.', 422);
  return saveApp(user.id, {
    ...app,
    draft,
    currentStep: 5,
    status: STATUS.PENDING,
    feedback: '',
    missingRequirements: [],
    submittedAt: new Date().toISOString(),
  });
}

// Dev-only helper so you can see the Approved / Rejected screens without an admin panel.
export async function simulateReview(decision) {
  await wait(300);
  const user = currentUser();
  const app = getApp(user.id);
  if (decision === 'approved') {
    return saveApp(user.id, { ...app, status: STATUS.APPROVED, feedback: 'Welcome aboard! Your store has been verified.', missingRequirements: [] });
  }
  return saveApp(user.id, {
    ...app,
    status: STATUS.REJECTED,
    feedback: 'We could not verify your business registration because the uploaded file is blurry.',
    missingRequirements: ['Upload a clear, full-page copy of your business registration certificate'],
  });
}

// ── documents ──
export async function uploadDocument(file, type, onProgress) {
  currentUser();
  for (let p = 10; p <= 100; p += 30) {
    await wait(180);
    onProgress?.(Math.min(p, 100));
  }
  onProgress?.(100);
  return { id: `doc-${Date.now()}`, name: file.name, size: file.size, type };
}

// ── chat (simple rule-based stand-in for the real AI) ──
export async function chat({ message, step }) {
  await wait(700);
  const user = currentUser();
  const { draft, status } = getApp(user.id);
  const q = message.toLowerCase();
  const missing = listMissingFields(draft);
  const stepTitle = STEPS[Math.min(step ?? 0, 5)].title;

  if (/(missing|left|incomplete|what.*(do|need)|next)/.test(q)) {
    if (!missing.length) {
      return { reply: 'Everything looks complete. Head to the Review step and submit your application.', suggestions: ['How long does review take?', 'What happens after approval?'] };
    }
    const lines = missing.slice(0, 5).map((m) => `• ${m.step}: ${m.message}`).join('\n');
    const extra = missing.length > 5 ? `\n…and ${missing.length - 5} more.` : '';
    return { reply: `Here is what is still missing:\n${lines}${extra}`, suggestions: ['Which documents do I need?', 'Explain this step'] };
  }
  if (/(document|upload|file|permit|certificate|id\b)/.test(q)) {
    const list = DOCUMENT_TYPES.map((d) => `• ${d.label}${d.required ? '' : ' (optional)'}: ${d.description}`).join('\n');
    return { reply: `You can upload PDF, JPG or PNG files up to 5 MB each. Required documents:\n${list}\nTip: scan the full page in good light so every corner is visible.`, suggestions: ['What is still missing?', 'Why was my upload rejected?'] };
  }
  if (/(category|categories|sell)/.test(q)) {
    return { reply: 'Choose up to 3 categories that match your main products. You can change them later, and some categories (like health or food) may need extra permits.', suggestions: ['Which documents do I need?'] };
  }
  if (/(status|review|how long|approve|approval|reject)/.test(q)) {
    const map = {
      draft: 'Your application is still a draft. Submit it to start the review.',
      pending: 'Your application is under review. Reviews usually take a few business days.',
      approved: 'Your application is approved. You can start listing products.',
      rejected: 'Your application needs changes. Open Application status to read the feedback, update your info and resubmit.',
    };
    return { reply: map[status], suggestions: ['What is still missing?'] };
  }
  if (/(explain|help|step|this)/.test(q)) {
    return { reply: `You are on "${stepTitle}". Fill in every required field, then press Next. Your progress is saved each time you move on, or any time you press Save progress.`, suggestions: ['What is still missing?', 'Which documents do I need?'] };
  }
  const errs = Object.keys(validateStep(step ?? 0, draft)).length;
  return {
    reply: `I can help with registration questions, document requirements, and checking what is missing. ${errs ? `The "${stepTitle}" step has ${errs} field(s) left to fix.` : ''}`.trim(),
    suggestions: ['What is still missing?', 'Which documents do I need?', 'Explain this step'],
  };
}

