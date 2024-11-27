import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarStore } from '../../store/calendarStore';
import { format, addDays, addMonths, addYears } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CalendarHeader() {
  const { view, selectedDate, setSelectedDate, setView } = useCalendarStore();

  const handleNavigate = (direction: 'prev' | 'next') => {
    const modifier = direction === 'prev' ? -1 : 1;
    
    switch (view) {
      case 'day':
        setSelectedDate(addDays(selectedDate, modifier));
        break;
      case 'week':
        setSelectedDate(addDays(selectedDate, modifier * 7));
        break;
      case 'month':
        setSelectedDate(addMonths(selectedDate, modifier));
        break;
      case 'year':
        setSelectedDate(addYears(selectedDate, modifier));
        break;
    }
  };

  const formatDate = () => {
    switch (view) {
      case 'day':
        return format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr });
      case 'week':
        return `Semaine ${format(selectedDate, 'w')} - ${format(selectedDate, 'MMMM yyyy', { locale: fr })}`;
      case 'month':
        return format(selectedDate, 'MMMM yyyy', { locale: fr });
      case 'year':
        return format(selectedDate, 'yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-secondary">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleNavigate('prev')}
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold capitalize">{formatDate()}</h2>
        <button
          onClick={() => handleNavigate('next')}
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex space-x-2">
        {(['day', 'week', 'month', 'year'] as const).map((viewType) => (
          <button
            key={viewType}
            onClick={() => setView(viewType)}
            className={`px-4 py-2 rounded-md transition-colors ${
              view === viewType
                ? 'bg-primary text-text'
                : 'hover:bg-secondary text-text'
            }`}
          >
            {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}