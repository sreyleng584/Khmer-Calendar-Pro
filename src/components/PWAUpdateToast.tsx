/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, CheckCircle2 } from 'lucide-react';

interface Props {
  lang: 'km' | 'en';
}

/**
 * PWA safe update notification component.
 * Prompts user when a new version of the app assets is ready,
 * and allows safe activation without disrupting local user events or settings.
 */
export const PWAUpdateToast: React.FC<Props> = ({ lang }) => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (r) {
        // Check for updates periodically every hour
        setInterval(async () => {
          if (!(!r.installing && navigator)) return;
          if ('onLine' in navigator && !navigator.onLine) return;
          try {
            const resp = await fetch(swUrl, {
              cache: 'no-store',
              headers: {
                cache: 'no-store',
                'cache-control': 'no-cache',
              },
            });
            if (resp?.status === 200) await r.update();
          } catch {
            // Ignore offline fetch errors
          }
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('PWA Service Worker registration error:', error);
    },
  });

  const handleUpdate = async () => {
    await updateServiceWorker(true);
  };

  if (offlineReady) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl bg-emerald-900/95 text-emerald-100 dark:bg-emerald-950/95 dark:text-emerald-200 p-3.5 shadow-2xl border border-emerald-700/60 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        <div className="flex-1 text-xs">
          <p className="font-semibold">
            {lang === 'km' ? 'កម្មវិធីរួចរាល់សម្រាប់ដំណើរការក្រៅបណ្តាញ' : 'App ready to work offline'}
          </p>
        </div>
        <button
          onClick={() => setOfflineReady(false)}
          className="text-emerald-300 hover:text-white p-1"
          aria-label="បិទ"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (needRefresh) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl bg-stone-900/95 text-stone-100 dark:bg-stone-100/95 dark:text-stone-900 p-4 shadow-2xl border border-amber-500/50 backdrop-blur-md flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <RefreshCw className="w-5 h-5 text-amber-500 animate-spin shrink-0 mt-0.5" />
        <div className="flex-1 text-xs space-y-1">
          <p className="font-bold text-amber-400 dark:text-amber-600">
            {lang === 'km' ? 'មានកំណែថ្មីនៃកម្មវិធី (App Update)' : 'New Version Available'}
          </p>
          <p className="text-stone-300 dark:text-stone-600 leading-relaxed">
            {lang === 'km'
              ? 'ទិន្នន័យ និងមុខងារថ្មីត្រូវបានទាញយក។ ចុច «ធ្វើបច្ចុប្បន្នភាព» ដើម្បីផ្ទុកកំណែថ្មី (ទិន្នន័យកត់ត្រារបស់អ្នកនឹងត្រូវបានរក្សាទុក)។'
              : 'A new release is ready. Click update to refresh (your saved events will remain safe).'}
          </p>
          <div className="flex items-center gap-2 pt-1.5">
            <button
              onClick={handleUpdate}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs transition active:scale-95"
            >
              {lang === 'km' ? 'ធ្វើបច្ចុប្បន្នភាព' : 'Update Now'}
            </button>
            <button
              onClick={() => setNeedRefresh(false)}
              className="px-2.5 py-1.5 rounded-xl text-stone-400 hover:text-stone-200 dark:hover:text-stone-800 transition"
            >
              {lang === 'km' ? 'ពេលក្រោយ' : 'Later'}
            </button>
          </div>
        </div>
        <button
          onClick={() => setNeedRefresh(false)}
          className="text-stone-400 hover:text-white dark:hover:text-black p-0.5"
          aria-label="បិទ"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return null;
};
