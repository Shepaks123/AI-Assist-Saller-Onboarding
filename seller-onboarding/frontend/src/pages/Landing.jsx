import { Bot, CheckCircle2, ClipboardCheck, FileCheck2, Gauge, MessageCircleQuestion, Store } from 'lucide-react';
import Button from '../components/Button';

const FEATURES = [
  { icon: MessageCircleQuestion, title: 'Answers while you fill in the form', text: 'Ask what a field means or which document counts as proof. The assistant replies in plain language, on the same screen.' },
  { icon: FileCheck2, title: 'Catches gaps before reviewers do', text: 'It checks your application and tells you exactly what is missing, so fewer submissions bounce back.' },
  { icon: Gauge, title: 'Save and continue later', text: 'Your progress is stored at every step. Close the tab, come back tomorrow, and nothing is lost.' },
  { icon: ClipboardCheck, title: 'See where you stand', text: 'Track your application from submitted to approved, with clear feedback if something needs to change.' },
];

const BENEFITS = ['Finish in one sitting, around 10 minutes', 'Know the required documents upfront', 'Fix issues the same day, not after a week of waiting', 'Works on your phone'];

// Static preview of the product, built with plain markup (no image files needed).
function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      <div className="card p-5 shadow-lift">
        <div className="flex items-center justify-between">
          <p className="font-bold">Your application</p>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">60% complete</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-brand-100"><div className="h-full w-[60%] rounded-full bg-brand-600" /></div>
        <ul className="mt-5 space-y-3 text-sm">
          {[['Personal information', true], ['Business information', true], ['Store information', true], ['Product categories', false], ['Business documents', false]].map(([l, done]) => (
            <li key={l} className="flex items-center gap-3">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-emerald-500 text-white' : 'border border-ink-400'}`}>{done && <CheckCircle2 size={14} />}</span>
              <span className={done ? 'text-ink-500 line-through' : 'font-semibold'}>{l}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card -mt-2 ml-8 p-4 shadow-lift sm:ml-14">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white"><Bot size={18} /></span>
          <div className="text-sm">
            <p className="rounded-2xl rounded-tl-md bg-surface px-3.5 py-2.5">Two things left: pick up to 3 categories, then upload your government ID and tax certificate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50/70 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-brand-700"><Store size={16} /> Seller onboarding, guided by AI</p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">Register your store in minutes, not weeks.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">SellerPath walks you through every requirement, explains what each document is for, and tells you what is missing before you submit.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/register" size="lg">Get started</Button>
              <Button to="/login" variant="secondary" size="lg">Log in</Button>
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight">Everything a new seller needs, in one place</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Icon size={22} /></span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-ink-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-8">
        <div className="grid items-center gap-8 rounded-card bg-brand-700 p-8 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Start selling sooner</h2>
            <ul className="mt-6 space-y-3">
              {BENEFITS.map((b) => (<li key={b} className="flex items-center gap-3 text-brand-100"><CheckCircle2 size={20} className="shrink-0 text-white" />{b}</li>))}
            </ul>
          </div>
          <div className="lg:text-right">
            <Button to="/register" size="lg" className="!bg-white !text-brand-700 hover:!bg-brand-50">Create your seller account</Button>
          </div>
        </div>
      </section>
    </>
  );
}
