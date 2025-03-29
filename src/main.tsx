import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set the initial theme based on localStorage or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', prefersDark);
}

// Set the initial language based on localStorage or browser language
const savedLang = localStorage.getItem('lang') || 
  (navigator.language.startsWith('ar') ? 'ar' : 'en');
document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
document.documentElement.setAttribute('lang', savedLang);

createRoot(document.getElementById("root")!).render(<App />);
