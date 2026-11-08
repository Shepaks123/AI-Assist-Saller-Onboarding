import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ChatWidget from '../components/ChatWidget';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Button from '../components/Button';
import { OnboardingProvider } from '../context/OnboardingContext';
import { useOnboarding } from '../hooks/useOnboarding';

function Shell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { loading, loadError, refresh, application } = useOnboarding();

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-72">
        <Navbar onMenu={() => setMenuOpen(true)} />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
          {loading && !application ? (
            <LoadingSpinner label="Loading your application…" />
          ) : loadError ? (
            <div className="mx-auto max-w-md space-y-4 py-16 text-center">
              <Alert tone="error">{loadError}</Alert>
              <Button onClick={refresh}>Try again</Button>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
      {pathname !== '/assistant' && <ChatWidget currentStep={application?.currentStep ?? 0} />}
    </div>
  );
}

// The provider lives here so the application loads once, after login.
export default function DashboardLayout() {
  return (
    <OnboardingProvider>
      <Shell />
    </OnboardingProvider>
  );
}
