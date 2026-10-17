/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import momentkh from '@thyrith/momentkh';

export const MoonPhase = momentkh.MoonPhase;
export const MonthIndex = momentkh.MonthIndex;
export const AnimalYear = momentkh.AnimalYear;
export const Sak = momentkh.Sak;
export const DayOfWeek = momentkh.DayOfWeek;

type MoonPhaseType = typeof momentkh.MoonPhase[keyof typeof momentkh.MoonPhase];
type MonthIndexType = typeof momentkh.MonthIndex[keyof typeof momentkh.MonthIndex];
type AnimalYearType = typeof momentkh.AnimalYear[keyof typeof momentkh.AnimalYear];
type SakType = typeof momentkh.Sak[keyof typeof momentkh.Sak];

export interface KhmerDateResult {
  gregorian: {
    year: number;
    month: number; // 1-12
    day: number; // 1-31
    dayOfWeek: number; // 0 (Sun) - 6 (Sat)
    dayOfWeekNameKh: string;
    dayOfWeekNameEn: string;
  };
  khmer: {
    day: number; // 1 - 15
    moonPhase: MoonPhaseType; // 0 = Waxing (កើត), 1 = Waning (រោច)
    moonPhaseNameKh: string;
    lunarDayStringKh: string; // e.g. "៤កើត", "១៥កើត", "៨រោច"
    monthIndex: MonthIndexType;
    monthNameKh: string;
    monthNameEn: string;
    isLeapMonth: boolean; // Pathamasadh or Tutiyasadh
    beYear: number; // Buddhist Era (ព.ស.)
    jsYear: number; // Chula Sakarat (ច.ស.)
    animalYearIndex: AnimalYearType;
    animalYearNameKh: string; // ជូត, ឆ្លូវ, ខាល...
    animalYearNameEn: string; // Rat, Ox, Tiger...
    animalEmoji: string;
    sakIndex: SakType;
    sakNameKh: string; // ឯកស័ក, ទោស័ក...
    isBuddhistHolyDay: boolean; // ថ្ងៃសីល (8th, 15th waxing / 8th, 14th/15th waning)
    buddhistHolyDayType?: '8_waxing' | '15_waxing' | '8_waning' | '15_waning';
    formattedFullKh: string;
  };
  isVerified: boolean;
  notes?: string;
}

export interface NewYearDetail {
  year: number;
  sangkranDate: string; // YYYY-MM-DD
  sangkranTime: string; // HH:mm
  totalDays: number; // 3 or 4 days
  dayNamesKh: string[];
  devadaNameKh: string;
  devadaVehicleKh: string;
  animalYearKh: string;
  sakKh: string;
  beYear: number;
}

// Khmer numeral conversion lookup
const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

export function toKhmerNumerals(num: number | string): string {
  return String(num).replace(/[0-9]/g, (digit) => KHMER_DIGITS[parseInt(digit, 10)]);
}

export function fromKhmerNumerals(str: string): string {
  const map: Record<string, string> = {
    '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4',
    '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9',
  };
  return str.replace(/[០-៩]/g, (k) => map[k] || k);
}

export const KHMER_WEEKDAYS_SHORT = ['អា', 'ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស'];
export const KHMER_WEEKDAYS_LONG = [
  'ថ្ងៃអាទិត្យ',
  'ថ្ងៃចន្ទ',
  'ថ្ងៃអង្គារ',
  'ថ្ងៃពុធ',
  'ថ្ងៃព្រហស្បតិ៍',
  'ថ្ងៃសុក្រ',
  'ថ្ងៃសៅរ៍',
];

export const ENGLISH_WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const KHMER_MONTH_NAMES = [
  'មិគសិរ', 'បុស្ស', 'មាឃ', 'ផល្គុន', 'ចេត្រ', 'ពិសាខ',
  'ជេស្ឋ', 'អាសាឍ', 'ស្រាពណ៍', 'ភទ្របទ', 'អស្សុជ', 'កត្ដិក',
  'បឋមាសាឍ', 'ទុតិយាសាឍ',
];

