import React from 'react';
import { useCalendarStore } from '../../../store/calendarStore';
import { format, addHours, startOfDay, isSameDay, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import DraggableEvent from '../DraggableEvent';
import DroppableTimeSlot from '../DroppableTimeSlot';

const MORNING_HOURS = Array.from({ length: 12 }, (_, i) => i);
const AFTERNOON_HOURS = Array.from({ length: 12 }, (_, i) => i + 12);

interface DayViewProps {
  onTimeSlotClick: (date: Date) => void;
  onEventClick: (eventId: string) => void;
}

export default function DayView({ onTimeSlotClick, onEventClick }: DayViewProps) {
  const { selectedDate, events, selectedCategories, updateEvent } = useCalendarStore();

  const filteredEvents = events.filter(
    (event) =>
      isSameDay(event.start, selectedDate) &&
      selectedCategories.includes(event.categoryId)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedEvent = events.find((e) => e.id === active.id);
    if (!draggedEvent) return;

    const dropDate = new Date((over.data.current as any).date);
    const timeDiff = draggedEvent.end.getTime() - draggedEvent.start.getTime();

    updateEvent({
      ...draggedEvent,
      start: dropDate,
      end: new Date(dropDate.getTime() + timeDiff),
    });
  };

  const handleResize = (eventId: string, direction: 'start' | 'end', deltaMinutes: number) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    updateEvent({
      ...event,
      [direction]: addMinutes(event[direction], deltaMinutes),
    });
  };

  const renderTimeColumn = (hours: number[]) => (
    <div className="flex-1">
      {hours.map((hour) => {
        const currentHourDate = addHours(startOfDay(selectedDate), hour);
        const hourEvents = filteredEvents.filter(
          (event) => format(event.start, 'HH') === format(currentHourDate, 'HH')
        );

        return (
          <DroppableTimeSlot
            key={hour}
            id={`time-${hour}`}
            date={currentHourDate}
            onClick={() => onTimeSlotClick(currentHourDate)}
          >
            <div className="relative h-20 border-b border-secondary group">
              <div className="absolute left-0 top-0 w-16 text-sm text-gray-500 -translate-y-1/2">
                {format(currentHourDate, 'HH:mm')}
              </div>
              <div className="ml-20 h-full relative">
                {hourEvents.map((event) => (
                  <DraggableEvent
                    key={event.id}
                    event={event}
                    view="day"
                    onResize={(direction, delta) => 
                      handleResize(event.id, direction, delta)
                    }
                    onClick={() => onEventClick(event.id)}
                  />
                ))}
              </div>
            </div>
          </DroppableTimeSlot>
        );
      })}
    </div>
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-full overflow-y-auto">
        <div className="flex gap-4">
          {renderTimeColumn(MORNING_HOURS)}
          {renderTimeColumn(AFTERNOON_HOURS)}
        </div>
      </div>
    </DndContext>
  );
}