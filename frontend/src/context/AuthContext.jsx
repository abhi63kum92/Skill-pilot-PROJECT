import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session

  // ── Restore session on app load ──────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('skillpilot_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(({ user: savedUser }) => setUser(savedUser))
      .catch(() => {
        // Token expired / invalid — clear it
        localStorage.removeItem('skillpilot_token');
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login ────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const { token, user: loggedInUser } = await loginUser(email, password);
      localStorage.setItem('skillpilot_token', token);
      setUser(loggedInUser);
      return { success: true, user: loggedInUser };
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        'Invalid credentials. Please check your email and password.';
      return { success: false, error: message };
    }
  };

  // ── Register ─────────────────────────────────────────────────
  const register = async (formData) => {
    try {
      const { token, user: newUser } = await registerUser(formData);
      localStorage.setItem('skillpilot_token', token);
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      const message =
        err.response?.data?.detail || 'Registration failed. Please try again.';
      return { success: false, error: message };
    }
  };

  // ── Update local user state (e.g. after competency save) ─────
  const updateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  // ── Logout ───────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillpilot_token');
    localStorage.removeItem('skillpilot_assessment');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
