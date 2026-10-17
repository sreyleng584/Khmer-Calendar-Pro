/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { getKhmerNewYearDetail, toKhmerNumerals } from '../calendar/khmerDateAdapter.ts';
import confetti from 'canvas-confetti';
import { Sparkles, Calendar, Clock, Crown, Heart, Award } from 'lucide-react';

interface Props {
  lang: 'km' | 'en';
  useKhmerNumerals: boolean;
}

export const NewYearSpecialModal: React.FC<Props> = ({ lang, useKhmerNumerals }) => {
  const [year, setYear] = useState<number>(2026);
  const ny = getKhmerNewYearDetail(year);
  const num = (val: number | string) => (useKhmerNumerals ? toKhmerNumerals(val) : String(val));

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ca8a04', '#dc2626', '#f59e0b', '#16a34a'],
    });
  };

  const offerings = [
    { titleKh: 'បាយសី ៥ថ្នាក់ ឬ ៣ថ្នាក់', descKh: 'រៀបចំដោយស្លឹកចេកស្រស់លម្អដោយផ្កា' },
    { titleKh: 'ផ្លែឈើ ៥ មុខ', descKh: 'ផ្លែឈើស្រស់ស្អាត មិនជូរចត់' },
    { titleKh: 'ទៀន ៥ និង ធូប ៥', descKh: 'អុជដើម្បីថ្វាយការគោរពដល់ទេវតា' },
    { titleKh: 'ទឹកអប់ ឬ ទឹកផ្កា', descKh: 'សម្រាប់ស្រង់ព្រះ និងទទួលពរជ័យ' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero New Year Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 via-amber-800 to-red-950 text-white p-6 sm:p-8 shadow-xl border border-amber-500/40">
        <div className="absolute right-0 bottom-0 text-9xl opacity-10 select-none pointer-events-none">
          🎊
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400 text-amber-950 shadow-md">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs text-amber-200 font-semibold uppercase tracking-wider">
                {lang === 'km' ? 'ក្បួនហោរាសាស្ត្រមហាសង្ក្រាន្ត' : 'Moha Sangkran Astrological Almanac'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {lang === 'km' ? 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ' : 'Khmer New Year Astrological View'}
              </h2>
            </div>
          </div>

          {/* Year selector buttons */}
          <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-2xl border border-white/20 self-start sm:self-auto">
            {[2024, 2025, 2026, 2027].map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  year === y
                    ? 'bg-amber-400 text-amber-950 shadow-md'
                    : 'text-amber-100 hover:text-white'
                }`}
              >
                {num(y)}
              </button>
            ))}
          </div>
        </div>

        {/* Big Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 p-4">
            <span className="text-xs text-amber-200 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'km' ? 'ថ្ងៃមហាសង្ក្រាន្ត' : 'Sangkran Date'}</span>
            </span>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1">
              {ny.sangkranDate}
            </p>
            <p className="text-xs text-amber-100/80 mt-0.5">
              {lang === 'km' ? 'វេលាម៉ោង' : 'Time:'} <strong>{ny.sangkranTime}</strong>
            </p>
          </div>

          <div className="rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 p-4">
            <span className="text-xs text-amber-200 font-medium flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'km' ? 'ទេវតាចុះមកគ្រប់គ្រង' : 'Presiding Devada'}</span>
            </span>
            <p className="text-base sm:text-lg font-bold text-amber-300 mt-1">
              {ny.devadaNameKh}
            </p>
            <p className="text-xs text-amber-100/80 mt-0.5">
              {lang === 'km' ? 'សត្វជំនិះ៖ ' : 'Vehicle: '}
              <strong>{ny.devadaVehicleKh}</strong>
            </p>
          </div>

          <div className="rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 p-4">
            <span className="text-xs text-amber-200 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'km' ? 'ឆ្នាំថ្មី & ស័ក' : 'Incoming Year & Sak'}</span>
            </span>
            <p className="text-base sm:text-lg font-bold text-white mt-1">
              ឆ្នាំ{ny.animalYearKh} {ny.sakKh}
            </p>
            <p className="text-xs text-amber-100/80 mt-0.5">
              {lang === 'km' ? 'ពុទ្ធសករាជ' : 'B.E.'} <strong>{num(ny.beYear)}</strong>
            </p>
          </div>
        </div>

        {/* Celebration Confetti Trigger */}
        <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
          <p className="text-xs text-amber-100">
            {lang === 'km'
              ? 'សូមបួងសួងដល់ទេវតាឆ្នាំថ្មី ប្រទានពរជ័យ សិរីសួស្តី ជ័យមង្គល វិបុលសុខដល់បងប្អូនទាំងអស់!'
              : 'Wishing prosperity, health, and auspicious joy under the blessings of the New Year Devada!'}
          </p>
          <button
            onClick={triggerConfetti}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-lg transition active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'km' ? 'អបអរសាទរ!' : 'Celebrate!'}</span>
          </button>
        </div>
      </div>

      {/* Preparation & Offerings Cards */}
      <div className="bg-white dark:bg-[#18181b] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-600" />
          <span>{lang === 'km' ? 'គ្រឿងរណ្តាប់ទទួលទេវតាឆ្នាំថ្មី' : 'Customary Offerings for the New Year'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {offerings.map((o, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60"
            >
              <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 mb-0.5">
                {o.titleKh}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">{o.descKh}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
