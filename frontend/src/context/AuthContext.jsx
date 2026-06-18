import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, getToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialise from localStorage on first render (mirrors original index.html redirect logic)
  const [token, setTokenState] = useState(() => getToken());

  const isAuthenticated = Boolean(token);

 const login = useCallback(async (payload) => {
  const data = await loginUser(payload);

  setTokenState(getToken());

  return data;
}, []);

  const register = useCallback(async (payload) => {
    // payload: { firstName, lastName, email, phoneNumber, passwordHash }
    return registerUser(payload);
    // does NOT auto-login; original signup.html redirects to login.html
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setTokenState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
