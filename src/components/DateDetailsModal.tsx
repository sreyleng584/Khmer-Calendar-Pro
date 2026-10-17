/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  KhmerDateResult,
  toKhmerNumerals,
} from '../calendar/khmerDateAdapter.ts';
import { HolidayItem } from '../data/holidays.ts';
import { UserEvent } from '../storage/eventsStore.ts';
import { shareKhmerDate, generateDateImageCard } from '../utils/shareUtils.ts';
import { BuddhaIcon } from './BuddhaIcon.tsx';
import {
  X,
  Share2,
  Download,
  Plus,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface DateDetailsModalProps {
  dateResult: KhmerDateResult;
  holidays: HolidayItem[];
  events: UserEvent[];
  onClose: () => void;
  onOpenAddEvent: (dateStr: string) => void;
  onDeleteEvent: (id: string) => void;
  onToggleEventComplete: (id: string) => void;
  useKhmerNumerals: boolean;
  lang: 'km' | 'en';
}

export const DateDetailsModal: React.FC<DateDetailsModalProps> = ({
  dateResult,
  holidays,
  events,
  onClose,
  onOpenAddEvent,
  onDeleteEvent,
  onToggleEventComplete,
  useKhmerNumerals,
  lang,
}) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const g = dateResult.gregorian;
  const kh = dateResult.khmer;
  const num = (val: number | string) => (useKhmerNumerals ? toKhmerNumerals(val) : String(val));
  const dateStr = `${g.year}-${String(g.month).padStart(2, '0')}-${String(g.day).padStart(2, '0')}`;

  const handleShare = async () => {
    setShareFeedback(null);
    const res = await shareKhmerDate(dateResult, holidays);
    if (res.method === 'clipboard' && res.success) {
      setShareFeedback(lang === 'km' ? 'បានចម្លងព័ត៌មានទៅ Clipboard!' : 'Copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 3500);
    } else if (!res.success && res.error) {
      setShareFeedback(res.error);
      setTimeout(() => setShareFeedback(null), 3500);
    }
  };

  const handleDownloadImage = async () => {
    setIsGeneratingImage(true);
    try {
      const dataUrl = await generateDateImageCard(dateResult, holidays);
      const link = document.createElement('a');
      link.download = `khmer-calendar-${dateStr}.png`;
      link.href = dataUrl;
      link.click();
      setShareFeedback(lang === 'km' ? 'បានបង្កើត និងទាញយករូបភាព!' : 'Downloaded card image!');
      setTimeout(() => setShareFeedback(null), 3500);
    } catch (e) {
      console.error(e);
      setShareFeedback(lang === 'km' ? 'បរាជ័យក្នុងការបង្កើតរូបភាព' : 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1a1a1e] border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-red-800 via-red-900 to-[#5a0f0f] text-white p-5 sm:p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition"
            aria-label="បិទ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-medium border border-amber-300/30">
              {lang === 'km' ? 'ព័ត៌មានលម្អិតកាលបរិច្ឆេទ' : 'Date Details'}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ផ្ទៀងផ្ទាត់' : 'Verified'}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {lang === 'km' ? g.dayOfWeekNameKh : g.dayOfWeekNameEn}{' '}
            <span className="text-amber-300 font-sans">{num(g.day)}</span>
          </h2>
          <p className="text-sm text-stone-200 font-medium">
            {dateStr}
          </p>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Feedback banner */}
          {shareFeedback && (
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{shareFeedback}</span>
            </div>
          )}

          {/* Full Lunar Identity Card */}
          <div className="rounded-2xl bg-stone-50 dark:bg-[#222226] border border-stone-200/80 dark:border-stone-800 p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-stone-700/60 pb-2">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                {lang === 'km' ? 'ចន្ទគតិខ្មែរ (Khmer Lunar Date)' : 'Khmer Lunar Information'}
              </span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                {kh.monthNameEn}
              </span>
            </div>

            <div className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              {kh.lunarDayStringKh} ខែ{kh.monthNameKh}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 dark:text-stone-300">
              <div>
                <span className="text-stone-500 dark:text-stone-400">{lang === 'km' ? 'ឆ្នាំសត្វ៖ ' : 'Zodiac: '}</span>
                <strong>
                  {kh.animalYearNameKh} {kh.animalEmoji} ({kh.animalYearNameEn})
                </strong>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400">{lang === 'km' ? 'ស័ក៖ ' : 'Sak: '}</span>
                <strong>{kh.sakNameKh}</strong>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400">{lang === 'km' ? 'ពុទ្ធសករាជ៖ ' : 'B.E.: '}</span>
                <strong>{num(kh.beYear)}</strong>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400">{lang === 'km' ? 'ចុល្លសករាជ៖ ' : 'J.S.: '}</span>
                <strong>{num(kh.jsYear)}</strong>
              </div>
            </div>

            {/* Buddhist Holy Day status */}
            {kh.isBuddhistHolyDay && (
              <div className="mt-2 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/50 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 shrink-0">
                  <BuddhaIcon className="w-5 h-5 opacity-90" ariaLabel="ថ្ងៃសីល" />
                </div>
                <div className="text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2">
                    <strong className="block font-bold text-sm">
                      {lang === 'km' ? 'ថ្ងៃនេះជាថ្ងៃសីល (Buddhist Holy Day)' : 'Buddhist Observance Day (Sil)'}
                    </strong>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-semibold">
                      {lang === 'km' ? 'ផ្ទៀងផ្ទាត់' : 'Verified'}
                    </span>
                  </div>
                  <p className="mt-1 text-stone-600 dark:text-stone-300 leading-relaxed">
                    {lang === 'km'
                      ? 'ថ្ងៃសីលជាថ្ងៃឧបោសថសីលតាមពុទ្ធវិន័យ (៨កើត ១៥កើត ៨រោច និងដាច់ខែ) ដែលពុទ្ធសាសនិកជននិយមទៅកាន់វត្តអារាម សមាទានសីល ៥ ឬសីល ៨ ស្ដាប់ព្រះធម៌ទេសនា និងបំពេញកុសលបុណ្យទាន។'
                      : 'Traditional Buddhist observance day (8th waxing, 15th waxing full moon, 8th waning, and new moon). Buddhists visit pagodas to observe moral precepts and make merit.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Official Holidays section */}
          {holidays.length > 0 && (
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
                <span>🎉 {lang === 'km' ? 'បុណ្យជាតិផ្លូវការ' : 'Official Public Holidays'}</span>
              </div>
              {holidays.map((h) => (
                <div key={h.id} className="space-y-1">
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {h.nameKh} ({h.nameEn})
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {h.descriptionKh}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
                    <span>{h.sourceAuthority}</span>
                    <a
                      href={h.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 dark:text-red-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>{lang === 'km' ? 'ប្រភពយោង' : 'Official source'}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* User Events on this date */}
          <div className="rounded-2xl bg-stone-50 dark:bg-[#222226] border border-stone-200/80 dark:border-stone-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-stone-800 dark:text-stone-200">
                {lang === 'km' ? 'កិច្ចការរបស់អ្នកក្នុងថ្ងៃនេះ' : 'My Events on this Date'}
              </h3>
              <button
                onClick={() => onOpenAddEvent(dateStr)}
                className="flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? 'បន្ថែម' : 'Add'}</span>
              </button>
            </div>

            {events.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-1">
                {lang === 'km' ? 'មិនទាន់មានកិច្ចការកត់ត្រាសម្រាប់ថ្ងៃនេះទេ' : 'No personal events for this date.'}
              </p>
            ) : (
              <div className="space-y-2">
                {events.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800"
                  >
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => onToggleEventComplete(e.id)}
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition ${
                          e.isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-400 hover:border-emerald-600'
                        }`}
                      >
                        {e.isCompleted && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            e.isCompleted ? 'line-through text-stone-400' : 'text-stone-900 dark:text-stone-100'
                          }`}
                        >
                          {e.title}
                        </p>
                        {e.description && (
                          <p className="text-[11px] text-stone-500 mt-0.5">{e.description}</p>
                        )}
                        {e.time && (
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                            {e.time}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteEvent(e.id)}
                      className="p-1 text-stone-400 hover:text-red-600 transition"
                      aria-label="លុបកិច្ចការ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions: Share & Download Card */}
        <div className="p-4 bg-stone-100/80 dark:bg-[#151518] border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ចែករំលែក' : 'Share'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition active:scale-95 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isGeneratingImage
                  ? lang === 'km'
                    ? 'កំពុងបង្កើត...'
                    : 'Generating...'
                  : lang === 'km'
                  ? 'ទាញយករូបភាព'
                  : 'Download Card'}
              </span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 dark:bg-stone-700 text-white text-xs font-semibold hover:bg-stone-900 transition"
          >
            {lang === 'km' ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
