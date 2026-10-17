/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HolidayCategory = 'PUBLIC_HOLIDAY' | 'BUDDHIST_OBSERVANCE' | 'CULTURAL_EVENT';
export type VerificationStatus = 'VERIFIED' | 'PROVISIONAL' | 'UNVERIFIED';

export interface HolidayItem {
  id: string;
  nameKh: string;
  nameEn: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD (same as startDate for single-day)
  category: HolidayCategory;
  isPublicHoliday: boolean; // Official paid leave day
  year: number;
  sourceUrl: string;
  sourceAuthority: string;
  verificationStatus: VerificationStatus;
  descriptionKh: string;
  descriptionEn: string;
  lunarDateKh?: string;
}

/**
 * Cambodian Official Public Holidays and Buddhist Observances Dataset.
 * Sources:
 * - Ministry of Economy and Finance (MEF): https://mef.gov.kh/public-holiday-2026/
 * - National Bank of Cambodia (NBC): https://www.nbc.gov.kh/english/news_and_events/official_holiday.php
 * - Royal Government of Cambodia Sub-decrees (អនុក្រឹត្យស្តីពីការឈប់សម្រាកការងារ)
 */
export const CAMBODIA_HOLIDAYS: HolidayItem[] = [
  // --- 2025 VERIFIED HOLIDAYS ---
  {
    id: 'kh-2025-01-01',
    nameKh: 'ទិវាចូលឆ្នាំសកល',
    nameEn: 'International New Year Day',
    startDate: '2025-01-01',
    endDate: '2025-01-01',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'ការប្រារព្ធទិវាចូលឆ្នាំសកលជាផ្លូវការទូទាំងព្រះរាជាណាចក្រកម្ពុជា។',
    descriptionEn: 'Celebration of the first day of the Gregorian New Year.',
  },
  {
    id: 'kh-2025-01-07',
    nameKh: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍',
    nameEn: 'Victory over Genocide Day',
    startDate: '2025-01-07',
    endDate: '2025-01-07',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'រំលឹកខួបនៃទិវាជ័យជម្នះជាប្រវត្តិសាស្ត្ររំដោះប្រទេសពីរបបប្រល័យពូជសាសន៍ប៉ុលពត។',
    descriptionEn: 'Commemoration of the fall of the Khmer Rouge regime in 1979.',
  },
  {
    id: 'kh-2025-02-12',
    nameKh: 'ពិធីបុណ្យមាឃបូជា',
    nameEn: 'Meak Bochea Day',
    startDate: '2025-02-12',
    endDate: '2025-02-12',
    category: 'BUDDHIST_OBSERVANCE',
    isPublicHoliday: false,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Ministry of Cults and Religion',
    verificationStatus: 'VERIFIED',
    lunarDateKh: '១៥កើត ខែមាឃ',
    descriptionKh: 'រំលឹកដល់កាលដែលព្រះសម្មាសម្ពុទ្ធទ្រង់សម្តែង «ឱវាទបាតិមោក្ខ» ដល់ព្រះភិក្ខុសង្ឃ ១,២៥០ អង្គ។',
    descriptionEn: 'Commemorates the spontaneous gathering of 1,250 monks before the Buddha.',
  },
  {
    id: 'kh-2025-03-08',
    nameKh: 'ទិវាអន្តរជាតិនារី',
    nameEn: 'International Women\'s Day',
    startDate: '2025-03-08',
    endDate: '2025-03-08',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'លើកកម្ពស់សិទ្ធិ សមភាពយេនឌ័រ និងតម្លៃរបស់ស្ត្រីនៅក្នុងសង្គមជាតិ។',
    descriptionEn: 'Celebration of women\'s achievements and advocacy for gender equality.',
  },
  {
    id: 'kh-2025-04-14',
    nameKh: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ',
    nameEn: 'Khmer New Year Day (Day 1 - Moha Sangkran)',
    startDate: '2025-04-14',
    endDate: '2025-04-16',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'បុណ្យប្រពៃណីជាតិដ៏ធំបំផុតរបស់ប្រជាជនកម្ពុជា រយៈពេល ៣ ថ្ងៃ (មហាសង្ក្រាន្ត វារវនបត ឡើងស័ក)។',
    descriptionEn: 'The traditional Khmer Solar New Year celebration spanning three days.',
  },
  {
    id: 'kh-2025-05-01',
    nameKh: 'ទិវាពលកម្មអន្តរជាតិ',
    nameEn: 'International Labor Day',
    startDate: '2025-05-01',
    endDate: '2025-05-01',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'ទិវាឧទ្ទិសដល់សិទ្ធិ និងផលប្រយោជន៍របស់កម្មករ និយោជិតជុំវិញពិភពលោក។',
    descriptionEn: 'Global recognition of workers\' and laborers\' rights.',
  },
  {
    id: 'kh-2025-05-11',
    nameKh: 'ពិធីបុណ្យវិសាខបូជា',
    nameEn: 'Visak Bochea Day',
    startDate: '2025-05-11',
    endDate: '2025-05-11',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    lunarDateKh: '១៥កើត ខែពិសាខ',
    descriptionKh: 'ទិវាបុណ្យសាសនាដ៏ឧត្តុង្គឧត្តម រំលឹកខួបនៃ ព្រះប្រសូត ត្រាស់ដឹង និងបរិនិព្វាន របស់ព្រះសម្មាសម្ពុទ្ធ។',
    descriptionEn: 'Celebration of the Birth, Enlightenment, and Parinirvana of the Buddha.',
  },
  {
    id: 'kh-2025-05-14',
    nameKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណា ព្រះបាទសម្តេច ព្រះបរមនាថ នរោត្តម សីហមុនី',
    nameEn: 'King Norodom Sihamoni\'s Birthday',
    startDate: '2025-05-14',
    endDate: '2025-05-14',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្មាយុគម្រប់ ៧២ ព្រះវស្សារបស់ព្រះមហាក្សត្រនៃកម្ពុជា។',
    descriptionEn: 'Official national birthday celebration of HM King Norodom Sihamoni of Cambodia.',
  },
  {
    id: 'kh-2025-05-15',
    nameKh: 'ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល',
    nameEn: 'Royal Plowing Ceremony',
    startDate: '2025-05-15',
    endDate: '2025-05-15',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    lunarDateKh: '៤រោច ខែពិសាខ',
    descriptionKh: 'ព្រះរាជពិធីបុរាណប្រកាសការចាប់ផ្តើមរដូវធ្វើស្រែចម្ការ និងទស្សន៍ទាយភោគផលកសិកម្ម។',
    descriptionEn: 'Ancient royal ceremony marking the start of the rice-planting season.',
  },
  {
    id: 'kh-2025-06-18',
    nameKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី នរោត្តម មុនិនាថ សីហនុ',
    nameEn: 'Queen Mother Norodom Monineath Sihanouk\'s Birthday',
    startDate: '2025-06-18',
    endDate: '2025-06-18',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្មាយុ សម្តេចព្រះវររាជមាតាជាតិខ្មែរ។',
    descriptionEn: 'Official celebration of the birthday of HM Queen Mother Norodom Monineath Sihanouk.',
  },
  {
    id: 'kh-2025-09-21',
    nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ',
    nameEn: 'Pchum Ben Festival (Ancestors\' Day)',
    startDate: '2025-09-21',
    endDate: '2025-09-23',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    lunarDateKh: '១៤រោច - ១រោច ខែភទ្របទ',
    descriptionKh: 'បុណ្យសែនដូនតារំលឹកវិញ្ញាណក្ខន្ធបុព្វការីជនរយៈពេល ៣ ថ្ងៃ (ភ្ជុំបិណ្ឌ)។',
    descriptionEn: 'Sacred 3-day holiday dedicated to remembering and paying homage to ancestors.',
  },
  {
    id: 'kh-2025-09-24',
    nameKh: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ',
    nameEn: 'Constitutional Day',
    startDate: '2025-09-24',
    endDate: '2025-09-24',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'រំលឹកខួបនៃការប្រកាសឱ្យប្រើប្រាស់រដ្ឋធម្មនុញ្ញនៃព្រះរាជាណាចក្រកម្ពុជានៅឆ្នាំ ១៩៩៣។',
    descriptionEn: 'Commemoration of the promulgation of the Constitution of Cambodia in 1993.',
  },
  {
    id: 'kh-2025-10-15',
    nameKh: 'ទិវារំលឹកខួបនៃការយាងសោយព្រះទិវង្គត ព្រះបរមរតនកោដ្ឋ',
    nameEn: 'Commemoration Day of the King Father Norodom Sihanouk',
    startDate: '2025-10-15',
    endDate: '2025-10-15',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'ទិវារំលឹកវិញ្ញាណក្ខន្ធ ព្រះករុណា ព្រះបាទសម្តេច ព្រះនរោត្តម សីហនុ ព្រះបរមរតនកោដ្ឋ។',
    descriptionEn: 'Memorial honoring the late King Father Norodom Sihanouk.',
  },
  {
    id: 'kh-2025-10-29',
    nameKh: 'ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ',
    nameEn: 'Coronation Day of King Norodom Sihamoni',
    startDate: '2025-10-29',
    endDate: '2025-10-29',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'រំលឹកខួបនៃការឡើងគ្រងព្រះបរមរាជសម្បត្តិនៃព្រះករុណា ព្រះបាទសម្តេច ព្រះបរមនាថ នរោត្តម សីហមុនី នៅឆ្នាំ ២០០៤។',
    descriptionEn: 'Celebrates the accession to the throne of HM King Norodom Sihamoni in 2004.',
  },
  {
    id: 'kh-2025-11-04',
    nameKh: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក',
    nameEn: 'Water and Moon Festival',
    startDate: '2025-11-04',
    endDate: '2025-11-06',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    lunarDateKh: '១៤កើត - ១រោច ខែកត្ដិក',
    descriptionKh: 'ព្រះរាជពិធីប្រណាំងទូកងនៅទន្លេសាប រំលឹកគុណកងទ័ពជើងទឹកខ្មែរសម័យអង្គរ និងការប្តូរទិសចរន្តទឹក។',
    descriptionEn: 'Spectacular 3-day boat racing on the Tonle Sap river, illuminated floats, and moon salutation.',
  },
  {
    id: 'kh-2025-11-09',
    nameKh: 'ពិធីបុណ្យឯករាជ្យជាតិ',
    nameEn: 'National Independence Day',
    startDate: '2025-11-09',
    endDate: '2025-11-09',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2025,
    sourceUrl: 'https://www.nbc.gov.kh/english/news_and_events/official_holiday.php',
    sourceAuthority: 'Royal Government Sub-Decree / NBC',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'រំលឹកខួបដែលកម្ពុជាទទួលបានឯករាជ្យពេញលេញពីសាធារណរដ្ឋបារាំងនៅថ្ងៃទី ៩ វិច្ឆិកា ឆ្នាំ ១៩៥៣។',
    descriptionEn: 'Commemorates Cambodia\'s declaration of independence from France in 1953.',
  },

  // --- 2026 OFFICIAL VERIFIED HOLIDAYS (MEF / NBC) ---
  {
    id: 'kh-2026-01-01',
    nameKh: 'ទិវាចូលឆ្នាំសកល',
    nameEn: 'International New Year Day',
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'ការប្រារព្ធទិវាចូលឆ្នាំសកលជាផ្លូវការទូទាំងព្រះរាជាណាចក្រកម្ពុជា។',
    descriptionEn: 'Celebration of the first day of the Gregorian New Year.',
  },
  {
    id: 'kh-2026-01-07',
    nameKh: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍',
    nameEn: 'Victory over Genocide Day',
    startDate: '2026-01-07',
    endDate: '2026-01-07',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'រំលឹកខួបនៃទិវាជ័យជម្នះជាប្រវត្តិសាស្ត្ររំដោះប្រទេសពីរបបប្រល័យពូជសាសន៍ប៉ុលពត។',
    descriptionEn: 'Commemoration of the historic victory liberating Cambodia from the Pol Pot regime.',
  },
  {
    id: 'kh-2026-02-02',
    nameKh: 'ពិធីបុណ្យមាឃបូជា',
    nameEn: 'Meak Bochea Day',
    startDate: '2026-02-02',
    endDate: '2026-02-02',
    category: 'BUDDHIST_OBSERVANCE',
    isPublicHoliday: false,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Cults and Religion',
    verificationStatus: 'VERIFIED',
    lunarDateKh: '១៥កើត ខែមាឃ',
    descriptionKh: 'រំលឹកដល់កាលដែលព្រះសម្មាសម្ពុទ្ធទ្រង់សម្តែងឱវាទបាតិមោក្ខដល់ព្រះសង្ឃ ១,២៥០ អង្គ។',
    descriptionEn: 'Buddhist holy day commemorating the recitation of the Ovada Patimokkha.',
  },
  {
    id: 'kh-2026-03-08',
    nameKh: 'ទិវាអន្តរជាតិនារី',
    nameEn: 'International Women\'s Day',
    startDate: '2026-03-08',
    endDate: '2026-03-08',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'លើកកម្ពស់សិទ្ធិ និងតម្លៃរបស់ស្ត្រីនៅក្នុងការអភិវឌ្ឍសង្គម។',
    descriptionEn: 'Celebrating women\'s achievements and advocating for women\'s rights.',
  },
  {
    id: 'kh-2026-04-14',
    nameKh: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ',
    nameEn: 'Khmer New Year Day (Moha Sangkran)',
    startDate: '2026-04-14',
    endDate: '2026-04-16',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'បុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០ (១៤, ១៥, ១៦ មេសា)។',
    descriptionEn: 'Cambodian Solar New Year 3-day national celebrations (Year of the Horse).',
  },
  {
    id: 'kh-2026-05-01',
    nameKh: 'ទិវាពលកម្មអន្តរជាតិ',
    nameEn: 'International Labor Day',
    startDate: '2026-05-01',
    endDate: '2026-05-01',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'ទិវាអបអរសាទរសិទ្ធិ និងកម្លាំងពលកម្មរបស់ប្រជាពលរដ្ឋទូទាំងពិភពលោក។',
    descriptionEn: 'Celebration of workers\' rights and labor movements.',
  },
  {
    id: 'kh-2026-05-05',
    nameKh: 'ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល',
    nameEn: 'Royal Plowing Ceremony',
    startDate: '2026-05-05',
    endDate: '2026-05-05',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    lunarDateKh: '៤រោច ខែពិសាខ',
    descriptionKh: 'ព្រះរាជពិធីបុរាណប្រកាសបើករដូវវស្សាសម្រាប់កសិករធ្វើស្រែចម្ការ។',
    descriptionEn: 'Traditional royal ceremony predicting the harvest of the farming season.',
  },
  {
    id: 'kh-2026-05-14',
    nameKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណា ព្រះបាទសម្តេច ព្រះបរមនាថ នរោត្តម សីហមុនី',
    nameEn: 'King Norodom Sihamoni\'s Birthday',
    startDate: '2026-05-14',
    endDate: '2026-05-14',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្មាយុគម្រប់ ៧៣ ព្រះវស្សារបស់ព្រះមហាក្សត្រនៃកម្ពុជា។',
    descriptionEn: 'Official national holiday honoring the birthday of HM King Norodom Sihamoni.',
  },
  {
    id: 'kh-2026-05-31',
    nameKh: 'ពិធីបុណ្យវិសាខបូជា',
    nameEn: 'Visak Bochea Day',
    startDate: '2026-05-31',
    endDate: '2026-05-31',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    lunarDateKh: '១៥កើត ខែពិសាខ',
    descriptionKh: 'ទិវាបុណ្យសាសនាដ៏ឧត្តុង្គឧត្តម រំលឹកខួបនៃ ព្រះប្រសូត ត្រាស់ដឹង និងបរិនិព្វាន របស់ព្រះសម្មាសម្ពុទ្ធ។',
    descriptionEn: 'Triple sacred day marking the birth, enlightenment, and passing of the Buddha.',
  },
  {
    id: 'kh-2026-06-18',
    nameKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី នរោត្តម មុនិនាថ សីហនុ',
    nameEn: 'Queen Mother Norodom Monineath Sihanouk\'s Birthday',
    startDate: '2026-06-18',
    endDate: '2026-06-18',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្មាយុ សម្តេចព្រះវររាជមាតាជាតិខ្មែរ។',
    descriptionEn: 'Official birthday celebration of HM Queen Mother Norodom Monineath Sihanouk.',
  },
  {
    id: 'kh-2026-09-24',
    nameKh: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ',
    nameEn: 'Constitutional Day',
    startDate: '2026-09-24',
    endDate: '2026-09-24',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'រំលឹកខួបនៃការប្រកាសឱ្យប្រើប្រាស់រដ្ឋធម្មនុញ្ញនៃព្រះរាជាណាចក្រកម្ពុជា។',
    descriptionEn: 'Celebration of the supreme law of the Kingdom of Cambodia.',
  },
  {
    id: 'kh-2026-10-10',
    nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ',
    nameEn: 'Pchum Ben Festival (Ancestors\' Day)',
    startDate: '2026-10-10',
    endDate: '2026-10-12',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    lunarDateKh: '១៤រោច - ១រោច ខែភទ្របទ',
    descriptionKh: 'ពិធីបុណ្យឧទ្ទិសកុសលជូនបុព្វការីជន និងញាតិសន្តានដែលបានចែកឋានទៅ (រយៈពេល ៣ ថ្ងៃ)។',
    descriptionEn: 'The traditional 3-day festival of paying respect and transferring merit to ancestors.',
  },
  {
    id: 'kh-2026-10-15',
    nameKh: 'ទិវារំលឹកខួបនៃការយាងសោយព្រះទិវង្គត ព្រះបរមរតនកោដ្ឋ',
    nameEn: 'Commemoration Day of the King Father',
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'ទិវារំលឹកវិញ្ញាណក្ខន្ធ ព្រះករុណា ព្រះបាទសម្តេច ព្រះនរោត្តម សីហនុ ព្រះបរមរតនកោដ្ឋ។',
    descriptionEn: 'Memorial service day honoring the late King Father Norodom Sihanouk.',
  },
  {
    id: 'kh-2026-10-29',
    nameKh: 'ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ',
    nameEn: 'King Norodom Sihamoni\'s Coronation Day',
    startDate: '2026-10-29',
    endDate: '2026-10-29',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'រំលឹកខួបនៃការឡើងគ្រងព្រះបរមរាជសម្បត្តិនៃព្រះករុណា ព្រះបាទសម្តេច ព្រះបរមនាថ នរោត្តម សីហមុនី។',
    descriptionEn: 'Commemorates the coronation of HM King Norodom Sihamoni.',
  },
  {
    id: 'kh-2026-11-09',
    nameKh: 'ពិធីបុណ្យឯករាជ្យជាតិ',
    nameEn: 'National Independence Day',
    startDate: '2026-11-09',
    endDate: '2026-11-09',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    descriptionKh: 'រំលឹកខួបដែលកម្ពុជាទទួលបានឯករាជ្យពេញលេញពីសាធារណរដ្ឋបារាំងនៅឆ្នាំ ១៩៥៣។',
    descriptionEn: 'Commemorates Cambodian Independence Day achieved on November 9, 1953.',
  },
  {
    id: 'kh-2026-11-23',
    nameKh: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក',
    nameEn: 'Water, Floating Lantern, and Moon Festival',
    startDate: '2026-11-23',
    endDate: '2026-11-25',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2026,
    sourceUrl: 'https://mef.gov.kh/public-holiday-2026/',
    sourceAuthority: 'Ministry of Economy and Finance (MEF)',
    verificationStatus: 'VERIFIED',
    lunarDateKh: '១៤កើត - ១រោច ខែកត្ដិក',
    descriptionKh: 'ព្រះរាជពិធីអុំទូកប្រពៃណីជាតិរយៈពេល ៣ ថ្ងៃ (២៣, ២៤, ២៥ វិច្ឆិកា ២០២៦) នៅមុខព្រះបរមរាជវាំង។',
    descriptionEn: 'The magnificent 3-day Water Festival on the Tonle Sap river in front of the Royal Palace.',
  },

  // --- 2027 PROVISIONAL HOLIDAYS (Clearly marked as PROVISIONAL as required) ---
  {
    id: 'kh-2027-01-01',
    nameKh: 'ទិវាចូលឆ្នាំសកល',
    nameEn: 'International New Year Day',
    startDate: '2027-01-01',
    endDate: '2027-01-01',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2027,
    sourceUrl: 'https://mef.gov.kh',
    sourceAuthority: 'Provisional (Pending Official 2027 Royal Sub-Decree)',
    verificationStatus: 'PROVISIONAL',
    descriptionKh: 'កាលបរិច្ឆេទប៉ាន់ស្មានតាមទម្លាប់ប្រចាំឆ្នាំ។ រង់ចាំអនុក្រឹត្យផ្លូវការសម្រាប់ឆ្នាំ ២០២៧។',
    descriptionEn: 'Estimated date according to annual tradition; awaiting official 2027 government sub-decree.',
  },
  {
    id: 'kh-2027-01-07',
    nameKh: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍',
    nameEn: 'Victory over Genocide Day',
    startDate: '2027-01-07',
    endDate: '2027-01-07',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2027,
    sourceUrl: 'https://mef.gov.kh',
    sourceAuthority: 'Provisional (Pending Official 2027 Royal Sub-Decree)',
    verificationStatus: 'PROVISIONAL',
    descriptionKh: 'កាលបរិច្ឆេទប៉ាន់ស្មានតាមទម្លាប់ប្រចាំឆ្នាំ។ រង់ចាំអនុក្រឹត្យផ្លូវការសម្រាប់ឆ្នាំ ២០២៧។',
    descriptionEn: 'Estimated date according to annual tradition; awaiting official 2027 government sub-decree.',
  },
  {
    id: 'kh-2027-04-14',
    nameKh: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ',
    nameEn: 'Khmer New Year Day',
    startDate: '2027-04-14',
    endDate: '2027-04-16',
    category: 'PUBLIC_HOLIDAY',
    isPublicHoliday: true,
    year: 2027,
    sourceUrl: 'https://mef.gov.kh',
    sourceAuthority: 'Provisional (Pending Official 2027 Royal Sub-Decree)',
    verificationStatus: 'PROVISIONAL',
    descriptionKh: 'កាលបរិច្ឆេទប៉ាន់ស្មានតាមទម្លាប់ប្រចាំឆ្នាំ។ រង់ចាំអនុក្រឹត្យផ្លូវការសម្រាប់ឆ្នាំ ២០២៧។',
    descriptionEn: 'Estimated date according to annual tradition; awaiting official 2027 government sub-decree.',
  },
];

