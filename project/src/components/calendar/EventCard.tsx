import React from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { Event } from '../../types/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
  view: 'day' | 'week' | 'month' | 'year';
}

export default function EventCard({ event, view }: EventCardProps) {
  const { categories } = useCalendarStore();
  const category = categories.find((c) => c.id === event.categoryId);

  const getEventStyles = () => {
    const baseStyles = {
      backgroundColor: `${category?.color}20`,
      borderLeft: `4px solid ${category?.color}`,
    };

    switch (view) {
      case 'day':
      case 'week':
        return {
          ...baseStyles,
          position: 'absolute' as const,
          left: 0,
          right: 0,
          top: '2px',
          height: 'calc(100% - 4px)',
        };
      case 'month':
        return {
          ...baseStyles,
          height: '22px',
          overflow: 'hidden',
        };
      case 'year':
        return {
          ...baseStyles,
          height: '4px',
          overflow: 'hidden',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div
      className="rounded-md p-2 cursor-pointer hover:brightness-95 transition-all"
      style={getEventStyles()}
    >
      {view !== 'year' && (
        <>
          <div className="font-semibold text-sm truncate">{event.title}</div>
          {(view === 'day' || view === 'week') && (
            <div className="text-xs text-gray-600">
              {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
            </div>
          )}
        </>
      )}
    </div>
  );
}