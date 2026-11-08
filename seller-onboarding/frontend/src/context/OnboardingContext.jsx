import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as onboardingAPI from '../services/onboardingAPI';
import { getErrorMessage } from '../services/apiClient';
import { STATUS } from '../utils/constants';
import { emptyDraft, calcProgress, getRequirements } from '../utils/onboarding';

export const OnboardingContext = createContext(null);

// Holds the seller's application so the dashboard, wizard, tracking page and chatbot share one copy.
export function OnboardingProvider({ children }) {
  const [application, setApplication] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const applyServerData = useCallback((data) => {
    setApplication(data);
    setDraft({ ...emptyDraft(), ...data.draft });
    return data;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      applyServerData(await onboardingAPI.getStatus());
    } catch (err) {
      setLoadError(getErrorMessage(err, 'We could not load your application.'));
    } finally {
      setLoading(false);
    }
  }, [applyServerData]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ── draft editing helpers (local only until saved) ──
  const updateSection = useCallback((section, patch) => {
    setDraft((d) => ({ ...d, [section]: { ...d[section], ...patch } }));
  }, []);
  const setCategories = useCallback((categories) => setDraft((d) => ({ ...d, categories })), []);
  const setDocument = useCallback((key, doc) => {
    setDraft((d) => {
      const documents = { ...d.documents };
      if (doc) documents[key] = doc;
      else delete documents[key];
      return { ...d, documents };
    });
  }, []);

  // ── server actions ──
  const saveProgress = useCallback(
    async (currentStep) => applyServerData(await onboardingAPI.saveDraft({ currentStep, draft })),
    [draft, applyServerData]
  );
  const submitApplication = useCallback(
    async () => applyServerData(await onboardingAPI.submit({ draft })),
    [draft, applyServerData]
  );

  const status = application?.status ?? STATUS.DRAFT;
  const value = useMemo(
    () => ({
      application,
      draft,
      status,
      locked: status === STATUS.PENDING || status === STATUS.APPROVED,
      progress: calcProgress(draft),
      requirements: getRequirements(draft),
      loading,
      loadError,
      refresh,
      updateSection,
      setCategories,
      setDocument,
      saveProgress,
      submitApplication,
      replaceApplication: applyServerData,
    }),
    [application, draft, status, loading, loadError, refresh, updateSection, setCategories, setDocument, saveProgress, submitApplication, applyServerData]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}
