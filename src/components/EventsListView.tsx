/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { UserEvent, EventCategory } from '../storage/eventsStore.ts';
import {
  Search,
  Plus,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  CheckCircle2,
  Bell,
  ListTodo,
} from 'lucide-react';

interface EventsListViewProps {
  events: UserEvent[];
  onOpenAddEvent: () => void;
  onEditEvent: (event: UserEvent) => void;
  onDeleteEvent: (id: string) => void;
  onToggleComplete: (id: string) => void;
  lang: 'km' | 'en';
}

export const EventsListView: React.FC<EventsListViewProps> = ({
  events,
  onOpenAddEvent,
  onEditEvent,
  onDeleteEvent,
  onToggleComplete,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');

  const categories = [
    { id: 'all', labelKh: 'ទាំងអស់', labelEn: 'All' },
    { id: 'personal', labelKh: 'ផ្ទាល់ខ្លួន', labelEn: 'Personal' },
    { id: 'religious', labelKh: 'វត្តអារាម & សាសនា', labelEn: 'Religious' },
    { id: 'family', labelKh: 'គ្រួសារ', labelEn: 'Family' },
    { id: 'work', labelKh: 'ការងារ', labelEn: 'Work' },
  ] as const;

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return events.filter((e) => {
      if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        e.date.includes(q)
      );
    });
  }, [events, searchQuery, selectedCategory]);

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#18181b] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-red-700 dark:text-red-400" />
            <span>{lang === 'km' ? 'កិច្ចការ & ការរំលឹករបស់អ្នក' : 'My Events & Reminders'}</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {lang === 'km'
              ? 'គ្រប់គ្រង និងរក្សាទុកកាលវិភាគផ្ទាល់ខ្លួនដោយសុវត្ថិភាពក្នុងឧបករណ៍'
              : 'Secure local storage of your personal agenda & reminders'}
          </p>
        </div>

        <button
          onClick={onOpenAddEvent}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-800 hover:bg-red-900 text-white text-xs font-semibold shadow-md transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'km' ? 'បន្ថែមកិច្ចការថ្មី' : 'Add New Event'}</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'km' ? 'ស្វែងរកតាមឈ្មោះកិច្ចការ ឬកាលបរិច្ឆេទ...' : 'Search events or dates...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#18181b] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-700"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id as EventCategory | 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#18181b] text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
              }`}
            >
              {lang === 'km' ? c.labelKh : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Event Items List */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#18181b] rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
          <Calendar className="w-12 h-12 mx-auto text-stone-300 dark:text-stone-600 mb-3" />
          <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200">
            {lang === 'km' ? 'មិនមានកិច្ចការត្រូវបានរកឃើញទេ' : 'No events found'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {lang === 'km'
              ? 'អ្នកអាចបង្កើតកិច្ចការថ្មី ឬផ្លាស់ប្តូរពាក្យស្វែងរកខាងលើ។'
              : 'Try clearing your search or add a new event using the button above.'}
          </p>
          <button
            onClick={onOpenAddEvent}
            className="mt-4 px-4 py-2 rounded-xl bg-red-800 text-white text-xs font-semibold hover:bg-red-900 transition"
          >
            {lang === 'km' ? 'បង្កើតកិច្ចការឥឡូវនេះ' : 'Create Event Now'}
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredEvents.map((e) => (
            <div
              key={e.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#18181b] border transition ${
                e.isCompleted
                  ? 'border-stone-200/50 dark:border-stone-800/50 opacity-60'
                  : 'border-stone-200 dark:border-stone-800 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleComplete(e.id)}
                  className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition shrink-0 ${
                    e.isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-stone-400 hover:border-emerald-600'
                  }`}
                  aria-label="Toggle completed"
                >
                  {e.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-bold ${
                        e.isCompleted
                          ? 'line-through text-stone-400'
                          : 'text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      {e.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                      {e.category === 'religious'
                        ? 'វត្តអារាម & សាសនា'
                        : e.category === 'family'
                        ? 'គ្រួសារ'
                        : e.category === 'work'
                        ? 'ការងារ'
                        : 'ផ្ទាល់ខ្លួន'}
                    </span>
                  </div>

                  {e.description && (
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {e.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-stone-500 font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      <span>{e.date}</span>
                    </span>
                    {e.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{e.time}</span>
                      </span>
                    )}
                    {e.reminder !== 'none' && (
                      <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                        <Bell className="w-3 h-3" />
                        <span className="text-[11px]">
                          {e.reminder === '15m_before'
                            ? '១៥ នាទីមុន'
                            : e.reminder === '1h_before'
                            ? '១ ម៉ោងមុន'
                            : e.reminder === '1d_before'
                            ? '១ ថ្ងៃមុន'
                            : 'ដល់ម៉ោង'}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 self-end sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 dark:border-stone-800 w-full sm:w-auto justify-end">
                <button
                  onClick={() => onEditEvent(e)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                  title="កែប្រែ"
                  aria-label="កែប្រែកិច្ចការ"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteEvent(e.id)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  title="លុប"
                  aria-label="លុបកិច្ចការ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
