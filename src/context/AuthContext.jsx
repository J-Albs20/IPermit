import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Demo credentials. In production this would call a real auth endpoint.
const VALID_EMAIL = 'admin@sancarloscho.gov.ph';
const VALID_PASSWORD = 'admin123';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signIn = (email, password) => {
    if (email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
      setUser({ name: 'Admin User', email: VALID_EMAIL, role: 'CHO Administrator' });
      return { ok: true };
    }
    return { ok: false, error: 'Incorrect email or password.' };
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
