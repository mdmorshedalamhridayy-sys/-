import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from './types';
import { translations } from './constants';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  location: { lat: number; lng: number } | null;
  setLocation: (loc: { lat: number; lng: number }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'bn';
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem('location');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    if (location) {
      localStorage.setItem('location', JSON.stringify(location));
    }
  }, [location]);

  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location", error);
          // Default to Dhaka if location fails
          setLocation({ lat: 23.8103, lng: 90.4125 });
        }
      );
    }
  }, [location]);

  const t = translations[language];

  return (
    <AppContext.Provider value={{ language, setLanguage, t, location, setLocation }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
