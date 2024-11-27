import React from 'react';
import { useCalendarStore } from '../../../store/calendarStore';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addHours, startOfDay, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import DraggableEvent from '../DraggableEvent';
import DroppableTimeSlot from '../DroppableTimeSlot';
import EventCard from '../EventCard';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface WeekViewProps {
  onTimeSlotClick: (date: Date) => void;
  onEventClick: (eventId: string) => void;
}

export default function WeekView({ onTimeSlotClick, onEventClick }: WeekViewProps) {
  const { selectedDate, events, selectedCategories, updateEvent } = useCalendarStore();

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const filteredEvents = events.filter((event) =>
    selectedCategories.includes(event.categoryId) &&
    daysInWeek.some((day) => isSameDay(event.start, day))
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-full overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background border-b border-secondary">
          <div className="grid grid-cols-8 gap-px">
            <div className="w-16" />
            {daysInWeek.map((day) => (
              <div
                key={day.toString()}
                className="px-2 py-3 text-center"
              >
                <div className="text-sm font-medium">
                  {format(day, 'EEE', { locale: fr })}
                </div>
                <div className={`text-2xl ${
                  isSameDay(day, new Date()) ? 'text-primary font-bold' : ''
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 gap-px border-b border-secondary"
            >
              <div className="relative h-20">
                <span className="absolute -top-3 left-2 text-sm text-gray-500">
                  {format(addHours(startOfDay(selectedDate), hour), 'HH:mm')}
                </span>
              </div>
              {daysInWeek.map((day) => {
                const currentHourDate = addHours(startOfDay(day), hour);
                const dayEvents = filteredEvents.filter(
                  (event) =>
                    isSameDay(event.start, day) &&
                    format(event.start, 'HH') === String(hour).padStart(2, '0')
                );

                return (
                  <DroppableTimeSlot
                    key={`${day}-${hour}`}
                    id={`time-${day}-${hour}`}
                    date={currentHourDate}
                    onClick={() => onTimeSlotClick(currentHourDate)}
                  >
                    <div className="relative h-20">
                      {dayEvents.map((event) => (
                        <DraggableEvent
                          key={event.id}
                          event={event}
                          view="week"
                          onResize={(direction, delta) => 
                            handleResize(event.id, direction, delta)
                          }
                          onClick={() => onEventClick(event.id)}
                        />
                      ))}
                    </div>
                  </DroppableTimeSlot>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}