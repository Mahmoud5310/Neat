import { createContext, ReactNode, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: 'en' | 'ar') => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {}
});

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Initialize from localStorage or browser preference
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'en' || savedLang === 'ar') {
      return savedLang;
    }
    // Default to browser language or English
    return navigator.language.startsWith('ar') ? 'ar' : 'en';
  });

  // Update HTML attributes when language changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('lang', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
