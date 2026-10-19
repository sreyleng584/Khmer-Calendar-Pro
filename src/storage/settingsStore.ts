/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'km' | 'en';
export type NumeralStyle = 'khmer' | 'western';
export type ThemeMode = 'light' | 'dark' | 'system';
export type TextSize = 'normal' | 'large';

export interface AppSettings {
  language: Language;
  numeralStyle: NumeralStyle;
  theme: ThemeMode;
  textSize: TextSize;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  observanceRemindersEnabled: boolean;
  remindOneDayBefore: boolean;
  remindOneDayBeforeTime: string; // e.g., '19:00'
  remindOnDayOf: boolean;
  remindOnDayOfTime: string; // e.g., '06:00'
}

const SETTINGS_KEY = 'khmer_calendar_pro_settings_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'km',
  numeralStyle: 'khmer',
  theme: 'light',
  textSize: 'normal',
  notificationsEnabled: true,
  soundEnabled: true,
  observanceRemindersEnabled: true,
  remindOneDayBefore: true,
  remindOneDayBeforeTime: '19:00',
  remindOnDayOf: true,
  remindOnDayOfTime: '06:00',
};

class SettingsStore {
  private currentSettings: AppSettings = { ...DEFAULT_SETTINGS };
  private listeners: Array<(settings: AppSettings) => void> = [];

  constructor() {
    this.load();
  }

  private load(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.currentSettings = { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load settings from localStorage', e);
    }
  }

  public get(): AppSettings {
    return { ...this.currentSettings };
  }

  public update(patch: Partial<AppSettings>): AppSettings {
    this.currentSettings = { ...this.currentSettings, ...patch };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.currentSettings));
      } catch (e) {
        console.error('Failed to save settings', e);
      }
    }
    this.notify();
    return this.get();
  }

  public subscribe(listener: (settings: AppSettings) => void): () => void {
    this.listeners.push(listener);
    listener(this.get());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.get());
      } catch (err) {
        console.error('Error in settings listener', err);
      }
    }
  }
}

export const settingsStore = new SettingsStore();
