/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, CheckCircle2, Settings, Sparkles, Home, ListTodo, Award } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton.tsx';

export type ActiveTab = 'home' | 'calendar' | 'holidays' | 'events' | 'newyear';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onGoToToday: () => void;
  onOpenSettings: () => void;
  lang: 'km' | 'en';
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onGoToToday,
  onOpenSettings,
  lang,
}) => {
  const tabs = [
    { id: 'home', labelKh: 'ផ្ទាំងដើម', labelEn: 'Home', icon: Home },
    { id: 'calendar', labelKh: 'ប្រតិទិនខែ', labelEn: 'Calendar', icon: Calendar },
    { id: 'holidays', labelKh: 'បុណ្យជាតិ & សីល', labelEn: 'Holidays', icon: Award },
    { id: 'events', labelKh: 'កិច្ចការ & រំលឹក', labelEn: 'My Events', icon: ListTodo },
    { id: 'newyear', labelKh: 'មហាសង្ក្រាន្ត', labelEn: 'New Year', icon: Sparkles },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#151518]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-800 via-red-900 to-red-950 flex items-center justify-center shadow-md shadow-red-900/30 ring-2 ring-amber-400/70 overflow-hidden group-hover:ring-amber-300 transition">
            <img src="/Khmer Calendar Pro Icon.png" alt="Khmer Calendar Pro logo" className="w-full h-full object-cover" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-white dark:border-stone-900 shadow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-stone-900 dark:text-stone-100">
                {lang === 'km' ? 'ប្រតិទិនខ្មែរ ប្រូ' : 'Khmer Calendar Pro'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-medium border border-emerald-300/40">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>{lang === 'km' ? 'ផ្ទៀងផ្ទាត់' : 'Verified'}</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-none">
              {lang === 'km' ? 'ក្បួនចន្ទគតិ & បុណ្យជាតិផ្លូវការ' : 'Authentic Lunar & Official Holidays'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Today Button */}
          <button
            onClick={onGoToToday}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-300 text-xs font-semibold border border-stone-200 dark:border-stone-700/60 transition active:scale-95"
            aria-label={lang === 'km' ? 'ត្រឡប់ទៅថ្ងៃនេះ' : 'Return to Today'}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ថ្ងៃនេះ' : 'Today'}</span>
          </button>

          {/* In-app PWA install button */}
          <PWAInstallButton lang={lang} />

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            aria-label={lang === 'km' ? 'ការកំណត់' : 'Settings'}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-5xl mx-auto px-2 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 py-1" aria-label="Navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as ActiveTab)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-red-800 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/70 dark:hover:bg-stone-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : ''}`} />
                <span>{lang === 'km' ? tab.labelKh : tab.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
