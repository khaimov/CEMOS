"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => { },
  logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !user.email?.endsWith("@google.com")) {
        signOut(auth);
        setUser(null);
        setError("Access restricted to @google.com accounts only.");
      } else {
        setUser(user);
        setError(null);
      }
      setLoading(false);

      if (!user && pathname !== "/login") {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email?.endsWith("@google.com")) {
        await signOut(auth);
        setError("Access restricted to @google.com accounts only.");
        throw new Error("Domain restricted");
      }
    } catch (error: any) {
      if (error.message !== "Domain restricted") {
        console.error("Error signing in with Google", error);
        setError("Failed to sign in. Please try again.");
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setError(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
