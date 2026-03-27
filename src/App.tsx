/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './AppContext';
import { Home, Quran, Hadith, Tasbih, Qibla, Settings, SurahDetail, Dua } from './pages';
import { Home as HomeIcon, Book, MessageCircle, Hash, Compass, Settings as SettingsIcon, Heart } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

function Navigation() {
  const { t } = useApp();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: HomeIcon, label: t.prayerTimes },
    { path: '/quran', icon: Book, label: t.quran },
    { path: '/dua', icon: Heart, label: t.dua },
    { path: '/tasbih', icon: Hash, label: t.tasbih },
    { path: '/qibla', icon: Compass, label: t.qibla },
    { path: '/settings', icon: SettingsIcon, label: t.settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors",
                isActive ? "text-emerald-500" : "text-zinc-500"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function AppContent() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20 font-sans selection:bg-emerald-500/30">
      <div className="max-w-md mx-auto px-4 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/quran" element={<Quran />} />
              <Route path="/quran/:id" element={<SurahDetail />} />
              <Route path="/hadith" element={<Hadith />} />
              <Route path="/dua" element={<Dua />} />
              <Route path="/tasbih" element={<Tasbih />} />
              <Route path="/qibla" element={<Qibla />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      <Navigation />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

