/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KhmerDateResult } from '../calendar/khmerDateAdapter.ts';
import { HolidayItem } from '../data/holidays.ts';

export async function shareKhmerDate(
  dateResult: KhmerDateResult,
  holidays: HolidayItem[]
): Promise<{ success: boolean; method: 'native' | 'clipboard' | 'download'; error?: string }> {
  const g = dateResult.gregorian;
  const kh = dateResult.khmer;

  const holidayText =
    holidays.length > 0 ? `\n🎉 ពិធីបុណ្យ៖ ${holidays.map((h) => h.nameKh).join(', ')}` : '';
  const holyDayText = kh.isBuddhistHolyDay ? '\n🙏 ថ្ងៃនេះជា «ថ្ងៃសីល»' : '';

  const shareText = `ប្រតិទិនខ្មែរ ប្រូ (Khmer Calendar Pro)
📅 ថ្ងៃ${g.dayOfWeekNameKh} ទី${g.day} ខែ${g.month} ឆ្នាំ${g.year}
🌙 ${kh.formattedFullKh}${holyDayText}${holidayText}`;

  // Try native navigator.share if available
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'កាលបរិច្ឆេទប្រតិទិនខ្មែរ',
        text: shareText,
        url: window.location.href,
      });
      return { success: true, method: 'native' };
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        // User cancelled dialog
        return { success: false, method: 'native', error: 'User cancelled share' };
      }
      // Fall through to clipboard
    }
  }

  // Fallback to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareText);
      return { success: true, method: 'clipboard' };
    } catch (e) {
      return {
        success: false,
        method: 'clipboard',
        error: e instanceof Error ? e.message : 'Clipboard copy failed',
      };
    }
  }

  return { success: false, method: 'clipboard', error: 'ចែករំលែកមិនត្រូវបានគាំទ្រលើឧបករណ៍នេះ' };
}

/**
 * Generates a clean, high-resolution visual card of the selected date using Canvas
 * and triggers a download or image share.
 */
export async function generateDateImageCard(
  dateResult: KhmerDateResult,
  holidays: HolidayItem[]
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // Background gradient: Elegant crimson & deep royal red
  const grad = ctx.createLinearGradient(0, 0, 800, 900);
  grad.addColorStop(0, '#7f1d1d');
  grad.addColorStop(0.5, '#991b1b');
  grad.addColorStop(1, '#450a0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 900);

  // Outer gold borders
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, 752, 852);

  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, 736, 836);

  // Header Title
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 30px "Kantumruy Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ប្រតិទិនខ្មែរ ប្រូ • KHMER CALENDAR PRO', 400, 85);

  // Divider line
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
  ctx.beginPath();
  ctx.moveTo(100, 110);
  ctx.lineTo(700, 110);
  ctx.stroke();

  // Gregorian Day (Large prominent number)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 110px "Outfit", sans-serif';
  ctx.fillText(String(dateResult.gregorian.day), 400, 240);

  // Weekday and Gregorian Month / Year
  ctx.fillStyle = '#fde047';
  ctx.font = '600 32px "Kantumruy Pro", sans-serif';
  ctx.fillText(
    `${dateResult.gregorian.dayOfWeekNameKh} • ${dateResult.gregorian.dayOfWeekNameEn}`,
    400,
    300
  );

  ctx.fillStyle = '#ffffff';
  ctx.font = '24px "Kantumruy Pro", sans-serif';
  const pad = (n: number) => String(n).padStart(2, '0');
  ctx.fillText(
    `${dateResult.gregorian.year}-${pad(dateResult.gregorian.month)}-${pad(dateResult.gregorian.day)}`,
    400,
    345
  );

  // Inner Lunar Card Container
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.roundRect ? ctx.roundRect(60, 380, 680, 340, 20) : ctx.fillRect(60, 380, 680, 340);
  ctx.fill();

  // Lunar Phase Badge
  const kh = dateResult.khmer;
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 44px "Kantumruy Pro", sans-serif';
  ctx.fillText(kh.lunarDayStringKh, 400, 450);

  // Month and Buddhist Era
  ctx.fillStyle = '#ffffff';
  ctx.font = '500 30px "Kantumruy Pro", sans-serif';
  ctx.fillText(`ខែ${kh.monthNameKh} (${kh.monthNameEn})`, 400, 505);

  ctx.fillStyle = '#fde047';
  ctx.font = '26px "Kantumruy Pro", sans-serif';
  ctx.fillText(
    `ឆ្នាំ${kh.animalYearNameKh} ${kh.animalEmoji} ${kh.sakNameKh} • ព.ស. ${kh.beYear}`,
    400,
    555
  );

  // Holy day / Holiday status
  let currentY = 620;
  if (kh.isBuddhistHolyDay) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 28px "Kantumruy Pro", sans-serif';
    ctx.fillText('🙏 ថ្ងៃនេះជាថ្ងៃសីល (Buddhist Holy Day)', 400, currentY);
    currentY += 45;
  }

  if (holidays.length > 0) {
    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 24px "Kantumruy Pro", sans-serif';
    ctx.fillText(`🎉 ${holidays[0].nameKh}`, 400, currentY);
  }

  // Footer Branding
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '18px "Kantumruy Pro", sans-serif';
  ctx.fillText('ត្រឹមត្រូវតាមក្បួនចន្ទគតិខ្មែរ • Verified Cambodian Lunar Calendar', 400, 835);

  return canvas.toDataURL('image/png');
}
