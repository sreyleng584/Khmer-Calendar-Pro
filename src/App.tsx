/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header, ActiveTab } from './components/Header.tsx';
import { HomeDashboard } from './components/HomeDashboard.tsx';
import { CalendarGrid } from './components/CalendarGrid.tsx';
import { HolidaysView } from './components/HolidaysView.tsx';
import { EventsListView } from './components/EventsListView.tsx';
import { NewYearSpecialModal } from './components/NewYearSpecialModal.tsx';
import { DateDetailsModal } from './components/DateDetailsModal.tsx';
import { EventModal } from './components/EventModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { PWAUpdateToast } from './components/PWAUpdateToast.tsx';
import { WeatherDetailsView } from './components/WeatherDetailsView.tsx';

import { getKhmerDate, KhmerDateResult, getCambodiaToday } from './calendar/khmerDateAdapter.ts';
import { getHolidaysForDate, getHolidaysForYear, HolidayItem } from './data/holidays.ts';
import { eventsStore, UserEvent } from './storage/eventsStore.ts';
import { settingsStore, AppSettings } from './storage/settingsStore.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Real today date initialized with Cambodia's local timezone (Asia/Phnom_Penh, UTC+7)
  const today = useMemo(() => getCambodiaToday(), []);
  const todayYear = today.year;
  const todayMonth = today.month;
  const todayDay = today.day;
  const todayDateStr = today.dateString;

  // Calendar browsing state
  const [currentYear, setCurrentYear] = useState<number>(todayYear);
  const [currentMonth, setCurrentMonth] = useState<number>(todayMonth);
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);

  // Modals state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  const [eventModalInitialDate, setEventModalInitialDate] = useState<string>(todayDateStr);
  const [editingEvent, setEditingEvent] = useState<UserEvent | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // User events state
  const [events, setEvents] = useState<UserEvent[]>(() => eventsStore.getAll());

  // Settings state
  const [settings, setSettings] = useState<AppSettings>(() => settingsStore.get());

  useEffect(() => {
    const applyTheme = (theme: string) => {
      if (typeof document !== 'undefined') {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    applyTheme(settings.theme);

    return settingsStore.subscribe((newSettings) => {
      setSettings(newSettings);
      applyTheme(newSettings.theme);
    });
  }, []);

  const refreshEvents = useCallback(() => {
    setEvents(eventsStore.getAll());
  }, []);

  // Today Khmer details
  const todayKhmerDate = useMemo(() => {
    return getKhmerDate(todayYear, todayMonth, todayDay);
  }, [todayYear, todayMonth, todayDay]);

  const todayHolidays = useMemo(() => {
    return getHolidaysForDate(todayDateStr);
  }, [todayDateStr]);

  const upcomingEvents = useMemo(() => {
    return events
      .filter((e) => e.date >= todayDateStr)
      .slice(0, 5);
  }, [events, todayDateStr]);

  const upcomingHolidays = useMemo(() => {
    return getHolidaysForYear(currentYear)
      .filter((h) => h.endDate >= todayDateStr)
      .slice(0, 5);
  }, [currentYear, todayDateStr]);

  // Selected date details
  const selectedDateParts = useMemo(() => {
    const parts = selectedDate.split('-');
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10),
    };
  }, [selectedDate]);

  const selectedDateKhmer = useMemo(() => {
    return getKhmerDate(selectedDateParts.year, selectedDateParts.month, selectedDateParts.day);
  }, [selectedDateParts]);

  const selectedDateHolidays = useMemo(() => {
    return getHolidaysForDate(selectedDate);
  }, [selectedDate]);

  const selectedDateEvents = useMemo(() => {
    return events.filter((e) => e.date === selectedDate);
  }, [events, selectedDate]);

  // Navigation handlers
  const handleGoToToday = () => {
    setCurrentYear(todayYear);
    setCurrentMonth(todayMonth);
    setSelectedDate(todayDateStr);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsDetailsModalOpen(true);
  };

  const handleOpenAddEvent = (dateStr?: string) => {
    setEditingEvent(null);
    setEventModalInitialDate(dateStr || selectedDate);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: UserEvent) => {
    setEditingEvent(event);
    setEventModalInitialDate(event.date);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<UserEvent, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    eventsStore.save(eventData);
    refreshEvents();
  };

  const handleDeleteEvent = (id: string) => {
    eventsStore.delete(id);
    refreshEvents();
  };

  const handleToggleEventComplete = (id: string) => {
    eventsStore.toggleCompleted(id);
    refreshEvents();
  };

  const handleOpenShare = (dateResult: KhmerDateResult) => {
    setSelectedDate(`${dateResult.gregorian.year}-${String(dateResult.gregorian.month).padStart(2, '0')}-${String(dateResult.gregorian.day).padStart(2, '0')}`);
    setIsDetailsModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        settings.theme === 'dark'
          ? 'dark bg-[#121214] text-[#f5f5f4]'
          : 'bg-[#fdfbf7] text-[#1c1917]'
      }`}
    >
      {/* Persistent Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onGoToToday={handleGoToToday}
        onOpenSettings={() => setIsSettingsOpen(true)}
        lang={settings.language}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-20">
        {activeTab === 'home' && (
          <HomeDashboard
            todayKhmerDate={todayKhmerDate}
            todayHolidays={todayHolidays}
            upcomingEvents={upcomingEvents}
            upcomingHolidays={upcomingHolidays}
            onOpenCalendar={() => setActiveTab('calendar')}
            onOpenHolidays={() => setActiveTab('holidays')}
            onOpenAddEvent={handleOpenAddEvent}
            onSelectDate={handleSelectDate}
            onOpenShare={handleOpenShare}
            onOpenNewYear={() => setActiveTab('newyear')}
            onOpenWeather={() => setActiveTab('weather')}
            selectedLocationId={settings.selectedLocationId}
            temperatureUnit={settings.temperatureUnit}
            onToggleEventComplete={handleToggleEventComplete}
            useKhmerNumerals={settings.numeralStyle === 'khmer'}
            lang={settings.language}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherDetailsView
            onBack={() => setActiveTab('home')}
            selectedLocationId={settings.selectedLocationId}
            onSelectLocationId={(id) => settingsStore.set({ selectedLocationId: id })}
            temperatureUnit={settings.temperatureUnit}
            onToggleTempUnit={(unit) => settingsStore.set({ temperatureUnit: unit })}
            useKhmerNumerals={settings.numeralStyle === 'khmer'}
            lang={settings.language}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarGrid
            currentYear={currentYear}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            todayDateStr={todayDateStr}
            onSelectDate={handleSelectDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onGoToToday={handleGoToToday}
            onMonthChange={setCurrentMonth}
            onYearChange={setCurrentYear}
            events={events}
            useKhmerNumerals={settings.numeralStyle === 'khmer'}
            lang={settings.language}
          />
        )}

        {activeTab === 'holidays' && (
          <HolidaysView
            onSelectDate={handleSelectDate}
            lang={settings.language}
          />
        )}

        {activeTab === 'events' && (
          <EventsListView
            events={events}
            onOpenAddEvent={() => handleOpenAddEvent()}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onToggleComplete={handleToggleEventComplete}
            lang={settings.language}
          />
        )}

        {activeTab === 'newyear' && (
          <NewYearSpecialModal
            lang={settings.language}
            useKhmerNumerals={settings.numeralStyle === 'khmer'}
          />
        )}
      </main>

      {/* Date Details Modal */}
      {isDetailsModalOpen && (
        <DateDetailsModal
          dateResult={selectedDateKhmer}
          holidays={selectedDateHolidays}
          events={selectedDateEvents}
          onClose={() => setIsDetailsModalOpen(false)}
          onOpenAddEvent={handleOpenAddEvent}
          onDeleteEvent={handleDeleteEvent}
          onToggleEventComplete={handleToggleEventComplete}
          useKhmerNumerals={settings.numeralStyle === 'khmer'}
          lang={settings.language}
        />
      )}

      {/* Event Add/Edit Modal */}
      {isEventModalOpen && (
        <EventModal
          initialDate={eventModalInitialDate}
          initialEvent={editingEvent}
          onSave={handleSaveEvent}
          onClose={() => setIsEventModalOpen(false)}
          lang={settings.language}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(patch) => settingsStore.update(patch)}
          onClose={() => setIsSettingsOpen(false)}
          onEventsImported={refreshEvents}
        />
      )}

      {/* Non-intrusive Offline Indicator Banner */}
      <OfflineIndicator lang={settings.language} />

      {/* PWA Safe Version Update Toast */}
      <PWAUpdateToast lang={settings.language} />
    </div>
  );
}
