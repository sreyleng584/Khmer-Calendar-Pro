/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  getKhmerDate,
  toKhmerNumerals,
  getDaysInMonth,
  getFirstWeekdayOfMonth,
  KHMER_WEEKDAYS_SHORT,
  KHMER_MONTH_NAMES,
  KhmerDateResult,
} from '../calendar/khmerDateAdapter.ts';
import { HolidayItem, getHolidaysForDate } from '../data/holidays.ts';
import { UserEvent } from '../storage/eventsStore.ts';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MoveHorizontal } from 'lucide-react';
import { BuddhaIcon } from './BuddhaIcon.tsx';
import { useSwipeGesture } from '../hooks/useSwipeGesture.ts';

interface CalendarGridProps {
  currentYear: number;
  currentMonth: number; // 1-12
  selectedDate: string; // YYYY-MM-DD
  todayDateStr: string;
  onSelectDate: (dateStr: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  events: UserEvent[];
  useKhmerNumerals: boolean;
  lang: 'km' | 'en';
}

const GREGORIAN_MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const GREGORIAN_MONTH_NAMES_KH = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ',
];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentYear,
  currentMonth,
  selectedDate,
  todayDateStr,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  onMonthChange,
  onYearChange,
  events,
  useKhmerNumerals,
  lang,
}) => {
  const num = (val: number | string) => (useKhmerNumerals ? toKhmerNumerals(val) : String(val));

  // Horizontal touch swipe gesture recognition for month navigation
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: onNextMonth,
    onSwipeRight: onPrevMonth,
  });

  // Compute month cells
  const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const firstWeekday = useMemo(() => getFirstWeekdayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);

  // Previous month days for padding
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = useMemo(() => getDaysInMonth(prevYear, prevMonth), [prevYear, prevMonth]);

  // Map events by date for fast lookup
  const eventsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const ev of events) {
      map.set(ev.date, (map.get(ev.date) || 0) + 1);
    }
    return map;
  }, [events]);

  // Generate cells data
  const cells = useMemo(() => {
    const list: Array<{
      day: number;
      dateStr: string;
      isCurrentMonth: boolean;
      khmerData: KhmerDateResult;
      holidays: HolidayItem[];
      hasEvents: boolean;
      dayOfWeek: number;
    }> = [];

    // Leading padding days from previous month
    for (let i = firstWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const khmerData = getKhmerDate(prevYear, prevMonth, day);
      const holidays = getHolidaysForDate(dateStr);
      list.push({
        day,
        dateStr,
        isCurrentMonth: false,
        khmerData,
        holidays,
        hasEvents: eventsByDate.has(dateStr),
        dayOfWeek: (firstWeekday - 1 - i) % 7,
      });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const khmerData = getKhmerDate(currentYear, currentMonth, day);
      const holidays = getHolidaysForDate(dateStr);
      const dow = (firstWeekday + day - 1) % 7;
      list.push({
        day,
        dateStr,
        isCurrentMonth: true,
        khmerData,
        holidays,
        hasEvents: eventsByDate.has(dateStr),
        dayOfWeek: dow,
      });
    }

    // Trailing padding days for next month to complete standard 35 or 42 grid
    const totalCells = list.length <= 35 ? 35 : 42;
    const remaining = totalCells - list.length;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    for (let day = 1; day <= remaining; day++) {
      const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const khmerData = getKhmerDate(nextYear, nextMonth, day);
      const holidays = getHolidaysForDate(dateStr);
      const dow = (list.length) % 7;
      list.push({
        day,
        dateStr,
        isCurrentMonth: false,
        khmerData,
        holidays,
        hasEvents: eventsByDate.has(dateStr),
        dayOfWeek: dow,
      });
    }

    return list;
  }, [currentYear, currentMonth, daysInMonth, firstWeekday, daysInPrevMonth, prevMonth, prevYear, eventsByDate]);

  // Year options list for fast navigation
  const years = [2022, 2023, 2024, 2025, 2026, 2027, 2028];

  return (
    <div className="space-y-4">
      {/* Month Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#18181b] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        {/* Month & Year Title & Selectors */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              aria-label="ជ្រើសរើសខែ"
              value={currentMonth}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold text-sm sm:text-base py-1.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-red-700 cursor-pointer"
            >
              {GREGORIAN_MONTH_NAMES_KH.map((nameKh, idx) => (
                <option key={idx} value={idx + 1}>
                  {lang === 'km' ? `ខែ${nameKh}` : GREGORIAN_MONTH_NAMES_EN[idx]}
                </option>
              ))}
            </select>

            <select
              aria-label="ជ្រើសរើសឆ្នាំ"
              value={currentYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold text-sm sm:text-base py-1.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-red-700 cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {num(y)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Previous / Next / Today Arrows */}
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={onGoToToday}
            className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 transition"
          >
            {lang === 'km' ? 'ថ្ងៃនេះ' : 'Today'}
          </button>
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
            aria-label="ខែមុន"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
            aria-label="ខែបន្ទាប់"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container with horizontal touch swipe */}
      <div
        {...swipeHandlers}
        style={{ touchAction: 'pan-y' }}
        className="bg-white dark:bg-[#18181b] rounded-3xl border border-stone-200 dark:border-stone-800 p-3 sm:p-5 shadow-xs overflow-hidden select-none touch-pan-y"
      >
        {/* Weekday Row */}
        <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold">
          {KHMER_WEEKDAYS_SHORT.map((dayKh, idx) => {
            const isSunday = idx === 0;
            const isSaturday = idx === 6;
            return (
              <div
                key={idx}
                className={`py-2 rounded-lg ${
                  isSunday
                    ? 'text-red-700 dark:text-red-400'
                    : isSaturday
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <span>{dayKh}</span>
              </div>
            );
          })}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {cells.map((cell, idx) => {
            const isSelected = cell.dateStr === selectedDate;
            const isToday = cell.dateStr === todayDateStr;
            const isHoliday = cell.holidays.some((h) => h.isPublicHoliday);
            const isHolyDay = cell.khmerData.khmer.isBuddhistHolyDay;
            const isSunday = cell.dayOfWeek === 0;

            return (
              <button
                key={idx}
                onClick={() => onSelectDate(cell.dateStr)}
                className={`group relative flex flex-col items-center justify-between min-h-[74px] sm:min-h-[88px] p-1.5 rounded-2xl border transition-all text-left overflow-hidden ${
                  isSelected
                    ? 'bg-red-800 text-white border-red-900 shadow-md ring-2 ring-amber-400/60'
                    : isToday
                    ? 'bg-amber-50 dark:bg-amber-950/25 border-amber-400 text-stone-900 dark:text-stone-100 shadow-xs'
                    : cell.isCurrentMonth
                    ? 'bg-stone-50/60 dark:bg-[#202024]/60 hover:bg-stone-100 dark:hover:bg-[#27272b] border-stone-200/60 dark:border-stone-800/80 text-stone-900 dark:text-stone-100'
                    : 'bg-transparent border-transparent text-stone-400 dark:text-stone-600 hover:bg-stone-100/40 opacity-40'
                }`}
                aria-label={`${cell.dateStr} - ${cell.khmerData.khmer.formattedFullKh}${isHolyDay ? ' - ថ្ងៃសីល' : ''}`}
              >
                {/* Subtle Buddhist Holy Day Buddha Silhouette (15-25% low-opacity watermark) */}
                {isHolyDay && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                    aria-hidden="true"
                  >
                    <BuddhaIcon
                      className={`w-10 h-10 sm:w-12 sm:h-12 transition-opacity ${
                        isSelected
                          ? 'text-amber-200 opacity-[0.22]'
                          : 'text-amber-700 dark:text-amber-400 opacity-[0.20]'
                      }`}
                    />
                  </div>
                )}

                {/* Top Badges / Indicators */}
                <div className="w-full flex items-center justify-between z-10">
                  {/* Solar Number */}
                  <span
                    className={`font-sans text-xs sm:text-sm font-bold ${
                      isSelected
                        ? 'text-white'
                        : isToday
                        ? 'text-amber-800 dark:text-amber-300'
                        : isSunday
                        ? 'text-red-700 dark:text-red-400'
                        : ''
                    }`}
                  >
                    {num(cell.day)}
                  </span>

                  {/* Subtle Buddhist Holy Day Buddha Silhouette Icon */}
                  {isHolyDay && (
                    <span
                      title="ថ្ងៃសីល (Buddhist Holy Day)"
                      className="inline-flex items-center justify-center p-0.5 rounded z-10"
                    >
                      <BuddhaIcon
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-opacity ${
                          isSelected
                            ? 'text-amber-200 opacity-80'
                            : 'text-amber-700/80 dark:text-amber-400/80'
                        }`}
                        ariaLabel="ថ្ងៃសីល"
                      />
                      <span className="sr-only">ថ្ងៃសីល</span>
                    </span>
                  )}
                </div>

                {/* Center / Khmer Lunar Day String */}
                <div className="my-auto text-center w-full z-10">
                  <span
                    className={`block font-medium text-[11px] sm:text-xs truncate tracking-tighter ${
                      isSelected
                        ? 'text-amber-200'
                        : isHolyDay
                        ? 'text-amber-700 dark:text-amber-400 font-bold'
                        : isHoliday
                        ? 'text-red-600 dark:text-red-400 font-semibold'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {cell.khmerData.khmer.lunarDayStringKh}
                  </span>

                  {/* Lunar month abbreviation if 1st of lunar month */}
                  {cell.khmerData.khmer.day === 1 && cell.khmerData.khmer.moonPhaseNameKh === 'កើត' && (
                    <span
                      className={`block text-[9px] truncate ${
                        isSelected ? 'text-white/80' : 'text-stone-500'
                      }`}
                    >
                      {cell.khmerData.khmer.monthNameKh}
                    </span>
                  )}
                </div>

                {/* Bottom Dots: Public Holiday & User Event */}
                <div className="flex items-center gap-1 mt-0.5 z-10">
                  {isHoliday && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-300' : 'bg-red-600'
                      }`}
                      title={cell.holidays[0]?.nameKh}
                    />
                  )}
                  {cell.hasEvents && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-blue-300' : 'bg-blue-600 dark:bg-blue-400'
                      }`}
                      title="មានកិច្ចការកត់ត្រា"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span>{lang === 'km' ? 'ឈប់សម្រាកផ្លូវការ' : 'Public Holiday'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center p-1 rounded-md bg-amber-100/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
              <BuddhaIcon className="w-3.5 h-3.5 opacity-80" ariaLabel="ថ្ងៃសីល" />
            </span>
            <span>{lang === 'km' ? 'ថ្ងៃសីល (ព្រះពុទ្ធសាសនា)' : 'Buddhist Holy Day'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>{lang === 'km' ? 'កិច្ចការរបស់អ្នក' : 'My Event'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
