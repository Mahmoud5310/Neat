import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  FirebaseUser,
  signInWithGoogle,
  signInWithEmail,
  registerWithEmailAndPassword,
  logoutUser,
  subscribeToAuthChanges
} from "../lib/firebase";

// تعريف أنواع البيانات المستخدمة
type FirebaseAuthContextType = {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: Error | null;
  loginWithEmailMutation: UseMutationResult<FirebaseUser, Error, EmailPasswordCredentials>;
  loginWithGoogleMutation: UseMutationResult<FirebaseUser, Error, void>;
  registerMutation: UseMutationResult<FirebaseUser, Error, EmailPasswordCredentials>;
  logoutMutation: UseMutationResult<void, Error, void>;
};

type EmailPasswordCredentials = {
  email: string;
  password: string;
};

export const AuthContext = createContext<FirebaseAuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // الاستماع لتغييرات حالة المصادقة في Firebase
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    // إلغاء الاشتراك عند إزالة المكون
    return () => unsubscribe();
  }, []);

  // تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
  const loginWithEmailMutation = useMutation({
    mutationFn: async (credentials: EmailPasswordCredentials) => {
      return await signInWithEmail(credentials.email, credentials.password);
    },
    onSuccess: (user: FirebaseUser) => {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بعودتك!",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // تسجيل الدخول باستخدام جوجل
  const loginWithGoogleMutation = useMutation({
    mutationFn: async () => {
      return await signInWithGoogle();
    },
    onSuccess: (user: FirebaseUser) => {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بعودتك!",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تسجيل الدخول مع جوجل",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // تسجيل مستخدم جديد
  const registerMutation = useMutation({
    mutationFn: async (credentials: EmailPasswordCredentials) => {
      return await registerWithEmailAndPassword(credentials.email, credentials.password);
    },
    onSuccess: (user: FirebaseUser) => {
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "تم إنشاء حسابك بنجاح.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // تسجيل الخروج
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutUser();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل خروجك بنجاح.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginWithEmailMutation,
        loginWithGoogleMutation,
        registerMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
