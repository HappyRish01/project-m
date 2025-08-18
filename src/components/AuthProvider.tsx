"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { getUserFromTokenWithoutGivenToken } from '../lib/server/auth';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: any;
}) => {
  const [user, setUser] = useState<any>(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      // console.log("Loading user from token...",user);
      if(!initialUser) {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          // Auto-redirect if already logged in
          if (userData) {
            // window.location.href = userData.role === 'ADMIN' ? '/admin' : '/employee';
            router.push(userData.role === 'ADMIN' ? '/admin ' : '/employee');
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    }else {
      router.push(user.role === 'ADMIN' ? '/admin' : '/employee');
    }
    
      // const user = await getUserFromTokenWithoutGivenToken();
      // // console.log("User loaded from token:", user);
      // setUser(user);
      // setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await response.json();
    // console.log("Login response data:", data.user.role);

    if (response.ok) {
      setUser(data.user);
      // console.log("71", data.user);
      if (data.user.role === "ADMIN") {
        router.replace("/admin");
      } else if (data.user.role === "EMPLOYEE") {
        // console.log("going to employee page");
        router.replace("/employee/bill");
      }
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    // router.push('/login');
    window.location.href = "/login";
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data);
      router.push("/admin");
    } else {
      throw new Error(data.message || "Registration failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
