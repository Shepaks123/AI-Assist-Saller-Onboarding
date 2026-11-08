import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="text-2xl font-bold">We could not find that page</h1>
      <p className="max-w-sm text-ink-500">The link may be broken or the page may have moved.</p>
      <Button to="/">Back to home</Button>
    </div>
  );
}
