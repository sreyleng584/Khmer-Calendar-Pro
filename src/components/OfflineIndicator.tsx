/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';
import { WifiOff } from 'lucide-react';

interface Props {
  lang: 'km' | 'en';
}

export const OfflineIndicator: React.FC<Props> = ({ lang }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-stone-900/90 text-stone-100 dark:bg-stone-100/90 dark:text-stone-900 px-4 py-2 text-xs font-medium shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-2 duration-300"
    >
      <WifiOff className="w-4 h-4 text-amber-500 animate-pulse" />
      <span>
        {lang === 'km'
          ? 'របៀបក្រៅបណ្តាញ (Offline) — កំពុងប្រើប្រាស់ទិន្នន័យក្នុងឧបករណ៍'
          : 'Offline Mode — Operating seamlessly from local storage'}
      </span>
    </div>
  );
};
