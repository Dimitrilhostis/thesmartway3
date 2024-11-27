import React from 'react';
import { useCalendarStore } from '../../../store/calendarStore';
import {
  format,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import EventCard from '../EventCard';

const WEEKDAYS = [
  { key: 'mon', label: 'L' },
  { key: 'tue', label: 'M' },
  { key: 'wed', label: 'M' },
  { key: 'thu', label: 'J' },
  { key: 'fri', label: 'V' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'D' },
];

export default function YearView() {
  const { selectedDate, events, selectedCategories } = useCalendarStore();

  // Get all months in the year
  const yearStart = startOfYear(selectedDate);
  const yearEnd = endOfYear(selectedDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  // Filter events for the visible date range and selected categories
  const filteredEvents = events.filter(
    (event) =>
      selectedCategories.includes(event.categoryId) &&
      event.start >= yearStart &&
      event.start <= yearEnd
  );

  const MonthGrid = ({ month }: { month: Date }) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const monthEvents = filteredEvents.filter(
      (event) => event.start >= monthStart && event.start <= monthEnd
    );

    const eventsByDate = monthEvents.reduce((acc, event) => {
      const dateKey = format(event.start, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, typeof events>);

    return (
      <div className="flex flex-col">
        <div className="text-sm font-medium mb-1 text-center">
          {format(month, 'MMM', { locale: fr })}
        </div>
        <div className="grid grid-cols-7 text-center mb-1">
          {WEEKDAYS.map((day) => (
            <div key={`${month}-${day.key}`} className="text-[0.6rem] text-gray-500">
              {day.label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-secondary">
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, month);

            return (
              <div
                key={dateKey}
                className={`aspect-square relative ${
                  isCurrentMonth ? '' : 'opacity-30'
                }`}
              >
                <div
                  className={`text-[0.65rem] absolute top-0 left-1 ${
                    isToday(day) ? 'text-primary font-bold' : ''
                  }`}
                >
                  {format(day, 'd')}
                </div>
                {dayEvents.slice(0, 2).map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    view="year"
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="grid grid-cols-3 gap-8">
        {months.map((month) => (
          <div
            key={format(month, 'yyyy-MM')}
            className="bg-background rounded-lg p-2 shadow-sm"
          >
            <MonthGrid month={month} />
          </div>
        ))}
      </div>
    </div>
  );
}