import React from 'react';
import { useCalendarStore } from '../../../store/calendarStore';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  setHours,
  setMinutes,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import EventCard from '../EventCard';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

interface MonthViewProps {
  onTimeSlotClick: (date: Date) => void;
  onEventClick: (eventId: string) => void;
}

export default function MonthView({ onTimeSlotClick, onEventClick }: MonthViewProps) {
  const { selectedDate, events, selectedCategories } = useCalendarStore();

  // Get all days in the month
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Get all days that should be displayed
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Filter events for the visible date range and selected categories
  const filteredEvents = events.filter(
    (event) =>
      selectedCategories.includes(event.categoryId) &&
      calendarDays.some((day) => isSameDay(event.start, day))
  );

  // Group events by date
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    const dateKey = format(event.start, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  const handleDayClick = (day: Date) => {
    // When clicking a day in month view, set the time to 9:00 AM
    const dateWithTime = setMinutes(setHours(day, 9), 0);
    onTimeSlotClick(dateWithTime);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-px bg-secondary p-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-secondary">
        {calendarDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDate[dateKey] || [];
          const isCurrentMonth = isSameMonth(day, selectedDate);

          return (
            <div
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              className={`min-h-[100px] bg-background p-1 cursor-pointer hover:bg-primary hover:bg-opacity-5 transition-colors ${
                isCurrentMonth ? '' : 'opacity-50'
              }`}
            >
              {/* Date number */}
              <div
                className={`text-sm font-medium mb-1 ${
                  isToday(day) ? 'text-primary font-bold' : ''
                }`}
              >
                {format(day, 'd')}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event.id);
                    }}
                  >
                    <EventCard
                      event={event}
                      view="month"
                    />
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 pl-2">
                    +{dayEvents.length - 3} plus
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}