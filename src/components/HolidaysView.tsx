/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  HolidayItem,
  HolidayCategory,
  searchHolidays,
} from '../data/holidays.ts';
import {
  Award,
  Search,
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface HolidaysViewProps {
  onSelectDate: (dateStr: string) => void;
  lang: 'km' | 'en';
}

export const HolidaysView: React.FC<HolidaysViewProps> = ({ onSelectDate, lang }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedCategory, setSelectedCategory] = useState<HolidayCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const years = [2025, 2026, 2027];

  const categories = [
    { id: 'ALL', labelKh: 'ទាំងអស់', labelEn: 'All' },
    { id: 'PUBLIC_HOLIDAY', labelKh: 'ឈប់សម្រាកការងារ', labelEn: 'Public Holidays' },
    { id: 'BUDDHIST_OBSERVANCE', labelKh: 'បុណ្យព្រះពុទ្ធសាសនា', labelEn: 'Buddhist' },
    { id: 'CULTURAL_EVENT', labelKh: 'ប្រពៃណី & វប្បធម៌', labelEn: 'Cultural' },
  ] as const;

  const filteredHolidays = useMemo(() => {
    return searchHolidays(searchQuery, selectedCategory, selectedYear);
  }, [searchQuery, selectedCategory, selectedYear]);

  return (
    <div className="space-y-4">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-[#18181b] p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-red-700 dark:text-red-400" />
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
              {lang === 'km'
                ? 'បុណ្យជាតិផ្លូវការ & ពិធីសាសនា'
                : 'Official Public Holidays & Observances'}
            </h2>
          </div>
          <p className="text-xs text-stone-500 max-w-xl">
            {lang === 'km'
              ? 'ទិន្នន័យត្រូវបានដកស្រង់ចេញពីអនុក្រឹត្យរាជរដ្ឋាភិបាលកម្ពុជា ក្រសួងសេដ្ឋកិច្ច និងហិរញ្ញវត្ថុ (MEF) និងធនាគារជាតិនៃកម្ពុជា (NBC)។'
              : 'Officially cross-referenced with Royal Government sub-decrees and MEF/NBC public gazettes.'}
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedYear === y
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {y} {y === 2027 ? (lang === 'km' ? '(បឋម)' : '(Prov)') : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Provisional notice for 2027 */}
      {selectedYear === 2027 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">
              {lang === 'km' ? 'ទិន្នន័យឆ្នាំ ២០២៧ ជាទិន្នន័យបឋម (Provisional)' : '2027 Data is Provisional'}
            </strong>
            <p className="mt-0.5 text-stone-600 dark:text-stone-300">
              {lang === 'km'
                ? 'កាលបរិច្ឆេទមួយចំនួនត្រូវបានប៉ាន់ស្មានតាមទម្លាប់ប្រចាំឆ្នាំ។ កម្មវិធីនឹងធ្វើបច្ចុប្បន្នភាពភ្លាមៗនៅពេលមានអនុក្រឹត្យរាជរដ្ឋាភិបាលផ្លូវការ។'
                : 'Dates are estimated based on statutory schedules. Final confirmation will follow the issuance of the official 2027 sub-decree.'}
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'km' ? 'ស្វែងរកឈ្មោះបុណ្យ...' : 'Search holiday name...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#18181b] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-700"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id as HolidayCategory | 'ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'bg-white dark:bg-[#18181b] text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
              }`}
            >
              {lang === 'km' ? c.labelKh : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Holidays Grid / List */}
      {filteredHolidays.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#18181b] rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
          <Info className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
          <p className="text-xs text-stone-500">
            {lang === 'km'
              ? 'រកមិនឃើញទិន្នន័យបុណ្យសម្រាប់លក្ខខណ្ឌស្វែងរកនេះទេ'
              : 'No holidays matching current filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredHolidays.map((h) => {
            const isMultiDay = h.startDate !== h.endDate;
            return (
              <div
                key={h.id}
                onClick={() => onSelectDate(h.startDate)}
                className="group flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-[#18181b] border border-stone-200 dark:border-stone-800 hover:border-red-600/40 dark:hover:border-red-500/40 shadow-xs hover:shadow-md transition cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        h.isPublicHoliday
                          ? 'bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300'
                          : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {h.category === 'PUBLIC_HOLIDAY'
                        ? lang === 'km'
                          ? 'ឈប់សម្រាកផ្លូវការ'
                          : 'Public Holiday'
                        : h.category === 'BUDDHIST_OBSERVANCE'
                        ? lang === 'km'
                          ? 'ពិធីបុណ្យពុទ្ធសាសនា'
                          : 'Buddhist Observance'
                        : lang === 'km'
                        ? 'ប្រពៃណីជាតិ'
                        : 'Cultural Event'}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{h.verificationStatus}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition">
                    {h.nameKh}
                  </h3>
                  <h4 className="text-xs text-stone-500 font-medium mb-1.5">
                    {h.nameEn}
                  </h4>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                    {h.descriptionKh}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 font-sans font-medium">
                    <Calendar className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />
                    <span>
                      {h.startDate}
                      {isMultiDay ? ` ដល់ ${h.endDate.slice(5)}` : ''}
                    </span>
                  </div>

                  <a
                    href={h.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-red-700 dark:text-red-400 hover:underline text-[11px]"
                  >
                    <span>{lang === 'km' ? 'ប្រភព' : 'Source'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
