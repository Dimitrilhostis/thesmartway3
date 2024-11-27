import React, { useState } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { DragOverlay } from '@dnd-kit/core';
import CalendarHeader from './CalendarHeader';
import DayView from './views/DayView';
import WeekView from './views/WeekView';
import MonthView from './views/MonthView';
import YearView from './views/YearView';
import EventModal from './EventModal';
import CategoryFilter from './CategoryFilter';
import EventCard from './EventCard';

export default function Calendar() {
  const { view, events } = useCalendarStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [editingEventId, setEditingEventId] = useState<string | undefined>();
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);

  const handleTimeSlotClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEventId(undefined);
    setIsModalOpen(true);
  };

  const handleEventClick = (eventId: string) => {
    setEditingEventId(eventId);
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const renderView = () => {
    const viewProps = {
      onTimeSlotClick: handleTimeSlotClick,
      onEventClick: handleEventClick,
    };

    switch (view) {
      case 'day':
        return <DayView {...viewProps} />;
      case 'week':
        return <WeekView {...viewProps} />;
      case 'month':
        return <MonthView {...viewProps} />;
      case 'year':
        return <YearView {...viewProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background rounded-lg shadow-lg">
      <CalendarHeader />
      <div className="flex flex-1">
        <CategoryFilter />
        <div className="flex-1 p-4 relative">
          {renderView()}
          <DragOverlay>
            {draggedEvent ? (
              <div className="opacity-50">
                <EventCard
                  event={events.find(e => e.id === draggedEvent)!}
                  view={view}
                />
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDate={selectedDate}
        editingEvent={editingEventId}
      />
    </div>
  );
}