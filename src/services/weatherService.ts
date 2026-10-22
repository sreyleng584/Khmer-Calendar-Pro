/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeatherConditionInfo {
  code: number;
  labelKh: string;
  labelEn: string;
  iconName: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-fog' | 'cloud-drizzle' | 'cloud-rain' | 'cloud-lightning' | 'snowflake' | 'wind';
}

/**
 * WMO Weather interpretation codes (WW) mapping
 * http://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
 */
export function getWeatherCondition(code: number): WeatherConditionInfo {
  switch (code) {
    case 0:
      return { code, labelKh: 'មេឃស្រឡះ', labelEn: 'Clear Sky', iconName: 'sun' };
    case 1:
      return { code, labelKh: 'ស្រឡះភាគច្រើន', labelEn: 'Mainly Clear', iconName: 'sun' };
    case 2:
      return { code, labelKh: 'មានពពកខ្លះ', labelEn: 'Partly Cloudy', iconName: 'cloud-sun' };
    case 3:
      return { code, labelKh: 'មានពពកច្រើន', labelEn: 'Overcast', iconName: 'cloud' };
    case 45:
    case 48:
      return { code, labelKh: 'មានអ័ព្ទ', labelEn: 'Foggy', iconName: 'cloud-fog' };
    case 51:
    case 53:
    case 55:
      return { code, labelKh: 'ភ្លៀងរលឹមស្រិចៗ', labelEn: 'Drizzle', iconName: 'cloud-drizzle' };
    case 56:
    case 57:
      return { code, labelKh: 'ភ្លៀងរលឹមត្រជាក់ខ្លាំង', labelEn: 'Freezing Drizzle', iconName: 'cloud-drizzle' };
    case 61:
      return { code, labelKh: 'ភ្លៀងតិចតួច', labelEn: 'Slight Rain', iconName: 'cloud-rain' };
    case 63:
      return { code, labelKh: 'ភ្លៀងមធ្យម', labelEn: 'Moderate Rain', iconName: 'cloud-rain' };
    case 65:
      return { code, labelKh: 'ភ្លៀងខ្លាំង', labelEn: 'Heavy Rain', iconName: 'cloud-rain' };
    case 66:
    case 67:
      return { code, labelKh: 'ភ្លៀងត្រជាក់ស្រេប', labelEn: 'Freezing Rain', iconName: 'cloud-rain' };
    case 71:
    case 73:
    case 75:
      return { code, labelKh: 'ព្រិលធ្លាក់', labelEn: 'Snow Fall', iconName: 'snowflake' };
    case 77:
      return { code, labelKh: 'គ្រាប់ព្រិលតូចៗ', labelEn: 'Snow Grains', iconName: 'snowflake' };
    case 80:
      return { code, labelKh: 'ភ្លៀងកន្ត្រាក់តិចតួច', labelEn: 'Light Showers', iconName: 'cloud-rain' };
    case 81:
      return { code, labelKh: 'ភ្លៀងកន្ត្រាក់មធ្យម', labelEn: 'Moderate Showers', iconName: 'cloud-rain' };
    case 82:
      return { code, labelKh: 'ភ្លៀងកន្ត្រាក់ខ្លាំង', labelEn: 'Violent Showers', iconName: 'cloud-rain' };
    case 85:
    case 86:
      return { code, labelKh: 'ព្រិលកន្ត្រាក់', labelEn: 'Snow Showers', iconName: 'snowflake' };
    case 95:
      return { code, labelKh: 'ព្យុះផ្គររន្ទះ', labelEn: 'Thunderstorm', iconName: 'cloud-lightning' };
    case 96:
    case 99:
      return { code, labelKh: 'ព្យុះផ្គររន្ទះមានព្រិលពង្រាង', labelEn: 'Thunderstorm with Hail', iconName: 'cloud-lightning' };
    default:
      return { code, labelKh: 'មានពពក', labelEn: 'Cloudy', iconName: 'cloud' };
  }
}

export interface WeatherLocation {
  id: string;
  nameKh: string;
  nameEn: string;
  latitude: number;
  longitude: number;
  provinceKh?: string;
  provinceEn?: string;
}

