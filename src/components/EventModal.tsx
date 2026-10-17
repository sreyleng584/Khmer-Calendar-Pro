/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserEvent, EventCategory, ReminderOption } from '../storage/eventsStore.ts';
import { X, Calendar, Clock, Bell, Tag, AlignLeft } from 'lucide-react';

interface EventModalProps {
  initialDate?: string;
  initialEvent?: UserEvent | null;
  onSave: (event: Omit<UserEvent, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onClose: () => void;
  lang: 'km' | 'en';
}

export const EventModal: React.FC<EventModalProps> = ({
  initialDate,
  initialEvent,
  onSave,
  onClose,
  lang,
}) => {
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [date, setDate] = useState(
    initialEvent?.date || initialDate || new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState(initialEvent?.time || '08:00');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [category, setCategory] = useState<EventCategory>(initialEvent?.category || 'personal');
  const [reminder, setReminder] = useState<ReminderOption>(initialEvent?.reminder || 'none');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(lang === 'km' ? 'សូមបញ្ចូលចំណងជើងកិច្ចការ' : 'Title is required');
      return;
    }
    if (!date) {
      setError(lang === 'km' ? 'សូមជ្រើសរើសកាលបរិច្ឆេទ' : 'Date is required');
      return;
    }

    onSave({
      id: initialEvent?.id,
      title: title.trim(),
      date,
      time: time || undefined,
      description: description.trim() || undefined,
      category,
      reminder,
      isCompleted: initialEvent?.isCompleted || false,
    });
    onClose();
  };

  const categories = [
    { id: 'personal', labelKh: 'ផ្ទាល់ខ្លួន', labelEn: 'Personal' },
    { id: 'religious', labelKh: 'វត្តអារាម & សាសនា', labelEn: 'Religious' },
    { id: 'family', labelKh: 'គ្រួសារ', labelEn: 'Family' },
    { id: 'work', labelKh: 'ការងារ', labelEn: 'Work' },
  ] as const;

  const reminders = [
    { id: 'none', labelKh: 'គ្មានការរំលឹក', labelEn: 'No reminder' },
    { id: 'at_time', labelKh: 'ដល់ម៉ោង', labelEn: 'At time of event' },
    { id: '15m_before', labelKh: '១៥ នាទីមុន', labelEn: '15 minutes before' },
    { id: '1h_before', labelKh: '១ ម៉ោងមុន', labelEn: '1 hour before' },
    { id: '1d_before', labelKh: '១ ថ្ងៃមុន', labelEn: '1 day before' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1a1a1e] border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#202025]">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            {initialEvent
              ? lang === 'km'
                ? 'កែប្រែកិច្ចការ'
                : 'Edit Event'
              : lang === 'km'
              ? 'បន្ថែមកិច្ចការ ឬការរំលឹកថ្មី'
              : 'Add Event & Reminder'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {lang === 'km' ? 'ចំណងជើងកិច្ចការ *' : 'Event Title *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder={lang === 'km' ? 'ឧ. ទៅវត្តអារាម វេរចង្ហាន់' : 'e.g. Visit Pagoda'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-700"
              autoFocus
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? 'កាលបរិច្ឆេទ *' : 'Date *'}</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-700 font-sans"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? 'ពេលវេលា' : 'Time'}</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-700 font-sans"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ប្រភេទ' : 'Category'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id as EventCategory)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition ${
                    category === c.id
                      ? 'bg-red-800 text-white border-red-900'
                      : 'bg-stone-50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {lang === 'km' ? c.labelKh : c.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              <Bell className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ការរំលឹក' : 'Reminder'}</span>
            </label>
            <select
              value={reminder}
              onChange={(e) => setReminder(e.target.value as ReminderOption)}
              className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-700"
            >
              {reminders.map((r) => (
                <option key={r.id} value={r.id}>
                  {lang === 'km' ? r.labelKh : r.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              <AlignLeft className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'កំណត់សម្គាល់បន្ថែម' : 'Notes'}</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === 'km' ? 'ព័ត៌មានលម្អិត...' : 'Optional details...'}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition"
            >
              {lang === 'km' ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-red-800 hover:bg-red-900 text-white text-xs font-semibold shadow-md transition active:scale-95"
            >
              {lang === 'km' ? 'រក្សាទុក' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
