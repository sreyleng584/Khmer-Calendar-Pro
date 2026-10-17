/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Download } from 'lucide-react';

interface Props {
  lang: 'km' | 'en';
}

/**
 * PWA in-app installation trigger button.
 * Strictly complies with standards:
 * - Hidden if already installed in standalone mode or running in Capacitor native Android.
 * - Hidden if the browser does not support or has not triggered an actual programmatic installation prompt.
 * - Displays only when an actual installation can be performed.
 */
export const PWAInstallButton: React.FC<Props> = ({ lang }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Suppress button if already installed, or if programmatic installation cannot be performed
  if (isInstalled || !isInstallable) {
    return null;
  }

  const labelText = lang === 'km' ? 'ដំឡើង' : 'Install';

  return (
    <button
      onClick={install}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-semibold shadow-xs transition"
      title={lang === 'km' ? 'ដំឡើង Khmer Calendar Pro លើអេក្រង់ដើម' : 'Install Khmer Calendar Pro to Home Screen'}
      aria-label={lang === 'km' ? 'ដំឡើងកម្មវិធី' : 'Install App'}
    >
      <Download className="w-3.5 h-3.5" />
      <span>{labelText}</span>
    </button>
  );
};
