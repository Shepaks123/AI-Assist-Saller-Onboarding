import { Outlet } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-line bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <Button to="/login" variant="ghost" size="sm">Log in</Button>
            <Button to="/register" size="sm">Get started</Button>
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="border-t border-line py-8 text-center text-sm text-ink-500">© {new Date().getFullYear()} SellerPath. Student project demo.</footer>
    </div>
  );
}