export const POPULAR_CAMBODIA_LOCATIONS: WeatherLocation[] = [
  { id: 'phnom-penh', nameKh: 'រាជធានីភ្នំពេញ', nameEn: 'Phnom Penh', latitude: 11.5564, longitude: 104.9282, provinceKh: 'ភ្នំពេញ', provinceEn: 'Phnom Penh' },
  { id: 'siem-reap', nameKh: 'សៀមរាប (អង្គរ)', nameEn: 'Siem Reap (Angkor)', latitude: 13.3618, longitude: 103.8606, provinceKh: 'សៀមរាប', provinceEn: 'Siem Reap' },
  { id: 'battambang', nameKh: 'បាត់ដំបង', nameEn: 'Battambang', latitude: 13.0957, longitude: 103.2022, provinceKh: 'បាត់ដំបង', provinceEn: 'Battambang' },
  { id: 'sihanoukville', nameKh: 'ព្រះសីហនុ', nameEn: 'Sihanoukville', latitude: 10.6275, longitude: 103.5221, provinceKh: 'ព្រះសីហនុ', provinceEn: 'Preah Sihanouk' },
  { id: 'kampot', nameKh: 'កំពត', nameEn: 'Kampot', latitude: 10.5942, longitude: 104.1640, provinceKh: 'កំពត', provinceEn: 'Kampot' },
  { id: 'kandal', nameKh: 'កណ្តាល (តាខ្មៅ)', nameEn: 'Kandal (Ta Khmau)', latitude: 11.4833, longitude: 104.9500, provinceKh: 'កណ្តាល', provinceEn: 'Kandal' },
  { id: 'kampong-cham', nameKh: 'កំពង់ចាម', nameEn: 'Kampong Cham', latitude: 11.9934, longitude: 105.4635, provinceKh: 'កំពង់ចាម', provinceEn: 'Kampong Cham' },
  { id: 'pursat', nameKh: 'ពោធិ៍សាត់', nameEn: 'Pursat', latitude: 12.5388, longitude: 103.9192, provinceKh: 'ពោធិ៍សាត់', provinceEn: 'Pursat' },
  { id: 'koh-kong', nameKh: 'កោះកុង', nameEn: 'Koh Kong', latitude: 11.6153, longitude: 102.9838, provinceKh: 'កោះកុង', provinceEn: 'Koh Kong' },
  { id: 'mondulkiri', nameKh: 'មណ្ឌលគិរី (សែនមនោរម្យ)', nameEn: 'Mondulkiri (Sen Monorom)', latitude: 12.4558, longitude: 107.1881, provinceKh: 'មណ្ឌលគិរី', provinceEn: 'Mondulkiri' },
  { id: 'ratanakiri', nameKh: 'រតនគិរី (បានលុង)', nameEn: 'Ratanakiri (Banlung)', latitude: 13.7463, longitude: 106.9873, provinceKh: 'រតនគិរី', provinceEn: 'Ratanakiri' },
  { id: 'kampong-som', nameKh: 'កែប', nameEn: 'Kep', latitude: 10.4833, longitude: 104.3167, provinceKh: 'កែប', provinceEn: 'Kep' },
];

export const DEFAULT_LOCATION: WeatherLocation = POPULAR_CAMBODIA_LOCATIONS[0];

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  condition: WeatherConditionInfo;
}

export interface HourlyForecastItem {
  time: string; // ISO string e.g. 2026-10-22T14:00
  hourLabel: string; // e.g. "14:00"
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  dayLabelKh: string;
  dayLabelEn: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  sunrise: string;
  sunset: string;
  condition: WeatherConditionInfo;
}

export interface MonthlyClimateItem {
  month: number; // 1-12
  monthNameKh: string;
  monthNameEn: string;
  seasonKh: string;
  seasonEn: string;
  averageTempMax: number;
  averageTempMin: number;
  typicalRainfallMm: number;
  descriptionKh: string;
  descriptionEn: string;
}

/**
 * Historical climate normals for Cambodia (Climatological Averages based on Ministry of Water Resources and Meteorology / WMO 1991-2020)
 */
