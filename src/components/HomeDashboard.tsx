/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  KhmerDateResult,
  toKhmerNumerals,
} from '../calendar/khmerDateAdapter.ts';
import { HolidayItem } from '../data/holidays.ts';
import { UserEvent } from '../storage/eventsStore.ts';
import {
  Calendar,
  Share2,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { WeatherMiniCard } from './WeatherMiniCard.tsx';
import { TemperatureUnit } from '../storage/settingsStore.ts';

interface HomeDashboardProps {
  todayKhmerDate: KhmerDateResult;
  todayHolidays: HolidayItem[];
  upcomingEvents: UserEvent[];
  upcomingHolidays: HolidayItem[];
  onOpenCalendar: () => void;
  onOpenHolidays: () => void;
  onOpenAddEvent: (dateStr?: string) => void;
  onSelectDate: (dateStr: string) => void;
  onOpenShare: (dateResult: KhmerDateResult) => void;
  onOpenNewYear: () => void;
  onOpenWeather?: () => void;
  selectedLocationId?: string;
  temperatureUnit?: TemperatureUnit;
  onToggleEventComplete: (id: string) => void;
  useKhmerNumerals: boolean;
  lang: 'km' | 'en';
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  todayKhmerDate,
  todayHolidays,
  upcomingEvents,
  upcomingHolidays,
  onOpenCalendar,
  onOpenHolidays,
  onOpenAddEvent,
  onSelectDate,
  onOpenShare,
  onOpenNewYear,
  onOpenWeather,
  selectedLocationId,
  temperatureUnit,
  onToggleEventComplete,
  useKhmerNumerals,
  lang,
}) => {
  const g = todayKhmerDate.gregorian;
  const kh = todayKhmerDate.khmer;

  const num = (val: number | string) => (useKhmerNumerals ? toKhmerNumerals(val) : String(val));
  const todayStr = `${g.year}-${String(g.month).padStart(2, '0')}-${String(g.day).padStart(2, '0')}`;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Hero Today Card */}
      <section
        aria-label="Today Card"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-800 via-red-900 to-[#420a0a] text-white shadow-xl shadow-red-950/20 border border-red-700/50 p-6 sm:p-8"
      >
        {/* Background Mandala / Watermark */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full border border-amber-400/20 opacity-30 pointer-events-none" />
        <div className="absolute -right-6 -top-6 w-52 h-52 rounded-full border border-amber-400/20 opacity-40 pointer-events-none" />
        <div className="absolute right-10 top-10 text-8xl opacity-10 select-none pointer-events-none">
          {kh.animalEmoji}
        </div>

        {/* Top Badges */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-semibold backdrop-blur-xs">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'km' ? 'ថ្ងៃនេះ' : 'Today'}</span>
            </span>

            {kh.isBuddhistHolyDay && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-xs">
                🙏 {lang === 'km' ? 'ថ្ងៃសីល' : 'Holy Day'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-amber-200/80 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'km' ? 'ក្បួនគណនាផ្ទៀងផ្ទាត់' : 'Verified Logic'}</span>
          </div>
        </div>

        {/* Date Display Body */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Big Solar Day & Weekday */}
          <div className="md:col-span-5 flex items-baseline gap-4">
            <span className="text-6xl sm:text-7xl font-bold tracking-tight text-white font-sans">
              {num(g.day)}
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-200 tracking-tight">
                {lang === 'km' ? g.dayOfWeekNameKh : g.dayOfWeekNameEn}
              </h2>
              <p className="text-white/80 text-sm font-medium">
                {lang === 'km'
                  ? `ខែ${num(g.month)} ឆ្នាំ${num(g.year)}`
                  : `${g.year}-${String(g.month).padStart(2, '0')}`}
              </p>
            </div>
          </div>

          {/* Right Column: Lunar Card Details */}
          <div className="md:col-span-7 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-300 font-bold text-lg sm:text-xl">
                {kh.lunarDayStringKh} ខែ{kh.monthNameKh}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/90">
                {kh.monthNameEn}
              </span>
            </div>

            <div className="text-sm text-stone-200 flex flex-wrap gap-x-4 gap-y-1">
              <span>
                {lang === 'km' ? 'ឆ្នាំ' : 'Year:'}{' '}
                <strong className="text-white">
                  {kh.animalYearNameKh} {kh.animalEmoji}
                </strong>
              </span>
              <span>
                <strong className="text-white">{kh.sakNameKh}</strong>
              </span>
              <span>
                {lang === 'km' ? 'ព.ស.' : 'B.E.'}{' '}
                <strong className="text-amber-200">{num(kh.beYear)}</strong>
              </span>
            </div>

            {/* Today Holidays badge if any */}
            {todayHolidays.length > 0 && (
              <div className="pt-2 border-t border-white/10 flex items-start gap-2 text-rose-200 text-xs">
                <span className="px-2 py-0.5 rounded bg-rose-500/30 font-semibold border border-rose-400/30 shrink-0">
                  {lang === 'km' ? 'ឈប់សម្រាក' : 'Holiday'}
                </span>
                <span className="font-medium">{todayHolidays.map((h) => h.nameKh).join(', ')}</span>
              </div>
            )}

            {/* Weather Mini Card - Designated in home card */}
            {onOpenWeather && (
              <div className="pt-2 border-t border-white/10">
                <WeatherMiniCard
                  onOpenWeatherDetails={onOpenWeather}
                  selectedLocationId={selectedLocationId}
                  temperatureUnit={temperatureUnit}
                  useKhmerNumerals={useKhmerNumerals}
                  lang={lang}
                />
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Footer */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenCalendar}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-red-950 hover:bg-amber-100 text-xs font-semibold shadow-md transition active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-red-800" />
              <span>{lang === 'km' ? 'មើលប្រតិទិនខែ' : 'View Month'}</span>
            </button>

            <button
              onClick={() => onOpenAddEvent(todayStr)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium border border-white/20 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'បន្ថែមការកត់ត្រា' : 'Add Event'}</span>
            </button>

            <button
              onClick={() => onOpenShare(todayKhmerDate)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium border border-white/20 transition active:scale-95"
              title={lang === 'km' ? 'ចែករំលែក ឬទាញយករូបភាពថ្ងៃនេះ' : 'Share or download card'}
            >
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'km' ? 'ចែករំលែក' : 'Share'}</span>
            </button>
          </div>

          <button
            onClick={onOpenNewYear}
            className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 underline-offset-4 hover:underline transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ពិនិត្យរាសី & មហាសង្ក្រាន្ត' : 'Moha Sangkran Info'}</span>
          </button>
        </div>
      </section>

      {/* Grid: Upcoming Holidays & User Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Upcoming Holidays & Observances */}
        <section
          aria-label="Upcoming Holidays"
          className="rounded-2xl bg-white dark:bg-[#18181b] border border-stone-200/90 dark:border-stone-800 p-5 shadow-xs"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {lang === 'km' ? 'ពិធីបុណ្យបន្ទាប់' : 'Upcoming Holidays'}
              </h3>
            </div>
            <button
              onClick={onOpenHolidays}
              className="text-xs text-red-700 dark:text-red-400 hover:underline flex items-center gap-0.5"
            >
              <span>{lang === 'km' ? 'ទាំងអស់' : 'See all'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {upcomingHolidays.length === 0 ? (
            <p className="text-xs text-stone-500 py-4 text-center">
              {lang === 'km' ? 'គ្មានពិធីបុណ្យក្នុងពេលឆាប់ៗនេះទេ' : 'No upcoming holidays'}
            </p>
          ) : (
            <div className="space-y-2.5">
              {upcomingHolidays.slice(0, 4).map((h) => (
                <div
                  key={h.id}
                  onClick={() => onSelectDate(h.startDate)}
                  className="group flex items-start justify-between gap-3 p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer border border-transparent hover:border-stone-200/60 dark:hover:border-stone-700/60 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition">
                        {h.nameKh}
                      </span>
                      {h.isPublicHoliday && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-medium">
                          {lang === 'km' ? 'ឈប់សម្រាក' : 'Holiday'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {h.nameEn} • {h.lunarDateKh || h.startDate}
                    </p>
                  </div>

                  <span className="text-xs font-medium text-stone-600 dark:text-stone-300 shrink-0 font-sans">
                    {h.startDate.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User Reminders & Tasks */}
        <section
          aria-label="Upcoming Events"
          className="rounded-2xl bg-white dark:bg-[#18181b] border border-stone-200/90 dark:border-stone-800 p-5 shadow-xs"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {lang === 'km' ? 'កិច្ចការ & ការរំលឹក' : 'My Events & Reminders'}
              </h3>
            </div>
            <button
              onClick={() => onOpenAddEvent()}
              className="text-xs text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              <span>{lang === 'km' ? 'បង្កើតថ្មី' : 'New'}</span>
            </button>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
              <p className="text-xs text-stone-500">
                {lang === 'km' ? 'មិនទាន់មានកិច្ចការកត់ត្រាទេ' : 'No upcoming events'}
              </p>
              <button
                onClick={() => onOpenAddEvent()}
                className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-400 underline"
              >
                {lang === 'km' ? '+ បន្ថែមកិច្ចការដំបូង' : '+ Add your first event'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((e) => (
                <div
                  key={e.id}
                  className={`flex items-start justify-between gap-3 p-2.5 rounded-xl border transition ${
                    e.isCompleted
                      ? 'bg-stone-50/50 dark:bg-stone-900/30 border-stone-200/40 dark:border-stone-800/40 opacity-60'
                      : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-700/60'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => onToggleEventComplete(e.id)}
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition ${
                        e.isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-400 hover:border-emerald-600'
                      }`}
                      aria-label="Toggle completed"
                    >
                      {e.isCompleted && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          e.isCompleted
                            ? 'line-through text-stone-500'
                            : 'text-stone-900 dark:text-stone-100'
                        }`}
                      >
                        {e.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
                        <span>{e.date}</span>
                        {e.time && <span>• {e.time}</span>}
                        {e.category === 'religious' && <span>• វត្តអារាម</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Official Verification Footnote */}
      <footer className="rounded-xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/50 p-3.5 text-xs text-stone-600 dark:text-stone-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {lang === 'km'
              ? 'ទិន្នន័យបុណ្យជាតិត្រូវបានផ្ទៀងផ្ទាត់យោងតាមក្រសួងសេដ្ឋកិច្ច និងហិរញ្ញវត្ថុ (MEF) និងធនាគារជាតិនៃកម្ពុជា (NBC)'
              : 'Public holiday dataset cross-verified against official MEF and NBC gazettes.'}
          </span>
        </div>
        <a
          href="https://mef.gov.kh/public-holiday-2026/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-700 dark:text-red-400 hover:underline flex items-center gap-1 text-[11px] shrink-0"
        >
          <span>MEF Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </footer>
    </div>
  );
};