export const ENGLISH_LUNAR_MONTHS = [
  'Migasir', 'Boss', 'Meak', 'Phalkun', 'Cheit', 'Pisakh',
  'Jesth', 'Asadh', 'Srap', 'Phatrabot', 'Assoch', 'Kadeuk',
  'Pathamasadh (1st Asadh)', 'Tutiyasadh (2nd Asadh)',
];

export const ANIMAL_YEARS_KH = [
  'ជូត', 'ឆ្លូវ', 'ខាល', 'ថោះ', 'រោង', 'ម្សាញ់',
  'មមី', 'មមែ', 'វក', 'រកា', 'ច', 'កុរ',
];

export const ANIMAL_YEARS_EN = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
];

export const ANIMAL_EMOJIS = [
  '🐀', '🐂', '🐅', '🐇', '🐉', '🐍',
  '🐎', '🐐', '🐒', '🐓', '🐕', '🐖',
];

export const SAK_NAMES_KH = [
  'សំរឹទ្ធិស័ក', 'ឯកស័ក', 'ទោស័ក', 'ត្រីស័ក', 'ចត្វាស័ក',
  'បញ្ចស័ក', 'ឆស័ក', 'សប្តស័ក', 'អដ្ឋស័ក', 'នព្វស័ក',
];

/**
 * Obtains today's date in Cambodia local timezone (Asia/Phnom_Penh, UTC+7)
 * to avoid off-by-one errors from UTC or device timezone shifts.
 */
export function getCambodiaToday(): { year: number; month: number; day: number; dateString: string } {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Phnom_Penh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.format(new Date()).split('-').map(Number);
    return {
      year: parts[0],
      month: parts[1],
      day: parts[2],
      dateString: `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`,
    };
  } catch {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    return {
      year: y,
      month: m,
      day: d,
      dateString: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    };
  }
}

/**
 * Checks if a lunar date is a Buddhist Holy Day (ថ្ងៃសីល).
 * Traditional Cambodian rules:
 * - 8th of Waxing (៨កើត)
 * - 15th of Waxing / Full Moon (១៥កើត)
 * - 8th of Waning (៨រោច)
 * - End of Month / New Moon (ដាច់ខែ): 14th waning in 29-day months, or 15th waning in 30-day months.
 */
export function checkIsBuddhistHolyDay(
  lunarDay: number,
  moonPhase: MoonPhaseType,
  gregorianYear?: number,
  gregorianMonth?: number,
  gregorianDay?: number
): {
  isHolyDay: boolean;
  type?: '8_waxing' | '15_waxing' | '8_waning' | '15_waning';
} {
  if (moonPhase === MoonPhase.Waxing) {
    if (lunarDay === 8) return { isHolyDay: true, type: '8_waxing' };
    if (lunarDay === 15) return { isHolyDay: true, type: '15_waxing' };
  } else {
    if (lunarDay === 8) return { isHolyDay: true, type: '8_waning' };
    if (lunarDay === 15) return { isHolyDay: true, type: '15_waning' };
    if (lunarDay === 14) {
      if (
        gregorianYear !== undefined &&
        gregorianMonth !== undefined &&
        gregorianDay !== undefined
      ) {
        try {
          const nextDate = new Date(gregorianYear, gregorianMonth - 1, gregorianDay + 1);
          const nextRes = momentkh.fromGregorian(
            nextDate.getFullYear(),
            nextDate.getMonth() + 1,
            nextDate.getDate()
          );
          if (nextRes.khmer.moonPhase === MoonPhase.Waxing && nextRes.khmer.day === 1) {
            return { isHolyDay: true, type: '15_waning' }; // Genuine ដាច់ខែ in 29-day month
          }
        } catch {
          // Keep false if check fails
        }
      }
    }
  }
  return { isHolyDay: false };
}