export const CAMBODIA_MONTHLY_CLIMATE: MonthlyClimateItem[] = [
  {
    month: 1,
    monthNameKh: 'មករា',
    monthNameEn: 'January',
    seasonKh: 'រដូវរំហើយ (ត្រជាក់ ស្ងួត)',
    seasonEn: 'Cool & Dry Season (Northeast Monsoon)',
    averageTempMax: 31,
    averageTempMin: 21,
    typicalRainfallMm: 10,
    descriptionKh: 'ធាតុអាកាសត្រជាក់ស្រួល សំណើមទាប មេឃស្រឡះល្អបំផុតសម្រាប់ការធ្វើដំណើរ។',
    descriptionEn: 'Pleasantly cool and dry, low humidity, sunny skies ideal for travel.',
  },
  {
    month: 2,
    monthNameKh: 'កុម្ភៈ',
    monthNameEn: 'February',
    seasonKh: 'រដូវរំហើយ (កម្តៅចាប់ផ្តើមឡើង)',
    seasonEn: 'Dry Season (Warming Up)',
    averageTempMax: 33,
    averageTempMin: 22,
    typicalRainfallMm: 15,
    descriptionKh: 'កម្តៅថ្ងៃចាប់ផ្តើមកើនឡើង អាកាសធាតុស្ងួត ភ្លៀងធ្លាក់កម្រមានណាស់។',
    descriptionEn: 'Temperatures rise gradually, clear skies, very rare precipitation.',
  },
  {
    month: 3,
    monthNameKh: 'មីនា',
    monthNameEn: 'March',
    seasonKh: 'រដូវប្រាំង (ក្តៅ)',
    seasonEn: 'Hot & Dry Season',
    averageTempMax: 35,
    averageTempMin: 24,
    typicalRainfallMm: 35,
    descriptionKh: 'ធាតុអាកាសក្តៅ មានពន្លឺថ្ងៃខ្លាំង អាចមានភ្លៀងកក់ខែខ្លះៗនៅចុងខែ។',
    descriptionEn: 'Hot and dry conditions, strong sunshine, occasional pre-monsoon mango showers.',
  },
  {
    month: 4,
    monthNameKh: 'មេសា',
    monthNameEn: 'April',
    seasonKh: 'រដូវប្រាំង (ក្តៅបំផុតប្រចាំឆ្នាំ - សង្ក្រាន្ត)',
    seasonEn: 'Peak Hot Season (Khmer New Year)',
    averageTempMax: 36,
    averageTempMin: 25,
    typicalRainfallMm: 80,
    descriptionKh: 'ខែក្តៅបំផុតក្នុងឆ្នាំ អាចឡើងដល់ ៣៨°C ទៅ ៤០°C អាចមានខ្យល់កន្ត្រាក់ផ្គររន្ទះ។',
    descriptionEn: 'Hottest month of the year in Cambodia, high humidity with afternoon thunderstorms.',
  },
  {
    month: 5,
    monthNameKh: 'ឧសភា',
    monthNameEn: 'May',
    seasonKh: 'ដើមរដូវវស្សា (ចាប់ផ្តើមមានភ្លៀងធ្លាក់)',
    seasonEn: 'Early Rainy Season (Southwest Monsoon)',
    averageTempMax: 34,
    averageTempMin: 25,
    typicalRainfallMm: 150,
    descriptionKh: 'របបខ្យល់មូសុងនិរតីចាប់ផ្តើមបក់ នាំមកនូវភ្លៀងធ្លាក់ញឹកញាប់ និងកាត់បន្ថយកម្តៅ។',
    descriptionEn: 'Onset of southwest monsoon brings frequent showers, relieving high temperatures.',
  },
  {
    month: 6,
    monthNameKh: 'មិថុនា',
    monthNameEn: 'June',
    seasonKh: 'រដូវវស្សា (ភ្លៀងធ្លាក់ញឹកញាប់)',
    seasonEn: 'Monsoon Rainy Season',
    averageTempMax: 33,
    averageTempMin: 25,
    typicalRainfallMm: 180,
    descriptionKh: 'មេឃមានពពកច្រើន ភ្លៀងធ្លាក់ជាប្រចាំនៅពេលរសៀល សំណើមអាកាសខ្ពស់។',
    descriptionEn: 'Overcast skies with regular afternoon monsoonal downpours and high humidity.',
  },
  {
    month: 7,
    monthNameKh: 'កក្កដា',
    monthNameEn: 'July',
    seasonKh: 'រដូវវស្សាពេញលេញ',
    seasonEn: 'Full Monsoon Season',
    averageTempMax: 32,
    averageTempMin: 24,
    typicalRainfallMm: 210,
    descriptionKh: 'ភ្លៀងធ្លាក់ស្ទើររៀងរាល់ថ្ងៃ បរិយាកាសត្រជាក់ស្រួល និងទេសភាពបៃតងស្រស់។',
    descriptionEn: 'Regular rain showers, lush tropical greenery, and cooler temperatures.',
  },
  {
    month: 8,
    monthNameKh: 'សីហា',
    monthNameEn: 'August',
    seasonKh: 'រដូវវស្សា (ភ្លៀងធ្លាក់ខ្លាំង)',
    seasonEn: 'Heavy Monsoon Season',
    averageTempMax: 32,
    averageTempMin: 24,
    typicalRainfallMm: 230,
    descriptionKh: 'ភ្លៀងធ្លាក់ច្រើន កម្រិតទឹកទន្លេមេគង្គនិងបឹងទន្លេសាបចាប់ផ្តើមកើនឡើង។',
    descriptionEn: 'Heavy rainfall across Cambodia, river levels and Tonle Sap lake rise significantly.',
  },
  {
    month: 9,
    monthNameKh: 'កញ្ញា',
    monthNameEn: 'September',
    seasonKh: 'រដូវវស្សា (កំពូលទឹកភ្លៀង - ភ្ជុំបិណ្ឌ)',
    seasonEn: 'Peak Monsoon Season (Pchum Ben)',
    averageTempMax: 31,
    averageTempMin: 24,
    typicalRainfallMm: 270,
    descriptionKh: 'ខែដែលមានទឹកភ្លៀងធ្លាក់ច្រើនបំផុតប្រចាំឆ្នាំ ត្រូវប្រុងប្រយ័ត្នបញ្ហាជំនន់ទឹកភ្លៀង។',
    descriptionEn: 'Wettest month of the year with peak precipitation and tropical low pressures.',
  },
  {
    month: 10,
    monthNameKh: 'តុលា',
    monthNameEn: 'October',
    seasonKh: 'ចុងរដូវវស្សា (អុំទូក / កឋិនទាន)',
    seasonEn: 'Late Monsoon / Transition Period',
    averageTempMax: 31,
    averageTempMin: 23,
    typicalRainfallMm: 250,
    descriptionKh: 'ភ្លៀងនៅតែបន្តធ្លាក់ មុនពេលខ្យល់មូសុងនិរតីចាប់ផ្តើមថមថយនៅចុងខែ។',
    descriptionEn: 'Rainfall begins to taper off towards late October as seasonal winds shift.',
  },
  {
    month: 11,
    monthNameKh: 'វិច្ឆិកា',
    monthNameEn: 'November',
    seasonKh: 'ដើមរដូវរំហើយ (មេឃស្រឡះ ខ្យល់ធ្លាក់)',
    seasonEn: 'Start of Cool Dry Season (Water Festival)',
    averageTempMax: 30,
    averageTempMin: 22,
    typicalRainfallMm: 80,
    descriptionKh: 'ខ្យល់ជំនោររំហើយចាប់ផ្តើមធ្លាក់ មេឃស្រឡះ ធាតុអាកាសត្រជាក់គួរជាទីរីករាយ។',
    descriptionEn: 'Monsoon ends, welcoming pleasant breezes, clear skies and the Water Festival.',
  },
  {
    month: 12,
    monthNameKh: 'ធ្នូ',
    monthNameEn: 'December',
    seasonKh: 'រដូវរំហើយ (ត្រជាក់បំផុតប្រចាំឆ្នាំ)',
    seasonEn: 'Peak Cool & Dry Season',
    averageTempMax: 30,
    averageTempMin: 20,
    typicalRainfallMm: 20,
    descriptionKh: 'ធាតុអាកាសត្រជាក់បំផុតក្នុងឆ្នាំ ពេលយប់និងព្រឹកព្រលឹមអាចធ្លាក់ចុះដល់ ១៨°C - ២០°C។',
    descriptionEn: 'Coolest month of the year with crisp mornings and comfortable sunny days.',
  },
];

