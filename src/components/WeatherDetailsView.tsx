/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  weatherService,
  FullWeatherData,
  DEFAULT_LOCATION,
  POPULAR_CAMBODIA_LOCATIONS,
  WeatherLocation,
  CAMBODIA_MONTHLY_CLIMATE,
  MonthlyClimateItem,
} from '../services/weatherService.ts';
import { WeatherIcon } from './WeatherIcon.tsx';
import {
  ArrowLeft,
  MapPin,
  RefreshCw,
  Droplets,
  Wind,
  Sunrise,
  Sunset,
  Thermometer,
  Calendar,
  Compass,
  AlertCircle,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { toKhmerNumerals } from '../calendar/khmerDateAdapter.ts';
import { TemperatureUnit } from '../storage/settingsStore.ts';

interface WeatherDetailsViewProps {
  onBack: () => void;
  selectedLocationId: string;
  onSelectLocationId: (id: string) => void;
  temperatureUnit: TemperatureUnit;
  onToggleTempUnit: (unit: TemperatureUnit) => void;
  useKhmerNumerals: boolean;
  lang: 'km' | 'en';
}

export const WeatherDetailsView: React.FC<WeatherDetailsViewProps> = ({
  onBack,
  selectedLocationId,
  onSelectLocationId,
  temperatureUnit,
  onToggleTempUnit,
  useKhmerNumerals,
  lang,
}) => {
  const [currentLocation, setCurrentLocation] = useState<WeatherLocation>(() => {
    return POPULAR_CAMBODIA_LOCATIONS.find((l) => l.id === selectedLocationId) || DEFAULT_LOCATION;
  });

  const [weatherData, setWeatherData] = useState<FullWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search & custom location state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // 12-month climate overview sequential navigation
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(() => new Date().getMonth());

  const num = (v: number | string) => (useKhmerNumerals ? toKhmerNumerals(v) : String(v));

  const formatTemp = (celsius: number) => {
    if (temperatureUnit === 'fahrenheit') {
      const f = Math.round((celsius * 9) / 5 + 32);
      return `${num(f)}°F`;
    }
    return `${num(celsius)}°C`;
  };

  const loadWeather = async (loc = currentLocation, force = false) => {
    try {
      if (force) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await weatherService.getForecast(loc, force);
      setWeatherData(data);
    } catch (err: any) {
      setError(err?.message || 'Could not load weather');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loc = POPULAR_CAMBODIA_LOCATIONS.find((l) => l.id === selectedLocationId) || DEFAULT_LOCATION;
    setCurrentLocation(loc);
    loadWeather(loc);
  }, [selectedLocationId]);

  const handleSelectLocation = (loc: WeatherLocation) => {
    setCurrentLocation(loc);
    onSelectLocationId(loc.id);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    loadWeather(loc, true);
  };

  // Geolocation trigger
  const handleUseDeviceLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'km' ? 'ឧបករណ៍របស់អ្នកមិនគាំទ្រ Geolocation ទេ' : 'Geolocation is not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const deviceLoc: WeatherLocation = {
          id: `gps-${pos.coords.latitude.toFixed(2)}-${pos.coords.longitude.toFixed(2)}`,
          nameKh: 'ទីតាំងបច្ចុប្បន្នរបស់អ្នក (GPS)',
          nameEn: 'Your Current Location (GPS)',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          provinceKh: 'កម្ពុជា',
          provinceEn: 'Cambodia',
        };
        handleSelectLocation(deviceLoc);
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        alert(
          lang === 'km'
            ? 'មិនអាចកំណត់ទីតាំងបានទេ។ កម្មវិធីនឹងប្រើរាជធានីភ្នំពេញជាលំនាំដើម។'
            : 'Could not access location. Defaulting to Phnom Penh.'
        );
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Search input handler
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await weatherService.searchLocations(searchQuery);
      setSearchResults(res);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const currentMonthClimate: MonthlyClimateItem = CAMBODIA_MONTHLY_CLIMATE[selectedMonthIdx];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#18181b] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition active:scale-95"
            aria-label={lang === 'km' ? 'ត្រឡប់ក្រោយ' : 'Go back'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {lang === 'km' ? 'ការព្យាករណ៍អាកាសធាតុ' : 'Weather Forecast'}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {lang === 'km' ? 'ទិន្នន័យជាក់ស្តែងពី Open-Meteo' : 'Real-time data via Open-Meteo'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Toggle */}
          <div className="flex items-center rounded-xl bg-stone-100 dark:bg-stone-800 p-1 border border-stone-200 dark:border-stone-700 text-xs font-semibold">
            <button
              onClick={() => onToggleTempUnit('celsius')}
              className={`px-2.5 py-1 rounded-lg transition ${
                temperatureUnit === 'celsius'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onToggleTempUnit('fahrenheit')}
              className={`px-2.5 py-1 rounded-lg transition ${
                temperatureUnit === 'fahrenheit'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => loadWeather(currentLocation, true)}
            disabled={refreshing || loading}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300 hover:text-amber-800 transition disabled:opacity-50"
            title={lang === 'km' ? 'ផ្ទុកទិន្នន័យឡើងវិញ' : 'Refresh Weather'}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-amber-600' : ''}`} />
          </button>

          {/* Change Location Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-800 hover:bg-red-900 text-white text-xs font-semibold shadow-xs transition active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">
              {lang === 'km' ? 'ប្តូរទីតាំង' : 'Change Location'}
            </span>
            <span className="sm:hidden">{lang === 'km' ? 'ទីតាំង' : 'Location'}</span>
          </button>
        </div>
      </div>

      {/* Location Search Dialog / Sheet */}
      {isSearchOpen && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18181b] border border-amber-300/40 dark:border-amber-700/40 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {lang === 'km' ? 'ជ្រើសរើសទីតាំងនៅកម្ពុជា' : 'Select Location in Cambodia'}
            </h3>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-stone-400 hover:text-stone-600 text-xs px-2 py-1 rounded-md"
            >
              {lang === 'km' ? 'បិទ' : 'Close'}
            </button>
          </div>

          {/* GPS Quick Button */}
          <button
            onClick={handleUseDeviceLocation}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-xs font-semibold hover:bg-amber-100 transition"
          >
            <Compass className="w-4 h-4 text-amber-600" />
            <span>{lang === 'km' ? 'ប្រើប្រាស់ទីតាំង GPS របស់ឧបករណ៍' : 'Use Current GPS Location'}</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder={lang === 'km' ? 'ស្វែងរកទីក្រុង / ខេត្ត (ឧ. Phnom Penh, Siem Reap)...' : 'Search city or district...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Search results if any */}
          {searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 rounded-xl border border-stone-200 dark:border-stone-800">
              {searchResults.map((r) => (
                <button
                  key={`${r.latitude}-${r.longitude}`}
                  onClick={() => handleSelectLocation(r)}
                  className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition"
                >
                  <span className="font-medium">{r.nameEn}</span>
                  <span className="text-[10px] text-stone-400">{r.provinceEn}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Cambodia Provinces list */}
          <div className="pt-2">
            <p className="text-[11px] font-semibold text-stone-500 mb-2">
              {lang === 'km' ? 'រាជធានី និងខេត្តពេញនិយម' : 'Popular Cambodian Provinces'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_CAMBODIA_LOCATIONS.map((loc) => {
                const isSelected = loc.id === currentLocation.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border text-left transition ${
                      isSelected
                        ? 'bg-red-800 text-white border-red-900 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-amber-400/50'
                    }`}
                  >
                    <span className="truncate">{lang === 'km' ? loc.nameKh : loc.nameEn}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Offline Alert if loaded from cache */}
      {weatherData?.isFromCache && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs">
          <Info className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            {lang === 'km'
              ? 'កំពុងបង្ហាញទិន្នន័យក្រៅបណ្តាញដែលបានរក្សាទុកពីមុន (Offline Cached Data)'
              : 'Displaying previously cached weather data (Offline mode)'}
          </span>
        </div>
      )}

      {/* Error state */}
      {error && !weatherData && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
            {lang === 'km' ? 'មិនអាចទាញយកទិន្នន័យអាកាសធាតុបានទេ' : 'Unable to Load Weather Data'}
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300">{error}</p>
          <button
            onClick={() => loadWeather(currentLocation, true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
          >
            {lang === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try Again'}
          </button>
        </div>
      )}

      {/* SECTION A: Current Weather Hero Card */}
      {weatherData && (
        <section
          aria-label="Current Weather"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-800 via-red-900 to-[#420a0a] text-white shadow-xl shadow-red-950/20 border border-red-700/50 p-6 sm:p-8"
        >
          {/* Subtle background glow */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

          {/* Location & Time info */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-1.5 text-amber-200">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span className="font-bold text-sm sm:text-base">
                {lang === 'km' ? currentLocation.nameKh : currentLocation.nameEn}
              </span>
              <span className="text-xs text-white/70">
                ({currentLocation.latitude.toFixed(2)}°, {currentLocation.longitude.toFixed(2)}°)
              </span>
            </div>

            <div className="text-xs text-amber-200/80 font-medium">
              {lang === 'km' ? 'ធ្វើបច្ចុប្បន្នភាព៖ ' : 'Updated: '}
              {new Date(weatherData.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Main Temp & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6 flex items-center gap-5">
              <div className="p-4 rounded-3xl bg-black/25 backdrop-blur-md border border-white/10 shrink-0">
                <WeatherIcon condition={weatherData.current.condition} className="w-14 h-14 sm:w-16 sm:h-16" />
              </div>
              <div>
                <div className="text-5xl sm:text-6xl font-bold font-sans tracking-tight text-white">
                  {formatTemp(weatherData.current.temperature)}
                </div>
                <div className="text-lg font-bold text-amber-200 mt-1">
                  {lang === 'km'
                    ? weatherData.current.condition.labelKh
                    : weatherData.current.condition.labelEn}
                </div>
                <div className="text-xs text-white/80">
                  {lang === 'km' ? 'សីតុណ្ហភាពដឹងជាក់ស្តែង៖ ' : 'Feels like: '}
                  <span className="font-semibold text-white">
                    {formatTemp(weatherData.current.apparentTemperature)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* High / Low */}
              <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/10">
                <div className="flex items-center gap-1 text-[11px] text-amber-200/90 mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'km' ? 'ខ្ពស់ / ទាប' : 'Max / Min'}</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {formatTemp(weatherData.daily[0]?.tempMax ?? weatherData.current.temperature)} /{' '}
                  <span className="text-white/70 font-normal">
                    {formatTemp(weatherData.daily[0]?.tempMin ?? weatherData.current.temperature)}
                  </span>
                </div>
              </div>

              {/* Humidity */}
              <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/10">
                <div className="flex items-center gap-1 text-[11px] text-amber-200/90 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-300" />
                  <span>{lang === 'km' ? 'សំណើម' : 'Humidity'}</span>
                </div>
                <div className="text-sm font-bold text-white font-sans">
                  {num(weatherData.current.relativeHumidity)}%
                </div>
              </div>

              {/* Wind */}
              <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/10">
                <div className="flex items-center gap-1 text-[11px] text-amber-200/90 mb-1">
                  <Wind className="w-3.5 h-3.5 text-teal-300" />
                  <span>{lang === 'km' ? 'ខ្យល់បក់' : 'Wind'}</span>
                </div>
                <div className="text-sm font-bold text-white font-sans">
                  {num(weatherData.current.windSpeed)} km/h
                </div>
              </div>

              {/* Sun Cycle */}
              <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/10">
                <div className="flex items-center gap-1 text-[11px] text-amber-200/90 mb-1">
                  <Sunrise className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'km' ? 'រះ / លិច' : 'Sun'}</span>
                </div>
                <div className="text-xs font-semibold text-white">
                  {weatherData.daily[0]?.sunrise || '05:55'}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION B: Today's Hourly Forecast (24 Hours) */}
      {weatherData && weatherData.hourly.length > 0 && (
        <section
          aria-label="Hourly Forecast"
          className="rounded-3xl bg-white dark:bg-[#18181b] border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-800 dark:text-red-400" />
              <span>{lang === 'km' ? 'ការព្យាករណ៍រៀងរាល់ម៉ោង (២៤ ម៉ោងបន្ទាប់)' : 'Hourly Forecast (Next 24h)'}</span>
            </h2>
            <span className="text-xs text-stone-500">
              {lang === 'km' ? 'ទិន្នន័យជាក់ស្តែង' : 'Real-time API'}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {weatherData.hourly.map((h, i) => (
              <div
                key={h.time}
                className="flex flex-col items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 min-w-[78px] shrink-0 text-center space-y-1.5 hover:border-amber-400/40 transition"
              >
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                  {i === 0 ? (lang === 'km' ? 'ឥឡូវនេះ' : 'Now') : h.hourLabel}
                </span>

                <div className="my-1">
                  <WeatherIcon condition={h.condition} className="w-6 h-6" />
                </div>

                <span className="text-sm font-bold text-stone-900 dark:text-stone-100 font-sans">
                  {formatTemp(h.temperature)}
                </span>

                {h.precipitationProbability > 0 ? (
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-0.5">
                    <Droplets className="w-2.5 h-2.5" />
                    {num(h.precipitationProbability)}%
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-400">&mdash;</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION C: 7-Day Daily Forecast */}
      {weatherData && weatherData.daily.length > 0 && (
        <section
          aria-label="Daily Forecast"
          className="rounded-3xl bg-white dark:bg-[#18181b] border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {lang === 'km' ? 'ការព្យាករណ៍ ៧ ថ្ងៃខាងមុខ' : '7-Day Weather Forecast'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-medium">
              Open-Meteo API
            </span>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800/80">
            {weatherData.daily.map((d) => (
              <div
                key={d.date}
                className="py-3 sm:py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
              >
                {/* Date & Weekday */}
                <div className="w-28 sm:w-36 shrink-0">
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    {lang === 'km' ? d.dayLabelKh : d.dayLabelEn}
                  </div>
                  <div className="text-[11px] text-stone-500">{d.date}</div>
                </div>

                {/* Condition Icon & Text */}
                <div className="flex items-center gap-2 flex-1 justify-center sm:justify-start">
                  <WeatherIcon condition={d.condition} className="w-5 h-5 shrink-0" />
                  <span className="text-stone-700 dark:text-stone-300 font-medium truncate hidden sm:inline">
                    {lang === 'km' ? d.condition.labelKh : d.condition.labelEn}
                  </span>
                </div>

                {/* Rain probability */}
                <div className="w-16 text-center text-xs text-sky-600 dark:text-sky-400 font-semibold shrink-0">
                  {d.precipitationProbabilityMax > 0 ? (
                    <span className="inline-flex items-center gap-0.5">
                      <Droplets className="w-3 h-3" />
                      {num(d.precipitationProbabilityMax)}%
                    </span>
                  ) : (
                    <span className="text-stone-400 text-[11px]">0%</span>
                  )}
                </div>

                {/* Min / Max Temp Bar */}
                <div className="w-28 sm:w-36 text-right shrink-0">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {formatTemp(d.tempMax)}
                  </span>{' '}
                  <span className="text-stone-500 font-normal">/ {formatTemp(d.tempMin)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION D: Twelve-Month Climatological Overview */}
      <section
        aria-label="12-Month Climatological Overview"
        className="rounded-3xl bg-white dark:bg-[#18181b] border border-amber-300/40 dark:border-amber-800/40 p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>{lang === 'km' ? 'ទិដ្ឋភាពអាកាសធាតុប្រចាំ ១២ ខែនៅកម្ពុជា' : '12-Month Climate Overview'}</span>
            </h2>
            <p className="text-xs text-amber-800/80 dark:text-amber-400/80">
              {lang === 'km'
                ? 'ទិន្នន័យមធ្យមភាគអាកាសធាតុប្រវត្តិសាស្ត្រ (Historical Climate Normals WMO 1991–2020)'
                : 'Historical Climatological Averages (WMO Climate Normals 1991–2020)'}
            </p>
          </div>

          {/* Sequential Month Navigator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMonthIdx((prev) => (prev > 0 ? prev - 1 : 11))}
              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 transition"
              aria-label={lang === 'km' ? 'ខែមុន' : 'Previous month'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-2 text-stone-900 dark:text-stone-100 min-w-[70px] text-center">
              {lang === 'km' ? currentMonthClimate.monthNameKh : currentMonthClimate.monthNameEn}
            </span>
            <button
              onClick={() => setSelectedMonthIdx((prev) => (prev < 11 ? prev + 1 : 0))}
              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 transition"
              aria-label={lang === 'km' ? 'ខែបន្ទាប់' : 'Next month'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 12-Month Quick Selector Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {CAMBODIA_MONTHLY_CLIMATE.map((m, idx) => (
            <button
              key={m.month}
              onClick={() => setSelectedMonthIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedMonthIdx === idx
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {lang === 'km' ? m.monthNameKh : m.monthNameEn.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Selected Month Climate Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                {lang === 'km' ? 'ខែទី' : 'Month'}{' '}
                {num(currentMonthClimate.month)} :{' '}
                {lang === 'km' ? currentMonthClimate.monthNameKh : currentMonthClimate.monthNameEn}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {lang === 'km' ? currentMonthClimate.seasonKh : currentMonthClimate.seasonEn}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Temp range */}
              <div className="text-right">
                <div className="text-xs text-stone-500">{lang === 'km' ? 'សីតុណ្ហភាពមធ្យម' : 'Avg Temp'}</div>
                <div className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  {formatTemp(currentMonthClimate.averageTempMin)} &ndash;{' '}
                  {formatTemp(currentMonthClimate.averageTempMax)}
                </div>
              </div>

              {/* Rain */}
              <div className="text-right">
                <div className="text-xs text-stone-500">{lang === 'km' ? 'កម្រិតទឹកភ្លៀង' : 'Rainfall'}</div>
                <div className="text-sm font-bold text-sky-600 dark:text-sky-400 font-sans">
                  ~{num(currentMonthClimate.typicalRainfallMm)} mm
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300">
            {lang === 'km' ? currentMonthClimate.descriptionKh : currentMonthClimate.descriptionEn}
          </p>

          <div className="pt-2 border-t border-amber-200/40 dark:border-amber-800/30 flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              {lang === 'km'
                ? 'សម្គាល់៖ ទិន្នន័យ ១២ ខែនេះជាកម្រិតមធ្យមស្ថិតិប្រវត្តិសាស្ត្រ ពុំមែនជាការព្យាករណ៍ប្រចាំថ្ងៃជាក់ស្តែងឡើយ។'
                : 'Note: 12-month data represents climatological historical averages, not daily future forecasts.'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