/**
 * Main adapter function to convert Gregorian Date to verified Khmer Lunar Date.
 * Handles boundary conditions, timezone safety, and proper labeling.
 */
export function getKhmerDate(year: number, month: number, day: number): KhmerDateResult {
  try {
    // Validate bounds
    if (year < 1900 || year > 2100) {
      return createFallbackDate(year, month, day, 'ឆ្នាំក្រៅពីដែនកំណត់ (Supported: 1900 - 2100)');
    }

    const conversion = momentkh.fromGregorian(year, month, day);
    const kh = conversion.khmer;
    const g = conversion.gregorian;

    const lunarDayStr = `${toKhmerNumerals(kh.day)}${kh.moonPhaseName}`;
    const holyDayInfo = checkIsBuddhistHolyDay(kh.day, kh.moonPhase, year, month, day);
    const isLeapMonth = kh.monthIndex === MonthIndex.Pathamasadh || kh.monthIndex === MonthIndex.Tutiyasadh;

    const formattedFull = momentkh.format(conversion);

    return {
      gregorian: {
        year: g.year,
        month: g.month,
        day: g.day,
        dayOfWeek: g.dayOfWeek,
        dayOfWeekNameKh: KHMER_WEEKDAYS_LONG[g.dayOfWeek] || '',
        dayOfWeekNameEn: ENGLISH_WEEKDAYS[g.dayOfWeek] || '',
      },
      khmer: {
        day: kh.day,
        moonPhase: kh.moonPhase,
        moonPhaseNameKh: kh.moonPhaseName,
        lunarDayStringKh: lunarDayStr,
        monthIndex: kh.monthIndex,
        monthNameKh: kh.monthName,
        monthNameEn: ENGLISH_LUNAR_MONTHS[kh.monthIndex] || kh.monthName,
        isLeapMonth,
        beYear: kh.beYear,
        jsYear: kh.jsYear,
        animalYearIndex: kh.animalYear,
        animalYearNameKh: kh.animalYearName,
        animalYearNameEn: ANIMAL_YEARS_EN[kh.animalYear] || '',
        animalEmoji: ANIMAL_EMOJIS[kh.animalYear] || '🐉',
        sakIndex: kh.sak,
        sakNameKh: kh.sakName,
        isBuddhistHolyDay: holyDayInfo.isHolyDay,
        buddhistHolyDayType: holyDayInfo.type,
        formattedFullKh: formattedFull,
      },
      isVerified: true,
    };
  } catch (error) {
    console.error('Error calculating Khmer date:', error);
    return createFallbackDate(year, month, day, error instanceof Error ? error.message : 'Calculation error');
  }
}

function createFallbackDate(year: number, month: number, day: number, note: string): KhmerDateResult {
  const d = new Date(year, month - 1, day);
  const dow = d.getDay();
  return {
    gregorian: {
      year,
      month,
      day,
      dayOfWeek: dow,
      dayOfWeekNameKh: KHMER_WEEKDAYS_LONG[dow],
      dayOfWeekNameEn: ENGLISH_WEEKDAYS[dow],
    },
    khmer: {
      day: 1,
      moonPhase: MoonPhase.Waxing,
      moonPhaseNameKh: 'កើត',
      lunarDayStringKh: '១កើត',
      monthIndex: MonthIndex.Cheit,
      monthNameKh: 'មិនទាន់ផ្ទៀងផ្ទាត់',
      monthNameEn: 'Unverified',
      isLeapMonth: false,
      beYear: year + 544,
      jsYear: 0,
      animalYearIndex: AnimalYear.Chhut,
      animalYearNameKh: 'មិនទាន់ផ្ទៀងផ្ទាត់',
      animalYearNameEn: 'Unverified',
      animalEmoji: '📅',
      sakIndex: Sak.SamridhiSak,
      sakNameKh: 'មិនទាន់ផ្ទៀងផ្ទាត់',
      isBuddhistHolyDay: false,
      formattedFullKh: 'កាលបរិច្ឆេទមិនទាន់ផ្ទៀងផ្ទាត់',
    },
    isVerified: false,
    notes: note,
  };
}

