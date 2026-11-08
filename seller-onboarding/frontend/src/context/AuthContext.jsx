import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authAPI from '../services/authAPI';
import * as sellerAPI from '../services/sellerAPI';
import { TOKEN_KEY } from '../utils/constants';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  // On page load: if we have a token, ask the backend who the user is.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    sellerAPI
      .getProfile()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const handleAuthResult = useCallback(({ token, user: u }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  }, []);

  const login = useCallback(async (values) => handleAuthResult(await authAPI.login(values)), [handleAuthResult]);
  const register = useCallback(async (values) => handleAuthResult(await authAPI.register(values)), [handleAuthResult]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