export interface FullWeatherData {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  fetchedAt: number; // Date.now()
  isFromCache?: boolean;
}

const WEATHER_CACHE_KEY = 'khmer_calendar_weather_cache_v1';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache for real weather

class WeatherService {
  private inMemoryCache: Map<string, FullWeatherData> = new Map();

  /**
   * Fetch real weather data from Open-Meteo
   */
  async getForecast(location: WeatherLocation = DEFAULT_LOCATION, forceRefresh = false): Promise<FullWeatherData> {
    const cacheKey = `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`;

    if (!forceRefresh) {
      // Check in-memory
      const mem = this.inMemoryCache.get(cacheKey);
      if (mem && Date.now() - mem.fetchedAt < CACHE_TTL_MS) {
        return mem;
      }

      // Check localStorage
      const local = this.getFromLocalStorage(cacheKey);
      if (local && Date.now() - local.fetchedAt < CACHE_TTL_MS) {
        this.inMemoryCache.set(cacheKey, local);
        return local;
      }
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset&timezone=Asia%2FBangkok&forecast_days=7`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Open-Meteo API responded with status ${res.status}`);
      }

      const json = await res.json();

      const currentCondition = getWeatherCondition(json.current.weather_code);
      const current: CurrentWeather = {
        time: json.current.time,
        temperature: Math.round(json.current.temperature_2m),
        apparentTemperature: Math.round(json.current.apparent_temperature),
        relativeHumidity: json.current.relative_humidity_2m,
        precipitation: json.current.precipitation,
        weatherCode: json.current.weather_code,
        windSpeed: Math.round(json.current.wind_speed_10m),
        windDirection: json.current.wind_direction_10m,
        condition: currentCondition,
      };