/**
 * Checks if a given YYYY-MM-DD date falls within a holiday's date range.
 */
export function isDateInHolidayRange(dateStr: string, holiday: HolidayItem): boolean {
  return dateStr >= holiday.startDate && dateStr <= holiday.endDate;
}

/**
 * Returns all holidays occurring on a specific Gregorian date (YYYY-MM-DD).
 */
export function getHolidaysForDate(dateStr: string): HolidayItem[] {
  return CAMBODIA_HOLIDAYS.filter((h) => isDateInHolidayRange(dateStr, h));
}

/**
 * Returns all holidays in a given year and month.
 */
export function getHolidaysForMonth(year: number, month: number): HolidayItem[] {
  const pad = (n: number) => String(n).padStart(2, '0');
  const monthPrefix = `${year}-${pad(month)}`;
  return CAMBODIA_HOLIDAYS.filter(
    (h) => h.startDate.startsWith(monthPrefix) || h.endDate.startsWith(monthPrefix)
  );
}

/**
 * Returns all holidays for a given year.
 */
export function getHolidaysForYear(year: number): HolidayItem[] {
  return CAMBODIA_HOLIDAYS.filter((h) => h.year === year);
}

/**
 * Filters holidays by category, search term, and year.
 */
export function searchHolidays(
  query: string,
  category?: HolidayCategory | 'ALL',
  year?: number
): HolidayItem[] {
  const cleanQ = query.trim().toLowerCase();
  return CAMBODIA_HOLIDAYS.filter((h) => {
    if (year && h.year !== year) return false;
    if (category && category !== 'ALL' && h.category !== category) return false;
    if (!cleanQ) return true;
    return (
      h.nameKh.toLowerCase().includes(cleanQ) ||
      h.nameEn.toLowerCase().includes(cleanQ) ||
      h.descriptionKh.toLowerCase().includes(cleanQ) ||
      h.descriptionEn.toLowerCase().includes(cleanQ) ||
      h.startDate.includes(cleanQ)
    );
  });
}
