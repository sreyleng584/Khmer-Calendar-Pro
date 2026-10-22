/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppSettings } from '../storage/settingsStore.ts';
import { eventsStore } from '../storage/eventsStore.ts';
import { notificationService } from '../services/notificationService.ts';
import { observanceNotificationService, ObservanceReminderInfo } from '../services/observanceNotificationService.ts';
import {
  X,
  Languages,
  Moon,
  Sun,
  Bell,
  Download,
  Upload,
  Shield,
  Smartphone,
  ExternalLink,
  Info,
  DollarSign,
  CheckCircle2,
  FileCode,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onClose: () => void;
  onEventsImported: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onEventsImported,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'backup' | 'android' | 'privacy'>('general');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [permStatus, setPermStatus] = useState<string>('checking...');
  const [nextObservance, setNextObservance] = useState<ObservanceReminderInfo | null>(null);

  const lang = settings.language;

  useEffect(() => {
    observanceNotificationService.checkPermissions().then(setPermStatus);
    setNextObservance(observanceNotificationService.getNextObservance());
  }, []);

  const handleExportData = () => {
    const jsonStr = eventsStore.exportJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khmer-calendar-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportStatus(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = eventsStore.importJson(content);
      if (res.success) {
        setImportStatus(
          lang === 'km'
            ? `ជោគជ័យ! បានបញ្ចូលទិន្នន័យចំនួន ${res.count} កិច្ចការ`
            : `Success! Imported ${res.count} events.`
        );
        onEventsImported();
      } else {
        setImportStatus(res.error || 'Import failed');
      }
    };
    reader.readAsText(file);
  };

  const handleRequestNotificationPermission = async () => {
    const res = await observanceNotificationService.requestPermissions();
    setPermStatus(res);
    if (res === 'granted') {
      setNotificationMsg(
        lang === 'km' ? 'បានបើកសិទ្ធិទទួលដំណឹងថ្ងៃសីលជោគជ័យ!' : 'Buddhist observance notification permission granted!'
      );
      await observanceNotificationService.scheduleObservanceReminders();
    } else {
      setNotificationMsg(
        lang === 'km' ? 'សិទ្ធិទទួលដំណឹងត្រូវបានបដិសេធ' : 'Notification permission was denied.'
      );
    }
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleTestNotification = async () => {
    const success = await observanceNotificationService.sendTestNotification();
    setNotificationMsg(
      success
        ? (lang === 'km' ? 'បានផ្ញើការជូនដំណឹងសាកល្បងដោយជោគជ័យ!' : 'Test notification sent successfully!')
        : (lang === 'km' ? 'បរាជ័យក្នុងការផ្ញើ សូមពិនិត្យសិទ្ធិទទួលដំណឹង' : 'Failed to send. Check permissions.')
    );
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1a1a1e] border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#202025] shrink-0">
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {lang === 'km' ? 'ការកំណត់ & ព័ត៌មានកម្មវិធី' : 'Settings & Information'}
            </h3>
            <p className="text-xs text-stone-500">Khmer Calendar Pro v1.1.0</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 px-4 pt-2 bg-stone-50/50 dark:bg-[#1c1c20] text-xs font-semibold overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-2 border-b-2 transition ${
              activeTab === 'general'
                ? 'border-red-700 text-red-700 dark:text-red-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {lang === 'km' ? 'ទូទៅ' : 'General'}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-2 border-b-2 transition ${
              activeTab === 'notifications'
                ? 'border-red-700 text-red-700 dark:text-red-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {lang === 'km' ? 'ថ្ងៃសីល & រំលឹក' : 'Observance Alerts'}
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-2 border-b-2 transition ${
              activeTab === 'backup'
                ? 'border-red-700 text-red-700 dark:text-red-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {lang === 'km' ? 'បម្រុងទុកទិន្នន័យ' : 'Backup & Restore'}
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`px-3 py-2 border-b-2 transition ${
              activeTab === 'android'
                ? 'border-red-700 text-red-700 dark:text-red-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {lang === 'km' ? 'Android APK' : 'Android APK'}
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-2 border-b-2 transition ${
              activeTab === 'privacy'
                ? 'border-red-700 text-red-700 dark:text-red-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {lang === 'km' ? 'ឯកជនភាព' : 'Privacy & Sources'}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Language Preference */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-center gap-2.5">
                  <Languages className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                      {lang === 'km' ? 'ភាសាបង្ហាញ' : 'Display Language'}
                    </span>
                    <span className="text-[11px] text-stone-500">Khmer / English</span>
                  </div>
                </div>
                <div className="flex gap-1 bg-stone-200 dark:bg-stone-700 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateSettings({ language: 'km' })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      settings.language === 'km'
                        ? 'bg-red-800 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    ខ្មែរ
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ language: 'en' })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      settings.language === 'en'
                        ? 'bg-red-800 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Khmer Numerals */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60">
                <div>
                  <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                    {lang === 'km' ? 'ទម្រង់លេខកាលបរិច្ឆេទ' : 'Numeral Display'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {settings.numeralStyle === 'khmer'
                      ? 'លេខខ្មែរ (០, ១, ២, ៣...)'
                      : 'Western (0, 1, 2, 3...)'}
                  </span>
                </div>
                <div className="flex gap-1 bg-stone-200 dark:bg-stone-700 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateSettings({ numeralStyle: 'khmer' })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      settings.numeralStyle === 'khmer'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    ០-៩
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ numeralStyle: 'western' })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      settings.numeralStyle === 'western'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    0-9
                  </button>
                </div>
              </div>

              {/* Theme Mode */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-center gap-2.5">
                  {settings.theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-600" />
                  )}
                  <div>
                    <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                      {lang === 'km' ? 'រចនាបថពណ៌ (Theme)' : 'Color Theme'}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 bg-stone-200 dark:bg-stone-700 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateSettings({ theme: 'light' })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      settings.theme === 'light'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ theme: 'dark' })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      settings.theme === 'dark'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Temperature Unit */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-center gap-2.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                      {lang === 'km' ? 'ខ្នាតសីតុណ្ហភាពអាកាសធាតុ' : 'Temperature Unit'}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {settings.temperatureUnit === 'fahrenheit' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 bg-stone-200 dark:bg-stone-700 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateSettings({ temperatureUnit: 'celsius' })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      settings.temperatureUnit !== 'fahrenheit'
                        ? 'bg-red-800 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    °C
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ temperatureUnit: 'fahrenheit' })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      settings.temperatureUnit === 'fahrenheit'
                        ? 'bg-red-800 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    °F
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {/* Next Observance Summary Banner */}
              {nextObservance && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/50 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-amber-900 dark:text-amber-200 block">
                      {lang === 'km' ? 'ថ្ងៃសីលបន្ទាប់ (Next Observance):' : 'Next Observance:'} {nextObservance.dateStr}
                    </span>
                    <span className="text-stone-600 dark:text-stone-300">
                      {nextObservance.lunarString} ({nextObservance.daysUntil === 0 ? (lang === 'km' ? 'ថ្ងៃនេះ' : 'Today') : (lang === 'km' ? `ក្នុងរយៈពេល ${nextObservance.daysUntil}ថ្ងៃ` : `in ${nextObservance.daysUntil} days`)})
                    </span>
                  </div>
                </div>
              )}

              {/* Master Switch for Observance Reminders */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-red-700 dark:text-red-400" />
                  <div>
                    <span className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                      {lang === 'km' ? 'ការជូនដំណឹងថ្ងៃសីលស្វ័យប្រវត្ត' : 'Automatic Observance Alerts'}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {lang === 'km' ? 'ជូនដំណឹងមុន ១ថ្ងៃ និងថ្ងៃសីលផ្ទាល់' : 'Remind 1 day before & on observance day'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.observanceRemindersEnabled}
                  onChange={(e) => {
                    onUpdateSettings({ observanceRemindersEnabled: e.target.checked });
                    observanceNotificationService.scheduleObservanceReminders();
                  }}
                  className="w-4 h-4 accent-red-800 cursor-pointer"
                />
              </div>

              {settings.observanceRemindersEnabled && (
                <div className="space-y-3 pl-2 border-l-2 border-red-800/30">
                  {/* Reminder 1: One day before */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/30 border border-stone-200/60 dark:border-stone-700/40">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.remindOneDayBefore}
                        onChange={(e) => {
                          onUpdateSettings({ remindOneDayBefore: e.target.checked });
                          observanceNotificationService.scheduleObservanceReminders();
                        }}
                        className="w-3.5 h-3.5 accent-red-800 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                        {lang === 'km' ? 'ជូនដំណឹងមុន ១ថ្ងៃ (ល្ងាច)' : 'Remind 1 day before (Evening)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="time"
                        value={settings.remindOneDayBeforeTime}
                        onChange={(e) => {
                          onUpdateSettings({ remindOneDayBeforeTime: e.target.value });
                          observanceNotificationService.scheduleObservanceReminders();
                        }}
                        className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Reminder 2: On observance day */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/30 border border-stone-200/60 dark:border-stone-700/40">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.remindOnDayOf}
                        onChange={(e) => {
                          onUpdateSettings({ remindOnDayOf: e.target.checked });
                          observanceNotificationService.scheduleObservanceReminders();
                        }}
                        className="w-3.5 h-3.5 accent-red-800 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                        {lang === 'km' ? 'ជូនដំណឹងនៅថ្ងៃសីល (ព្រឹក)' : 'Remind on observance day (Morning)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="time"
                        value={settings.remindOnDayOfTime}
                        onChange={(e) => {
                          onUpdateSettings({ remindOnDayOfTime: e.target.value });
                          observanceNotificationService.scheduleObservanceReminders();
                        }}
                        className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Permission status & Test button */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100 block">
                      {lang === 'km' ? 'ស្ថានភាពសិទ្ធិទទួលដំណឹង៖' : 'Permission Status:'}
                    </span>
                    <span className="text-stone-500 uppercase font-mono text-[11px]">{permStatus}</span>
                  </div>
                  {permStatus !== 'granted' && (
                    <button
                      onClick={handleRequestNotificationPermission}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs transition"
                    >
                      {lang === 'km' ? 'ស្នើសុំសិទ្ធិ' : 'Request Permission'}
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between">
                  <span className="text-xs text-stone-600 dark:text-stone-400">
                    {lang === 'km' ? 'សាកល្បងផ្ញើការជូនដំណឹងทันที' : 'Send instant test alert'}
                  </span>
                  <button
                    onClick={handleTestNotification}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 dark:bg-stone-700 hover:bg-stone-900 text-white text-xs font-semibold shadow-xs transition"
                  >
                    {lang === 'km' ? 'តេស្តជូនដំណឹង' : 'Test Alert'}
                  </button>
                </div>

                {notificationMsg && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium animate-in fade-in">
                    {notificationMsg}
                  </p>
                )}
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                {lang === 'km'
                  ? 'ចំណាំ៖ នៅលើកម្មវិធី Capacitor Android ការជូនដំណឹងនឹងដំណើរការក្រៅបណ្តាញក្នុងម៉ាស៊ីន។ ចំណែកឯលើកម្មវិធីរុករក Web PWA ការជូនដំណឹងទាមទារឱ្យកម្មវិធីបើកដំណើរការជាប្រចាំ។'
                  : 'Note: On Capacitor Android APK, notifications operate fully offline via local scheduling. On web browsers / PWAs, foreground alerts are supported when the app is active.'}
              </p>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-3">
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  {lang === 'km' ? 'ការបម្រុងទុកទិន្នន័យ (Data Backup)' : 'Data Export / Import'}
                </h4>
                <p className="text-xs text-stone-500">
                  {lang === 'km'
                    ? 'អ្នកអាចទាញយកទិន្នន័យកិច្ចការរបស់អ្នកជាឯកសារ JSON និងនាំចូលមកវិញបានគ្រប់ពេលវេលា។'
                    : 'Download your saved events as a JSON file and import them back anytime.'}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 dark:bg-stone-700 hover:bg-stone-900 text-white text-xs font-semibold shadow-xs transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'ទាញយក Backup (JSON)' : 'Export JSON'}</span>
                  </button>

                  <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'នាំចូលទិន្នន័យ (Import)' : 'Import JSON'}</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>

                {importStatus && (
                  <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-medium">
                    {importStatus}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'android' && (
            <div className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-2">
                <div className="flex items-center gap-2 text-red-900 dark:text-red-200 font-bold">
                  <Smartphone className="w-4 h-4 text-red-600" />
                  <span>{lang === 'km' ? 'ការវេចខ្ចប់ជា Android APK' : 'Android APK Packaging (Capacitor)'}</span>
                </div>
                <p>
                  {lang === 'km'
                    ? 'កម្មវិធីត្រូវបានកំណត់រចនាសម្ព័ន្ធជាមួយ Capacitor យ៉ាងពេញលេញ (com.khmercalendar.pro) ត្រៀមរួចជាស្រេចសម្រាប់ការ Build ជា Android APK។'
                    : 'The project is configured with Capacitor (appId: com.khmercalendar.pro). Ready for native Android compilation.'}
                </p>
              </div>

              <div className="space-y-2 font-mono text-[11px] bg-stone-900 text-stone-200 p-3.5 rounded-2xl overflow-x-auto">
                <p className="text-amber-400 font-sans font-bold mb-1">
                  {lang === 'km' ? 'ជំហានបង្កើត Android APK លើកុំព្យូទ័រ៖' : 'Commands to generate Android APK:'}
                </p>
                <p className="text-stone-400"># 1. Build the production web bundle</p>
                <p className="text-emerald-400">npm run build</p>
                <p className="text-stone-400 mt-2"># 2. Add Android platform (if not already added)</p>
                <p className="text-emerald-400">npx cap add android</p>
                <p className="text-stone-400 mt-2"># 3. Sync web assets & configuration to Android project</p>
                <p className="text-emerald-400">npx cap sync android</p>
                <p className="text-stone-400 mt-2"># 4. Open in Android Studio or build debug APK via Gradle</p>
                <p className="text-emerald-400">cd android &amp;&amp; ./gradlew assembleDebug</p>
                <p className="text-stone-400 mt-2"># Result APK location:</p>
                <p className="text-amber-300">android/app/build/outputs/apk/debug/app-debug.apk</p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'km' ? 'គោលការណ៍ឯកជនភាព (Privacy Policy)' : 'Privacy Policy'}</span>
                </div>
                <p>
                  {lang === 'km'
                    ? 'កម្មវិធី Khmer Calendar Pro គោរពឯកជនភាពរបស់អ្នក ១០០%។ រាល់កាលវិភាគ កិច្ចការកត់ត្រា និងការកំណត់ទាំងអស់ត្រូវបានរក្សាទុកតែក្នុងឧបករណ៍របស់អ្នក (Local Storage)។ គ្មានទិន្នន័យផ្ទាល់ខ្លួនណាមួយត្រូវបានបញ្ជូនទៅម៉ាស៊ីនមេខាងក្រៅឡើយ។'
                    : 'Khmer Calendar Pro respects 100% of your privacy. All notes, events, and settings reside exclusively on your local device storage. No personal data is collected or transmitted externally.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'km' ? 'ប្រភពទិន្នន័យ និងអាជ្ញាប័ណ្ណ' : 'Data Sources & Licenses'}</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-stone-600 dark:text-stone-400">
                  <li>
                    <strong>Khmer Lunar Calculations:</strong> @thyrith/momentkh (MIT License) - based on Cambodian traditional astronomical formulas.
                  </li>
                  <li>
                    <strong>Official Public Holidays:</strong> Ministry of Economy and Finance (MEF) &amp; National Bank of Cambodia (NBC).
                  </li>
                  <li>
                    <strong>Typography:</strong> Google Fonts Kantumruy Pro (SIL Open Font License).
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-200">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'km' ? 'គំរូម៉ូដែលរកប្រាក់ចំណូល (Monetization Design)' : 'Monetization Architecture'}</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300">
                  {lang === 'km'
                    ? 'មុខងារប្រតិទិន និងការកត់ត្រាស្នូលទាំងអស់គឺឥតគិតថ្លៃ ១០០%។ គ្មានផ្ទាំងពាណិជ្ជកម្មរំខានการប្រើប្រាស់ឡើយ។ គាំទ្រការបន្ថែម Premium themes ឬ Google AdMob banner ដោយមិនប៉ះពាល់ដល់ភាពត្រឹមត្រូវនៃប្រតិទិន។'
                    : 'Core calendar calculations, holy days, and reminders are 100% free with no paywalls. Built ready for optional non-intrusive AdMob banner or premium artistic themes.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 dark:bg-[#151518] border-t border-stone-200 dark:border-stone-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 dark:bg-stone-700 text-white text-xs font-semibold hover:bg-stone-900 transition"
          >
            {lang === 'km' ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
