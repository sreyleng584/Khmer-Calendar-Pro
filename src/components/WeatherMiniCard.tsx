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
} from '../services/weatherService.ts';
import { WeatherIcon } from './WeatherIcon.tsx';
import { MapPin, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { toKhmerNumerals } from '../calendar/khmerDateAdapter.ts';

interface WeatherMiniCardProps {
  onOpenWeatherDetails: () => void;
  selectedLocationId?: string;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  useKhmerNumerals?: boolean;
  lang?: 'km' | 'en';
}

export const WeatherMiniCard: React.FC<WeatherMiniCardProps> = ({
  onOpenWeatherDetails,
  selectedLocationId = 'phnom-penh',
  temperatureUnit = 'celsius',
  useKhmerNumerals = true,
  lang = 'km',
}) => {
  const [weatherData, setWeatherData] = useState<FullWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location: WeatherLocation =
    POPULAR_CAMBODIA_LOCATIONS.find((l) => l.id === selectedLocationId) || DEFAULT_LOCATION;

  const fetchWeather = async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getForecast(location, force);
      setWeatherData(data);
    } catch (err: any) {
      console.warn('WeatherMiniCard fetch error:', err);
      setError(err?.message || 'Unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location.id]);

  const num = (v: number | string) => (useKhmerNumerals ? toKhmerNumerals(v) : String(v));

  const formatTemp = (celsius: number) => {
    if (temperatureUnit === 'fahrenheit') {
      const f = Math.round((celsius * 9) / 5 + 32);
      return `${num(f)}°F`;
    }
    return `${num(celsius)}°C`;
  };

  return (
    <div
      onClick={onOpenWeatherDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenWeatherDetails();
        }
      }}
      aria-label={lang === 'km' ? 'ព័ត៌មានអាកាសធាតុ ពិនិត្យលម្អិត' : 'Weather information, view details'}
      className="group relative cursor-pointer select-none rounded-2xl bg-black/25 hover:bg-black/35 backdrop-blur-md border border-white/10 hover:border-amber-400/40 p-3 sm:p-3.5 transition-all duration-200 active:scale-[0.98] shadow-xs"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Icon & Temperature */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
            {loading && !weatherData ? (
              <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
            ) : error && !weatherData ? (
              <AlertCircle className="w-4 h-4 text-rose-300" />
            ) : (
              <WeatherIcon condition={weatherData?.current.condition} className="w-5 h-5" />
            )}
          </div>

          <div>
            {loading && !weatherData ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/60 animate-pulse">
                  {lang === 'km' ? 'កំពុងទាញយក...' : 'Loading...'}
                </span>
              </div>
            ) : error && !weatherData ? (
              <div className="flex items-center gap-1 text-xs text-rose-200">
                <span>{lang === 'km' ? 'មិនមានទិន្នន័យ' : 'Unavailable'}</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight">
                  {formatTemp(weatherData!.current.temperature)}
                </span>
                <span className="text-[11px] text-amber-200/90 font-medium hidden xs:inline">
                  {lang === 'km'
                    ? weatherData!.current.condition.labelKh
                    : weatherData!.current.condition.labelEn}
                </span>
              </div>
            )}

            {/* Small status or condition for xs screen */}
            {weatherData && (
              <div className="text-[10px] text-stone-300 xs:hidden">
                {lang === 'km'
                  ? weatherData.current.condition.labelKh
                  : weatherData.current.condition.labelEn}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Location Name & Hint */}
        <div className="text-right flex flex-col items-end justify-center min-w-0">
          <div className="flex items-center gap-1 text-amber-200 font-semibold text-xs truncate max-w-[150px] sm:max-w-[200px]">
            <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
            <span className="truncate">
              {lang === 'km' ? location.nameKh : location.nameEn}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-white/60 group-hover:text-amber-200/80 transition-colors">
            <span>{lang === 'km' ? 'ពិនិត្យលម្អិត' : 'View Forecast'}</span>
            <span className="text-amber-300 font-bold">&rarr;</span>
          </div>
        </div>
      </div>

      {weatherData?.isFromCache && (
        <div className="mt-1.5 text-[9px] text-amber-300/70 text-right">
          {lang === 'km' ? '• ទិន្នន័យក្រៅបណ្តាញ' : '• Cached Offline'}
        </div>
      )}
    </div>
  );
};
