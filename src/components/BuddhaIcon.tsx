/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BuddhaIconProps {
  className?: string;
  size?: number | string;
  ariaLabel?: string;
}

/**
 * Dignified, respectful vector silhouette of the meditating Buddha in Dhyana Mudra on a lotus base.
 * Used for marking verified Buddhist Holy Days (ថ្ងៃសីល).
 */
export const BuddhaIcon: React.FC<BuddhaIconProps> = ({
  className = 'w-4 h-4',
  size,
  ariaLabel = 'ថ្ងៃសីល (Buddhist Holy Day)',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Halo / Aura behind head */}
      <circle
        cx="16"
        cy="9.5"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2 1.5"
        opacity="0.8"
      />

      {/* Ushnisha (Spire / Flame wisdom emblem on top of head) */}
      <path
        d="M16 2.5 C15.4 3.8 15.6 5 16 5.5 C16.4 5 16.6 3.8 16 2.5 Z"
      />

      {/* Head and meditative countenance */}
      <path
        d="M16 5.2 C13.8 5.2 12.5 6.7 12.5 8.8 C12.5 10.6 13.5 12 15 12.4 L15 13.2 L17 13.2 L17 12.4 C18.5 12 19.5 10.6 19.5 8.8 C19.5 6.7 18.2 5.2 16 5.2 Z"
      />

      {/* Elongated ears (Mahapurusha laksana) */}
      <path
        d="M12.2 8.2 C11.8 8.2 11.5 8.8 11.5 9.8 C11.5 10.8 11.8 11.2 12.3 11.2 L12.5 10.5 C12.3 10.5 12.2 10 12.2 9.6 C12.2 9.2 12.3 8.7 12.5 8.7 Z"
      />
      <path
        d="M19.8 8.2 C20.2 8.2 20.5 8.8 20.5 9.8 C20.5 10.8 20.2 11.2 19.7 11.2 L19.5 10.5 C19.7 10.5 19.8 10 19.8 9.6 C19.8 9.2 19.7 8.7 19.5 8.7 Z"
      />

      {/* Shoulders and monastic robe drape (Civara) */}
      <path
        d="M15 13.2 C12.5 13.5 9 15 8 18 C7.5 19.5 8 22 9.5 23 L22.5 23 C24 22 24.5 19.5 24 18 C23 15 19.5 13.5 17 13.2 Z"
      />

      {/* Hands in Dhyana Mudra (Meditative lap posture) */}
      <ellipse cx="16" cy="22.2" rx="3.2" ry="1.2" />

      {/* Crossed legs in Padmasana (Full Lotus) */}
      <path
        d="M6 24 C5.5 24.8 6.5 26.5 9 26.8 C11.5 27 14 26.5 16 26.5 C18 26.5 20.5 27 23 26.8 C25.5 26.5 26.5 24.8 26 24 C24.5 24.5 21 24.8 16 24.8 C11 24.8 7.5 24.5 6 24 Z"
      />

      {/* Lotus throne petals base (Palanka / Padmapitha) */}
      <path
        d="M5 28 C7 29.5 11 30 16 30 C21 30 25 29.5 27 28 C25 27.2 21 27.5 16 27.5 C11 27.5 7 27.2 5 28 Z"
        opacity="0.9"
      />
      <path
        d="M7 29.5 C10 30.8 13 31.2 16 31.2 C19 31.2 22 30.8 25 29.5 C22 29 19 29.2 16 29.2 C13 29.2 10 29 7 29.5 Z"
        opacity="0.7"
      />
    </svg>
  );
};
