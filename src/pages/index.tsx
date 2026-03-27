import React from 'react';
import { useApp } from '../AppContext';
import { getPrayerTimes } from '../services/api';
import { Clock, MapPin, Bell, BellOff, MessageCircle, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export function Home() {
  const { t, location, language } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  
  React.useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };
  
  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <MapPin className="text-zinc-600 mb-4 animate-bounce" size={48} />
        <p className="text-zinc-400">{t.locationAccess}</p>
      </div>
    );
  }

  const times = getPrayerTimes(location.lat, location.lng);
  const hijriDate = new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD-u-ca-islamic' : 'en-US-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const prayerList = [
    { id: 'fajr', name: t.fajr, time: times.fajr },
    { id: 'sunrise', name: t.sunrise, time: times.sunrise },
    { id: 'dhuhr', name: t.dhuhr, time: times.dhuhr },
    { id: 'asr', name: t.asr, time: times.asr },
    { id: 'maghrib', name: t.maghrib, time: times.maghrib },
    { id: 'isha', name: t.isha, time: times.isha },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-emerald-500">{t.appName}</h1>
          <p className="text-zinc-500 text-sm">{hijriDate}</p>
        </div>
        <button 
          onClick={requestNotifications}
          className={cn(
            "p-2 rounded-full transition-colors",
            notificationsEnabled ? "text-emerald-500 bg-emerald-500/10" : "text-zinc-500 bg-zinc-900"
          )}
        >
          {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
        </button>
      </header>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 text-white shadow-xl shadow-emerald-900/20"
      >
        <div className="relative z-10">
          <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">{t.nextPrayer}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-4xl font-bold capitalize">{times.next}</h2>
            <span className="text-emerald-200 text-lg">
              {prayerList.find(p => p.id === times.next)?.time}
            </span>
          </div>
          <div className="mt-6 flex items-center gap-2 text-emerald-100/80 text-sm">
            <Clock size={16} />
            <span>{format(new Date(), 'hh:mm a')}</span>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-1">
          {language === 'bn' ? 'দৈনিক রিমাইন্ডার' : 'Daily Reminder'}
        </h2>
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-3">
          <p className="text-zinc-300 italic leading-relaxed text-sm">
            {language === 'bn' 
              ? '"সুতরাং তোমরা আমাকে স্মরণ করো, আমিও তোমাদের স্মরণ করব। আর আমার প্রতি কৃতজ্ঞ হও এবং অকৃতজ্ঞ হয়ো না।"'
              : '"So remember Me; I will remember you. And be grateful to Me and do not deny Me."'}
          </p>
          <p className="text-[10px] text-emerald-500 font-bold">
            {language === 'bn' ? '— সূরা আল-বাকারা ২:১৫২' : '— Surah Al-Baqarah 2:152'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/hadith" className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-3 hover:bg-zinc-800/50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <MessageCircle size={18} />
          </div>
          <span className="text-sm font-medium">{t.hadith}</span>
        </Link>
        <Link to="/dua" className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-3 hover:bg-zinc-800/50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Heart size={18} />
          </div>
          <span className="text-sm font-medium">{t.dua}</span>
        </Link>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-1">{t.prayerTimes}</h2>
        {prayerList.map((prayer, idx) => {
          const isCurrent = times.current === prayer.id;
          return (
            <motion.div
              key={prayer.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                isCurrent 
                  ? 'bg-emerald-500/10 border border-emerald-500/30' 
                  : 'bg-zinc-900/50 border border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
                <span className={`font-medium ${isCurrent ? 'text-emerald-400' : 'text-zinc-300'}`}>
                  {prayer.name}
                </span>
              </div>
              <span className={`font-mono text-sm ${isCurrent ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
                {prayer.time}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function Quran() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [surahs, setSurahs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    import('../services/api').then(api => {
      api.fetchSurahs().then(data => {
        setSurahs(data);
        setLoading(false);
      });
    });
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) ||
    s.name.includes(search)
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.quran}</h1>
      </header>

      <div className="relative">
        <input
          type="text"
          placeholder={t.searchSurah}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredSurahs.map((surah) => (
            <motion.button
              key={surah.number}
              onClick={() => navigate(`/quran/${surah.number}`)}
              className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800/50 transition-colors group text-left w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl text-xs font-bold text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  {surah.number}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-200">{surah.englishName}</h3>
                  <p className="text-xs text-zinc-500">{surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-arabic text-xl text-emerald-500">{surah.name}</p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SurahDetail() {
  const { t, language } = useApp();
  const { id: surahId } = useParams();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (surahId) {
      import('../services/api').then(api => {
        api.fetchSurahDetail(parseInt(surahId), language).then(res => {
          setData(res);
          setLoading(false);
        });
      });
    }
  }, [surahId, language]);

  if (loading) return <div className="flex justify-center py-40"><div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  const uthmani = data[0];
  const translation = data[1];
  const audio = data[2];

  return (
    <div className="space-y-8 pb-10">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-arabic text-emerald-500">{uthmani.name}</h1>
        <p className="text-zinc-400">{uthmani.englishName} • {uthmani.englishNameTranslation}</p>
      </header>

      <div className="space-y-12">
        {uthmani.ayahs.map((ayah: any, index: number) => (
          <div key={ayah.number} className="space-y-6">
            <div className="flex justify-between items-start gap-4">
              <span className="text-[10px] font-bold text-zinc-600 bg-zinc-900 px-2 py-1 rounded">
                {ayah.numberInSurah}
              </span>
              <p className="text-right text-3xl font-arabic leading-relaxed text-zinc-100" dir="rtl">
                {ayah.text}
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed border-l-2 border-emerald-500/30 pl-4 italic">
              {translation.ayahs[index].text}
            </p>
            <div className="flex justify-end">
               <audio controls className="h-8 opacity-50 hover:opacity-100 transition-opacity">
                 <source src={audio.ayahs[index].audio} type="audio/mpeg" />
               </audio>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hadith() {
  const { t, language } = useApp();
  const [search, setSearch] = React.useState('');
  
  const hadiths = language === 'bn' ? [
    { id: 1, text: "নিশ্চয়ই সকল কাজের ফলাফল নিয়তের ওপর নির্ভরশীল।", source: "সহীহ বুখারী: ১", chapter: "নিয়ত" },
    { id: 2, text: "তোমাদের মধ্যে সেই ব্যক্তিই সর্বোত্তম যে তার চরিত্রের দিক দিয়ে সবচেয়ে ভালো।", source: "সহীহ বুখারী: ৬০৩৫", chapter: "চরিত্র" },
    { id: 3, text: "তোমাদের কেউ ততক্ষণ পর্যন্ত মুমিন হতে পারবে না যতক্ষণ না সে তার ভাইয়ের জন্য তা পছন্দ করে যা সে নিজের জন্য পছন্দ করে।", source: "সহীহ মুসলিম: ৪৫", chapter: "ঈমান" },
    { id: 4, text: "পবিত্রতা ঈমানের অর্ধেক।", source: "সহীহ মুসলিম: ২২৩", chapter: "পবিত্রতা" },
    { id: 5, text: "যে ব্যক্তি আল্লাহর সন্তুষ্টির জন্য একটি মসজিদ নির্মাণ করবে, আল্লাহ তার জন্য জান্নাতে একটি ঘর নির্মাণ করবেন।", source: "সহীহ বুখারী: ৪৫০", chapter: "মসজিদ" },
    { id: 6, text: "তোমরা সহজ করো, কঠিন করো না; সুসংবাদ দাও, বিতৃষ্ণ করো না।", source: "সহীহ বুখারী: ৬৯", chapter: "দাওয়াত" },
    { id: 7, text: "মুমিনদের মধ্যে পূর্ণাঙ্গ ঈমানদার সেই ব্যক্তি, যার চরিত্র সবচেয়ে সুন্দর।", source: "সুনানে তিরমিজি: ১১৬২", chapter: "চরিত্র" },
    { id: 8, text: "যে ব্যক্তি রমজান মাসে ঈমানের সাথে ও সওয়াবের আশায় রোজা রাখে, তার পূর্ববর্তী সকল গুনাহ ক্ষমা করে দেওয়া হয়।", source: "সহীহ বুখারী: ১৯০১", chapter: "রোজা" },
    { id: 9, text: "তোমাদের মধ্যে সর্বোত্তম সেই ব্যক্তি, যে কুরআন শেখে এবং অন্যকে শেখায়।", source: "সহীহ বুখারী: ৫০২৭", chapter: "কুরআন" },
    { id: 10, text: "আল্লাহর কাছে সবচেয়ে প্রিয় আমল হলো যা নিয়মিত করা হয়, যদিও তা অল্প হয়।", source: "সহীহ বুখারী: ৬৪৬৫", chapter: "আমল" },
  ] : [
    { id: 1, text: "Actions are but by intentions and every man shall have only that which he intended.", source: "Sahih Bukhari: 1", chapter: "Intentions" },
    { id: 2, text: "The best among you are those who have the best manners and character.", source: "Sahih Bukhari: 6035", chapter: "Character" },
    { id: 3, text: "None of you [truly] believes until he loves for his brother that which he loves for himself.", source: "Sahih Muslim: 45", chapter: "Faith" },
    { id: 4, text: "Cleanliness is half of faith.", source: "Sahih Muslim: 223", chapter: "Purity" },
    { id: 5, text: "Whoever builds a mosque for Allah, Allah will build for him a house in Paradise.", source: "Sahih Bukhari: 450", chapter: "Mosque" },
    { id: 6, text: "Make things easy and do not make them difficult, cheer the people up and do not be repulsive.", source: "Sahih Bukhari: 69", chapter: "Dawah" },
    { id: 7, text: "The most perfect believer in faith is the one whose character is the finest.", source: "Sunan al-Tirmidhi: 1162", chapter: "Character" },
    { id: 8, text: "Whoever fasts Ramadan out of faith and in the hope of reward, his previous sins will be forgiven.", source: "Sahih Bukhari: 1901", chapter: "Fasting" },
    { id: 9, text: "The best among you is he who learns the Quran and teaches it.", source: "Sahih Bukhari: 5027", chapter: "Quran" },
    { id: 10, text: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.", source: "Sahih Bukhari: 6465", chapter: "Deeds" },
  ];

  const filtered = hadiths.filter(h => h.text.toLowerCase().includes(search.toLowerCase()) || h.chapter.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">{t.hadith}</h1>
      </header>
      <div className="relative">
        <input
          type="text"
          placeholder={language === 'bn' ? "হাদিস খুঁজুন..." : "Search hadith..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
        />
      </div>
      <div className="grid gap-4">
        {filtered.map(h => (
          <motion.div 
            key={h.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl space-y-4 hover:border-emerald-500/20 transition-all group"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                {h.chapter}
              </span>
              <span className="text-[10px] text-zinc-600 font-mono">#{h.id}</span>
            </div>
            <p className="text-zinc-200 leading-relaxed text-lg font-medium">{h.text}</p>
            <div className="flex items-center gap-2 pt-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <p className="text-xs text-zinc-500 font-semibold">{h.source}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function Tasbih() {
  const { t } = useApp();
  const [count, setCount] = React.useState(() => {
    const saved = localStorage.getItem('tasbih_count');
    return saved ? parseInt(saved) : 0;
  });

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem('tasbih_count', newCount.toString());
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const reset = () => {
    if (window.confirm('Reset counter?')) {
      setCount(0);
      localStorage.setItem('tasbih_count', '0');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[75vh] space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">{t.tasbih}</h1>
        <p className="text-zinc-500 text-sm font-medium tracking-wide">{t.tasbihCount}</p>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Decorative Rings */}
        <div className="absolute w-80 h-80 border border-emerald-500/5 rounded-full animate-[spin_20s_linear_infinite]" />
        <div className="absolute w-72 h-72 border border-emerald-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
        
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={increment}
          className="w-64 h-64 rounded-full bg-zinc-900 border-[12px] border-emerald-500/10 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)] group relative z-10"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-active:opacity-100 transition-opacity" />
          <span className="text-8xl font-mono font-bold text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{count}</span>
          <div className="mt-2 w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse" />
        </motion.button>
      </div>

      <div className="flex gap-6">
        <button 
          onClick={reset}
          className="px-10 py-4 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl text-sm font-bold text-zinc-500 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
        >
          {t.reset}
        </button>
      </div>
    </div>
  );
}

export function Qibla() {
  const { t, location } = useApp();
  const [heading, setHeading] = React.useState(0);

  React.useEffect(() => {
    const handleOrientation = (e: any) => {
      if (e.webkitCompassHeading) {
        setHeading(e.webkitCompassHeading);
      } else if (e.alpha) {
        setHeading(360 - e.alpha);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Simple Qibla calculation (Kaaba is at 21.4225° N, 39.8262° E)
  const calculateQibla = (lat: number, lng: number) => {
    const phiK = 21.4225 * Math.PI / 180;
    const lambdaK = 39.8262 * Math.PI / 180;
    const phi = lat * Math.PI / 180;
    const lambda = lng * Math.PI / 180;
    const q = Math.atan2(Math.sin(lambdaK - lambda), Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda));
    return (q * 180 / Math.PI + 360) % 360;
  };

  const qiblaAngle = location ? calculateQibla(location.lat, location.lng) : 0;

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{t.qibla}</h1>
        <p className="text-zinc-500 text-sm">Align your device to find Kaaba</p>
      </div>

      <div className="relative w-64 h-64">
        <motion.div 
          animate={{ rotate: -heading }}
          className="absolute inset-0 rounded-full border-2 border-zinc-800"
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-zinc-500 font-bold text-xs">N</div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-zinc-500 font-bold text-xs">S</div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">E</div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">W</div>
          
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${qiblaAngle}deg)` }}
          >
            <div className="w-1 h-32 bg-emerald-500 rounded-full relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 rotate-45 rounded-sm" />
            </div>
          </div>
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-zinc-100 rounded-full border-4 border-black" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-emerald-500 font-mono font-bold text-xl">{Math.round(qiblaAngle)}°</p>
        <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Qibla Angle</p>
      </div>
    </div>
  );
}

export function Settings() {
  const { t, language, setLanguage } = useApp();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">{t.settings}</h1>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-1">{t.language}</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage('bn')}
              className={cn(
                "p-5 rounded-[2rem] border transition-all text-sm font-bold flex flex-col items-center gap-2",
                language === 'bn' ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-zinc-900/50 border-zinc-800 text-zinc-500"
              )}
            >
              <span className="text-xl">অ</span>
              {t.bangla}
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={cn(
                "p-5 rounded-[2rem] border transition-all text-sm font-bold flex flex-col items-center gap-2",
                language === 'en' ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-zinc-900/50 border-zinc-800 text-zinc-500"
              )}
            >
              <span className="text-xl">A</span>
              {t.english}
            </button>
          </div>
        </section>

        <section className="p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="font-bold text-zinc-200">Al-Mumin</h3>
              <p className="text-xs text-zinc-500">Version 1.2.0</p>
            </div>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            A professional Islamic companion app built for the global Muslim community. 
            Designed for spiritual growth and daily practice.
          </p>
        </section>
      </div>
    </div>
  );
}

export function Dua() {
  const { t, language } = useApp();
  const [search, setSearch] = React.useState('');

  const duas = language === 'bn' ? [
    { id: 1, title: "ঘুম থেকে ওঠার দুয়া", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", pronunciation: "আলহামদু লিল্লাহিল্লাযী আহয়ানা বা'দা মা আমাতানা ওয়া ইলাইহিন নুশূর।", translation: "সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাদের মৃত (নিদ্রা) করার পর জীবিত করেছেন এবং তাঁর দিকেই পুনরুত্থান।" },
    { id: 2, title: "খাওয়ার আগের দুয়া", arabic: "بِسْمِ اللَّهِ", pronunciation: "বিসমিল্লাহ।", translation: "আল্লাহর নামে শুরু করছি।" },
    { id: 3, title: "মসজিদে প্রবেশের দুয়া", arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", pronunciation: "আল্লাহুম্মাফতাহলী আবওয়াবা রাহমাতিক।", translation: "হে আল্লাহ! আমার জন্য আপনার রহমতের দরজাগুলো খুলে দিন।" },
    { id: 4, title: "পিতা-মাতার জন্য দুয়া", arabic: "رَّبِّ ارْحَمْهُمَا كَمَا রَبَّيَانِي صَغِيرًا", pronunciation: "রাব্বির হামহুমা কামা রাব্বায়ানী সাগীরা।", translation: "হে আমার প্রতিপালক! তাঁদের উভয়ের প্রতি দয়া করুন, যেভাবে তাঁরা আমাকে শৈশবে লালন-পালন করেছেন।" },
    { id: 5, title: "বিপদে পড়ার দুয়া", arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", pronunciation: "লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নী কুনতু মিনায যালিমীন।", translation: "আপনি ছাড়া কোনো ইলাহ নেই, আপনি পবিত্র মহান। নিশ্চয়ই আমি পাপিষ্ঠদের অন্তর্ভুক্ত হয়ে গেছি।" },
  ] : [
    { id: 1, title: "Dua after waking up", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", pronunciation: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa-ilayhin-nushur.", translation: "All praise be to Allah who gave us life after our death and unto Him is the resurrection." },
    { id: 2, title: "Dua before eating", arabic: "بِسْمِ اللَّهِ", pronunciation: "Bismillah.", translation: "In the name of Allah." },
    { id: 3, title: "Dua for entering Mosque", arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", pronunciation: "Allahumma-ftah li abwaba rahmatik.", translation: "O Allah, open for me the gates of Your mercy." },
    { id: 4, title: "Dua for parents", arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", pronunciation: "Rabbi-rhamhuma kama rabbayani saghira.", translation: "My Lord, have mercy upon them as they brought me up [when I was] small." },
  ];

  const filtered = duas.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.translation.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <header className="text-center space-y-4">
        <p className="text-3xl font-arabic text-emerald-500/80">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <h1 className="text-2xl font-bold">{t.dua}</h1>
      </header>
      <div className="relative px-2">
        <input
          type="text"
          placeholder={t.searchDua}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
        />
      </div>
      <div className="grid gap-6">
        {filtered.map(d => (
          <motion.div 
            key={d.id} 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] space-y-6 shadow-xl shadow-black/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              <h3 className="font-bold text-emerald-500 text-lg">{d.title}</h3>
            </div>
            
            <div className="space-y-6">
              <p className="text-right text-3xl font-arabic leading-[1.8] text-zinc-100" dir="rtl">{d.arabic}</p>
              
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{t.pronunciation}</p>
                  <p className="text-sm text-emerald-400/90 font-medium leading-relaxed">{d.pronunciation}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{t.meaning}</p>
                  <p className="text-sm text-zinc-400 italic leading-relaxed">{d.translation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