      // Extract next 24 hours
      const nowIso = new Date().toISOString();
      const currentHourIso = nowIso.slice(0, 13);
      const hourlyTimes: string[] = json.hourly.time || [];
      const hourlyTemps: number[] = json.hourly.temperature_2m || [];
      const hourlyPrecipProb: number[] = json.hourly.precipitation_probability || [];
      const hourlyCodes: number[] = json.hourly.weather_code || [];

      let startIndex = hourlyTimes.findIndex((t) => t >= currentHourIso);
      if (startIndex < 0) startIndex = 0;

      const hourly: HourlyForecastItem[] = [];
      const maxHours = Math.min(hourlyTimes.length, startIndex + 24);

      for (let i = startIndex; i < maxHours; i++) {
        const timeStr = hourlyTimes[i];
        const hourPart = timeStr.includes('T') ? timeStr.split('T')[1] : timeStr;
        const code = hourlyCodes[i] ?? 0;
        hourly.push({
          time: timeStr,
          hourLabel: hourPart,
          temperature: Math.round(hourlyTemps[i] ?? 0),
          precipitationProbability: hourlyPrecipProb[i] ?? 0,
          weatherCode: code,
          condition: getWeatherCondition(code),
        });
      }

      // Extract 7-day daily forecast
      const dailyTimes: string[] = json.daily.time || [];
      const dailyCodes: number[] = json.daily.weather_code || [];
      const dailyMax: number[] = json.daily.temperature_2m_max || [];
      const dailyMin: number[] = json.daily.temperature_2m_min || [];
      const dailyPrecipProb: number[] = json.daily.precipitation_probability_max || [];
      const dailyPrecipSum: number[] = json.daily.precipitation_sum || [];
      const dailySunrise: string[] = json.daily.sunrise || [];
      const dailySunset: string[] = json.daily.sunset || [];

      const dayNamesKh = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
      const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const daily: DailyForecastItem[] = [];
      for (let i = 0; i < dailyTimes.length; i++) {
        const dateStr = dailyTimes[i];
        const d = new Date(dateStr + 'T00:00:00');
        const dayIdx = d.getDay();
        const code = dailyCodes[i] ?? 0;

        daily.push({
          date: dateStr,
          dayLabelKh: i === 0 ? 'ថ្ងៃនេះ' : i === 1 ? 'ថ្ងៃស្អែក' : `ថ្ងៃ${dayNamesKh[dayIdx]}`,
          dayLabelEn: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNamesEn[dayIdx],
          weatherCode: code,
          tempMax: Math.round(dailyMax[i] ?? 0),
          tempMin: Math.round(dailyMin[i] ?? 0),
          precipitationProbabilityMax: dailyPrecipProb[i] ?? 0,
          precipitationSum: Number((dailyPrecipSum[i] ?? 0).toFixed(1)),
          sunrise: dailySunrise[i] ? dailySunrise[i].split('T')[1] : '05:55',
          sunset: dailySunset[i] ? dailySunset[i].split('T')[1] : '17:45',
          condition: getWeatherCondition(code),
        });
      }

      const fullData: FullWeatherData = {
        location,
        current,
        hourly,
        daily,
        fetchedAt: Date.now(),
        isFromCache: false,
      };

      this.inMemoryCache.set(cacheKey, fullData);
      this.saveToLocalStorage(cacheKey, fullData);

      return fullData;
    } catch (err) {
      console.warn('Weather fetch failed, attempting cached fallback:', err);
      const stale = this.getFromLocalStorage(cacheKey);
      if (stale) {
        return {
          ...stale,
          isFromCache: true,
        };
      }
      throw err;
    }
  }

  /**
   * Search locations using Open-Meteo Geocoding
   */
  async searchLocations(query: string): Promise<WeatherLocation[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) return [];

      const json = await res.json();
      if (!json.results || !Array.isArray(json.results)) return [];

      return json.results.map((r: any) => ({
        id: String(r.id),
        nameKh: r.name,
        nameEn: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        provinceKh: r.admin1 || r.country,
        provinceEn: r.admin1 || r.country,
      }));
    } catch (err) {
      console.warn('Location search error:', err);
      return [];
    }
  }

  private getFromLocalStorage(cacheKey: string): FullWeatherData | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(`${WEATHER_CACHE_KEY}_${cacheKey}`);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  private saveToLocalStorage(cacheKey: string, data: FullWeatherData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${WEATHER_CACHE_KEY}_${cacheKey}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save weather to localStorage', e);
    }
  }
}

export const weatherService = new WeatherService();
