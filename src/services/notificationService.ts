/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NotificationStatus {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
}

class NotificationService {
  public getStatus(): NotificationStatus {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return { isSupported: false, permission: 'unsupported' };
    }
    return {
      isSupported: true,
      permission: Notification.permission,
    };
  }

  public async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.warn('Error requesting notification permission', e);
      return Notification.permission;
    }
  }

  public sendNotification(
    title: string,
    options?: {
      body?: string;
      icon?: string;
      tag?: string;
      requireInteraction?: boolean;
    }
  ): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: options?.body,
          icon: options?.icon || '/pwa-192x192.png',
          tag: options?.tag,
        });
        return true;
      } catch (e) {
        console.warn('Failed to dispatch notification', e);
        return false;
      }
    }

    return false;
  }
}

export const notificationService = new NotificationService();
