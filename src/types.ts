export interface PrayerTime {
  name: string;
  time: string;
  id: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  translation?: string;
}

export interface Hadith {
  id: number;
  text: string;
  source: string;
  chapter: string;
}

export type Language = 'en' | 'bn';
