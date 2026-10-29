import { AppNotification } from '../types';

export class NotificationService {
  // Check if browser supports notifications
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  // Get current permission status
  public static getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  // Request browser notification permission
  public static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  // Send a real system notification if permitted
  public static sendSystemNotification(title: string, options?: NotificationOptions): boolean {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      const defaultOptions: NotificationOptions = {
        icon: '/icon.svg',
        badge: '/icon.svg',
        dir: 'rtl',
        lang: 'ar',
        ...options,
      };

      // If service worker is active, try showNotification
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, defaultOptions);
        });
      } else {
        new Notification(title, defaultOptions);
      }
      return true;
    } catch {
      return false;
    }
  }

  // Helper to format days in Arabic
  public static getDayNameArabic(dayIndex: number): string {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[dayIndex % 7];
  }
}
