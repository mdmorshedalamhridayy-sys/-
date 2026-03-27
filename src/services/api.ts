import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes } from 'adhan';
import { format } from 'date-fns';

export const getPrayerTimes = (lat: number, lng: number) => {
  const coords = new Coordinates(lat, lng);
  const date = new Date();
  const params = CalculationMethod.MuslimWorldLeague();
  const prayerTimes = new PrayerTimes(coords, date, params);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  return {
    fajr: format(prayerTimes.fajr, 'hh:mm a'),
    sunrise: format(prayerTimes.sunrise, 'hh:mm a'),
    dhuhr: format(prayerTimes.dhuhr, 'hh:mm a'),
    asr: format(prayerTimes.asr, 'hh:mm a'),
    maghrib: format(prayerTimes.maghrib, 'hh:mm a'),
    isha: format(prayerTimes.isha, 'hh:mm a'),
    next: prayerTimes.nextPrayer(),
    current: prayerTimes.currentPrayer(),
    lastThird: format(sunnahTimes.lastThirdOfTheNight, 'hh:mm a'),
  };
};

export const fetchSurahs = async () => {
  const response = await fetch('https://api.alquran.cloud/v1/surah');
  const data = await response.json();
  return data.data;
};

export const fetchSurahDetail = async (number: number, lang: string = 'en') => {
  const edition = lang === 'bn' ? 'bn.bengali' : 'en.sahih';
  const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,${edition},ar.alafasy`);
  const data = await response.json();
  return data.data;
};
