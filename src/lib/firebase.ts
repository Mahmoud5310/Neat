import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAP0CrPZ5hq6QUh78lAaaTTReaBnzbeAWs",
  authDomain: "test-fbc74.firebaseapp.com",
  databaseURL: "https://test-fbc74-default-rtdb.firebaseio.com",
  projectId: "test-fbc74",
  storageBucket: "test-fbc74.firebasestorage.app",
  messagingSenderId: "1025394054184",
  appId: "1:1025394054184:web:062f07a7395929305e111d"
};
// تهيئة تطبيق Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// مزود المصادقة لجوجل
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// تصدير نوع FirebaseUser
export type FirebaseUser = User;

// دالة تسجيل الدخول باستخدام جوجل
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// دالة تسجيل حساب جديد باستخدام البريد الإلكتروني وكلمة المرور
export const registerWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error registering with email and password:", error);
    throw error;
  }
};

// دالة تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email and password:", error);
    throw error;
  }
};

// دالة تسجيل الخروج
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// دالة للاستماع لتغييرات حالة المصادقة
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};