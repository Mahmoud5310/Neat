import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { TRANSLATIONS } from '@/lib/constants';

export function useLanguage() {
  return useTranslation();
}

export function useTranslation() {
  const { language, setLanguage } = useContext(LanguageContext);
  
  const t = (key: string, params?: string | Record<string, any>) => {
    // Split the key into sections (e.g., 'home.hero.title' => ['home', 'hero', 'title'])
    const keys = key.split('.');
    
    // Get the translation dictionary for the current language
    const translations = TRANSLATIONS[language as 'en' | 'ar'];
    
    // Navigate through the nested translations object
    let result = translations;
    for (const k of keys) {
      // @ts-ignore - we're dynamically accessing nested properties
      if (result && result[k]) {
        // @ts-ignore
        result = result[k];
      } else {
        // If translation not found, return the key as fallback
        return key;
      }
    }
    
    // Convert the result to string safely
    let translatedText = typeof result === 'object' ? JSON.stringify(result) : String(result);
    
    // Handle parameter substitution
    if (params) {
      if (typeof params === 'string') {
        // If params is a string, just replace the first placeholder
        translatedText = translatedText.replace('{0}', params);
      } else {
        // If params is an object, replace named placeholders
        for (const [key, value] of Object.entries(params)) {
          translatedText = translatedText.replace(new RegExp(`{${key}}`, 'g'), String(value));
        }
      }
    }
    
    return translatedText;
  };
  
  const isRtl = language === 'ar';
  
  const changeLanguage = (newLang: 'en' | 'ar') => {
    setLanguage(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  };
  
  return {
    language,
    isRtl,
    t,
    changeLanguage
  };
}