/**
 * Returns Khmer New Year detailed astrological and timing information for a given Gregorian year.
 */
export function getKhmerNewYearDetail(ceYear: number): NewYearDetail {
  const nyInfo = momentkh.getNewYear(ceYear);
  const pad = (n: number) => String(n).padStart(2, '0');
  const sangkranDate = `${nyInfo.year}-${pad(nyInfo.month)}-${pad(nyInfo.day)}`;
  const sangkranTime = `${pad(nyInfo.hour)}:${pad(nyInfo.minute)}`;

  // Determine Devada name based on weekday of Sangkran
  const sangkranD = new Date(nyInfo.year, nyInfo.month - 1, nyInfo.day);
  const dow = sangkranD.getDay();

  const devadaTable: Record<number, { name: string; vehicle: string }> = {
    0: { name: 'ទុង្សាទេវី (Tungsa Devi)', vehicle: 'គ្រុឌ (Garuda)' },
    1: { name: 'គោរាគទេវី (Koraka Devi)', vehicle: 'ខ្លា (Tiger)' },
    2: { name: 'រាក្យសទេវី (Rakyasa Devi)', vehicle: 'ជ្រូកព្រៃ (Boar)' },
    3: { name: 'មណ្ឌាទេវី (Mondha Devi)', vehicle: 'លា (Donkey)' },
    4: { name: 'កិរិណីទេវី (Kirinee Devi)', vehicle: 'ដំរី (Elephant)' },
    5: { name: 'កិមិរាទេវី (Kimira Devi)', vehicle: 'ក្របី (Buffalo)' },
    6: { name: 'មហោទរាទេវី (Mohorthera Devi)', vehicle: 'ក្ងោក (Peacock)' },
  };

  const devada = devadaTable[dow] || { name: 'ទេពធីតាឆ្នាំថ្មី', vehicle: 'សត្វជំនិះ' };

  // The incoming New Year animal and Sak take effect on Lerng Sak (ឡើងស័ក - 3rd/4th day)
  const lerngSakD = new Date(nyInfo.year, nyInfo.month - 1, nyInfo.day + 3);
  const lerngSakConversion = momentkh.fromGregorian(
    lerngSakD.getFullYear(),
    lerngSakD.getMonth() + 1,
    lerngSakD.getDate()
  );
  const animalYearKh = lerngSakConversion.khmer.animalYearName;
  const sakKh = lerngSakConversion.khmer.sakName;
  const beYear = lerngSakConversion.khmer.beYear;

  const isFourDayNewYear = nyInfo.day === 13;
  const totalDays = isFourDayNewYear ? 4 : 3;
  const dayNamesKh = isFourDayNewYear
    ? ['ថ្ងៃមហាសង្ក្រាន្ត', 'ថ្ងៃវារវនបត', 'ថ្ងៃវារវនបត (ថ្ងៃទី២)', 'ថ្ងៃឡើងស័ក']
    : ['ថ្ងៃមហាសង្ក្រាន្ត', 'ថ្ងៃវារវនបត', 'ថ្ងៃឡើងស័ក'];

  return {
    year: ceYear,
    sangkranDate,
    sangkranTime,
    totalDays,
    dayNamesKh,
    devadaNameKh: devada.name,
    devadaVehicleKh: devada.vehicle,
    animalYearKh,
    sakKh,
    beYear,
  };
}

/**
 * Helper to get days in a Gregorian month.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Helper to get first weekday of a Gregorian month (0 = Sun, 6 = Sat).
 */
export function getFirstWeekdayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

/**
 * Calculates next month and year transition handling December -> January boundary.
 */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}

/**
 * Calculates previous month and year transition handling January -> December boundary.
 */
export function getPrevMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

