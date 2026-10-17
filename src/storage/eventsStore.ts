/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventCategory = 'personal' | 'religious' | 'family' | 'work' | 'holiday';
export type ReminderOption = 'none' | 'at_time' | '15m_before' | '1h_before' | '1d_before';

export interface UserEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  description?: string;
  category: EventCategory;
  reminder: ReminderOption;
  isCompleted?: boolean;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'khmer_calendar_pro_events_v1';

// Initial starter seed data so the user has real interactive examples
export const SEED_EVENTS: UserEvent[] = [
  {
    id: 'seed-event-1',
    title: 'ទៅវត្តអារាម វេរចង្ហាន់ប្រគេនព្រះសង្ឃ (ថ្ងៃសីល)',
    date: '2026-10-15',
    time: '07:30',
    description: 'នាំចង្ហាន់ និងផ្កាឈូកទៅវត្ត ដើម្បីសមាទានសីល ៥ និងឧទ្ទិសកុសល។',
    category: 'religious',
    reminder: '1h_before',
    isCompleted: false,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'seed-event-2',
    title: 'ជួបជុំគ្រួសារពិសាអាហារពេលល្ងាច',
    date: '2026-10-18',
    time: '18:00',
    description: 'ជួបជុំបងប្អូន និងឪពុកម្តាយនៅគេហដ្ឋាន។',
    category: 'family',
    reminder: '1d_before',
    isCompleted: false,
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now() - 43200000,
  },
  {
    id: 'seed-event-3',
    title: 'រៀបចំកិច្ចការងារប្រចាំសប្តាហ៍',
    date: '2026-10-19',
    time: '09:00',
    description: 'ពិនិត្យបញ្ជីការងារ និងគោលដៅសម្រាប់សប្តាហ៍ថ្មី។',
    category: 'work',
    reminder: '15m_before',
    isCompleted: false,
    createdAt: Date.now() - 21600000,
    updatedAt: Date.now() - 21600000,
  },
];

class EventsStore {
  private inMemoryEvents: UserEvent[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') {
      this.inMemoryEvents = [...SEED_EVENTS];
      this.isInitialized = true;
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.inMemoryEvents = parsed;
          this.isInitialized = true;
          return;
        }
      }
      // First time initialization with seed events
      this.inMemoryEvents = [...SEED_EVENTS];
      this.persist();
    } catch (e) {
      console.warn('LocalStorage not accessible, falling back to in-memory events', e);
      this.inMemoryEvents = [...SEED_EVENTS];
    }
    this.isInitialized = true;
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryEvents));
    } catch (e) {
      console.error('Failed to persist events to localStorage', e);
    }
  }

  public getAll(): UserEvent[] {
    if (!this.isInitialized) this.init();
    return [...this.inMemoryEvents].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.time || '').localeCompare(b.time || '');
    });
  }

  public getByDate(dateStr: string): UserEvent[] {
    return this.getAll().filter((e) => e.date === dateStr);
  }

  public getUpcoming(limit = 5): UserEvent[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getAll()
      .filter((e) => e.date >= today)
      .slice(0, limit);
  }

  public search(query: string, category?: EventCategory | 'all'): UserEvent[] {
    const q = query.trim().toLowerCase();
    return this.getAll().filter((e) => {
      if (category && category !== 'all' && e.category !== category) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        e.date.includes(q)
      );
    });
  }

  public save(event: Omit<UserEvent, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): UserEvent {
    if (!this.isInitialized) this.init();

    const now = Date.now();
    let savedEvent: UserEvent;

    if (event.id) {
      // Update existing
      const index = this.inMemoryEvents.findIndex((e) => e.id === event.id);
      if (index >= 0) {
        savedEvent = {
          ...this.inMemoryEvents[index],
          ...event,
          updatedAt: now,
        };
        this.inMemoryEvents[index] = savedEvent;
      } else {
        savedEvent = {
          ...event,
          id: event.id,
          createdAt: now,
          updatedAt: now,
        };
        this.inMemoryEvents.push(savedEvent);
      }
    } else {
      // Create new
      savedEvent = {
        ...event,
        id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: now,
        updatedAt: now,
      };
      this.inMemoryEvents.push(savedEvent);
    }

    this.persist();
    return savedEvent;
  }

  public delete(id: string): boolean {
    if (!this.isInitialized) this.init();
    const beforeCount = this.inMemoryEvents.length;
    this.inMemoryEvents = this.inMemoryEvents.filter((e) => e.id !== id);
    const deleted = this.inMemoryEvents.length < beforeCount;
    if (deleted) {
      this.persist();
    }
    return deleted;
  }

  public toggleCompleted(id: string): UserEvent | null {
    const event = this.inMemoryEvents.find((e) => e.id === id);
    if (event) {
      event.isCompleted = !event.isCompleted;
      event.updatedAt = Date.now();
      this.persist();
      return event;
    }
    return null;
  }

  public exportJson(): string {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        eventsCount: this.inMemoryEvents.length,
        events: this.inMemoryEvents,
      },
      null,
      2
    );
  }

  public importJson(jsonStr: string): { success: boolean; count: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      const incomingEvents = parsed.events || (Array.isArray(parsed) ? parsed : null);

      if (!Array.isArray(incomingEvents)) {
        return { success: false, count: 0, error: 'ទម្រង់ទិន្នន័យមិនត្រឹមត្រូវ (Invalid JSON structure)' };
      }

      let importedCount = 0;
      for (const item of incomingEvents) {
        if (item.title && item.date) {
          this.save({
            id: item.id || undefined,
            title: String(item.title).trim(),
            date: String(item.date).trim(),
            time: item.time ? String(item.time).trim() : undefined,
            description: item.description ? String(item.description).trim() : undefined,
            category: (item.category as EventCategory) || 'personal',
            reminder: (item.reminder as ReminderOption) || 'none',
            isCompleted: Boolean(item.isCompleted),
          });
          importedCount++;
        }
      }

      this.persist();
      return { success: true, count: importedCount };
    } catch (e) {
      return {
        success: false,
        count: 0,
        error: e instanceof Error ? e.message : 'បរាជ័យក្នុងការវិភាគទិន្នន័យ JSON',
      };
    }
  }

  public resetToSeed(): void {
    this.inMemoryEvents = [...SEED_EVENTS];
    this.persist();
  }
}

export const eventsStore = new EventsStore();
