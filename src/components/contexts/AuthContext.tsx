import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AuthContextProps {
  user: {
    username: string;
    password: string;
  };
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<AuthContextProps["user"]>(null);
  const isAuthenticated = useMemo(() => !!user, [user]);
  const isAdmin = useMemo(() => user && user.username === "admin", [user]);
  const isSuperAdmin = useMemo(
    () => user && user.username === "superAdmin",
    [user]
  );

  const login = (username: string, password: string) => {
    setUser({ username, password });
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("username");
    localStorage.removeItem("password");
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    if (username && password) {
      login(username, password);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, isSuperAdmin, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
