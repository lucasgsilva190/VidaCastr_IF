import { useRouter } from "next/router";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { getUserInformations, signInFirebase } from "../../services/firebase";

interface AuthContextProps {
  user: {
    uid: string;
    name: string;
    email: string;
    token: string;
    isAdmin?: boolean;
  };
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

type UserInformations = {
  uid: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthContextProps["user"]>(null);
  const isAuthenticated = useMemo(() => !!user, [user]);
  const isAdmin = useMemo(() => user && user.isAdmin, [user]);

  const login = async (email: string, password: string) => {
    const { user } = await signInFirebase(email, password);
    const { name, isAdmin } = await getUserInformations(user.uid);

    setUser({
      uid: user.uid,
      name,
      email: user.email,
      token: user.accessToken!,
      isAdmin,
    });
    setCookie(null, "token", user.accessToken!);
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    destroyCookie(null, "token");
    router.push("/login");
  };

  useEffect(() => {
    const { token } = parseCookies();

    if (token) {
      api
        .post<{ user: UserInformations }>("/validate-token", { token })
        .then(({ data }) => {
          setUser({
            uid: data.user.uid,
            name: data.user.name,
            email: data.user.email,
            isAdmin: data.user.isAdmin,
            token,
          });
        })
        .catch((err) => {
          if (err.response.status === 401) {
            logout();
            return;
          }

          alert("Ocorreu um erro ao tentar validar o token");
        });
    }
    setLoading(false);
  }, [logout]);

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
