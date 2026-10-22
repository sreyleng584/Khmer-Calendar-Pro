/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import { getKhmerDate, KhmerDateResult } from '../calendar/khmerDateAdapter.ts';
import { settingsStore, AppSettings } from '../storage/settingsStore.ts';

export interface ObservanceReminderInfo {
  dateStr: string;
  lunarString: string;
  isHolyDay: boolean;
  daysUntil: number;
}

class ObservanceNotificationService {
  private isCapacitorNative(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } };
    return !!win.Capacitor?.isNativePlatform?.();
  }

  public async checkPermissions(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
    if (typeof window === 'undefined') return 'unsupported';

    if (this.isCapacitorNative()) {
      try {
        const status = await LocalNotifications.checkPermissions();
        return status.display as 'granted' | 'denied' | 'prompt';
      } catch {
        return 'unsupported';
      }
    } else {
      if (!('Notification' in window)) return 'unsupported';
      const perm = Notification.permission;
      if (perm === 'default') return 'prompt';
      return perm as 'granted' | 'denied';
    }
  }

  public async requestPermissions(): Promise<'granted' | 'denied' | 'unsupported'> {
    if (typeof window === 'undefined') return 'unsupported';

    if (this.isCapacitorNative()) {
      try {
        const res = await LocalNotifications.requestPermissions();
        return res.display === 'granted' ? 'granted' : 'denied';
      } catch (e) {
        console.warn('Capacitor local notifications permission error:', e);
        return 'denied';
      }
    } else {
      if (!('Notification' in window)) return 'unsupported';
      try {
        const perm = await Notification.requestPermission();
        return perm === 'granted' ? 'granted' : 'denied';
      } catch {
        return 'denied';
      }
    }
  }

  /**
   * Scans upcoming dates (current month + next 12 months) for verified Buddhist Holy Days (ថ្ងៃសីល)
   * and schedules/reschedules local notifications according to settings.
   */
  public async scheduleObservanceReminders(): Promise<void> {
    const settings = settingsStore.get();
    if (!settings.observanceRemindersEnabled) {
      await this.cancelAllObservanceReminders();
      return;
    }

    const perm = await this.checkPermissions();
    if (perm !== 'granted') {
      return; // Cannot schedule without permission
    }

    if (this.isCapacitorNative()) {
      await this.scheduleCapacitorReminders(settings);
    } else {
      // For web PWA / desktop browsers, check permission and log or register foreground timers
      // Note: background push requires server push, but foreground/open tabs can receive web notifications.
    }
  }

  private async scheduleCapacitorReminders(settings: AppSettings): Promise<void> {
    try {
      // First, cancel existing scheduled observance notifications to prevent duplicates or stale schedules
      await this.cancelAllObservanceReminders();

      const notificationsToSchedule: Array<{
        id: number;
        title: string;
        body: string;
        schedule: { at: Date };
        extra: { dateStr: string; type: string };
      }> = [];

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const currentDay = now.getDate();

      // Scan from current date up to 14 months ahead
      const scanDate = new Date(currentYear, currentMonth - 1, currentDay);
      const endDate = new Date(currentYear + 1, currentMonth - 1, currentDay);

      while (scanDate <= endDate) {
        const y = scanDate.getFullYear();
        const m = scanDate.getMonth() + 1;
        const d = scanDate.getDate();

        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const khResult = getKhmerDate(y, m, d);

        if (khResult.isVerified && khResult.khmer.isBuddhistHolyDay) {
          const lunarStr = khResult.khmer.lunarDayStringKh + ' ខែ' + khResult.khmer.monthNameKh;

          // 1. One day before reminder
          if (settings.remindOneDayBefore) {
            const [h1, min1] = settings.remindOneDayBeforeTime.split(':').map(Number);
            const prevDate = new Date(scanDate);
            prevDate.setDate(prevDate.getDate() - 1);
            prevDate.setHours(h1 || 19, min1 || 0, 0, 0);

            if (prevDate > now) {
              const uniqueId = parseInt(`${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}1`, 10);
              notificationsToSchedule.push({
                id: uniqueId,
                title: 'ស្អែកជាថ្ងៃសីល 🙏',
                body: `សូមជ្រាបថា ស្អែក (${lunarStr}) ជាថ្ងៃសីល។ សូមពិនិត្យកាលបរិច្ឆេទ និងត្រៀមខ្លួនសម្រាប់ការធ្វើបុណ្យ។`,
                schedule: { at: prevDate },
                extra: { dateStr, type: 'one_day_before' },
              });
            }
          }

          // 2. On the observance day reminder
          if (settings.remindOnDayOf) {
            const [h2, min2] = settings.remindOnDayOfTime.split(':').map(Number);
            const dayDate = new Date(scanDate);
            dayDate.setHours(h2 || 6, min2 || 0, 0, 0);

            if (dayDate > now) {
              const uniqueId = parseInt(`${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}2`, 10);
              notificationsToSchedule.push({
                id: uniqueId,
                title: 'ថ្ងៃនេះជាថ្ងៃសីល 🙏',
                body: `សូមជ្រាបថា ថ្ងៃនេះ (${lunarStr}) ជាថ្ងៃសីល។ សូមមានសេចក្ដីសុខ ស្ងប់ចិត្ត និងប្រព្រឹត្តអំពើល្អ។`,
                schedule: { at: dayDate },
                extra: { dateStr, type: 'day_of' },
              });
            }
          }
        }

        scanDate.setDate(scanDate.getDate() + 1);
      }

      if (notificationsToSchedule.length > 0) {
        // Schedule in batches of 50 to avoid any platform payload limits
        for (let i = 0; i < notificationsToSchedule.length; i += 50) {
          const batch = notificationsToSchedule.slice(i, i + 50);
          await LocalNotifications.schedule({
            notifications: batch.map((n) => ({
              id: n.id,
              title: n.title,
              body: n.body,
              schedule: n.schedule,
              sound: undefined,
              extra: n.extra,
            })),
          });
        }
      }
    } catch (e) {
      console.warn('Failed to schedule Capacitor observance reminders:', e);
    }
  }

  public async cancelAllObservanceReminders(): Promise<void> {
    if (!this.isCapacitorNative()) return;
    try {
      const pending = await LocalNotifications.getPending();
      if (pending && pending.notifications.length > 0) {
        // Filter notifications that match our observance ID pattern
        const observanceIds = pending.notifications
          .filter((n) => n.extra?.type === 'one_day_before' || n.extra?.type === 'day_of')
          .map((n) => ({ id: n.id }));

        if (observanceIds.length > 0) {
          await LocalNotifications.cancel({ notifications: observanceIds });
        }
      }
    } catch (e) {
      console.warn('Failed to cancel pending observance reminders:', e);
    }
  }

  public async sendTestNotification(): Promise<boolean> {
    const title = 'តេស្តការជូនដំណឹងថ្ងៃសីល (Test)';
    const body = 'សូមអនុមោទនា! ការកំណត់ការជូនដំណឹងថ្ងៃសីលដំណើរការបានត្រឹមត្រូវ។';

    if (this.isCapacitorNative()) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 999999,
              title,
              body,
              schedule: { at: new Date(Date.now() + 1000) }, // 1 second from now
            },
          ],
        });
        return true;
      } catch (e) {
        console.warn('Test notification failed on Capacitor:', e);
        return false;
      }
    } else {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(title, { body, icon: '/pwa-192x192.png' });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }

  /**
   * Finds the next upcoming verified Buddhist observance date starting from today.
   */
  public getNextObservance(): ObservanceReminderInfo | null {
    if (typeof window === 'undefined') return null;

    const now = new Date();
    const scan = new Date(now);

    for (let i = 0; i < 60; i++) {
      const y = scan.getFullYear();
      const m = scan.getMonth() + 1;
      const d = scan.getDate();
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const kh = getKhmerDate(y, m, d);

      if (kh.isVerified && kh.khmer.isBuddhistHolyDay) {
        // If it's today or in the future
        if (scan >= new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
          return {
            dateStr,
            lunarString: kh.khmer.lunarDayStringKh + ' ខែ' + kh.khmer.monthNameKh,
            isHolyDay: true,
            daysUntil: i,
          };
        }
      }
      scan.setDate(scan.getDate() + 1);
    }
    return null;
  }
}

export const observanceNotificationService = new ObservanceNotificationService();
