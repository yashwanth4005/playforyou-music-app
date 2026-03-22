import { createContext, useContext, useEffect, useState } from "react";
import {
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  getCurrentUser,
  loginUser,
  registerUser,
} from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser && storedUser !== "undefined" && storedUser !== "null" ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    return storedToken && storedToken !== "undefined" ? storedToken : null;
  });
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      if (!token) {
        if (isMounted) {
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const profile = await getCurrentUser();
        if (isMounted) {
          setUser(profile);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
        }
      } catch (error) {
        if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [token]);

  function persistSession(response) {
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
  }

  async function signIn(credentials) {
    const response = await loginUser(credentials);
    persistSession(response);
    return response;
  }

  async function signUp(payload) {
    const response = await registerUser(payload);
    persistSession(response);
    return response;
  }

  function clearSession() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isBootstrapping,
        signIn,
        signUp,
        signOut: clearSession,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
