import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Event } from '../../types/calendar';
import EventCard from './EventCard';

interface DraggableEventProps {
  event: Event;
  view: 'day' | 'week' | 'month' | 'year';
  onResize?: (direction: 'start' | 'end', delta: number) => void;
  onClick?: () => void;
}

export default function DraggableEvent({ event, view, onResize, onClick }: DraggableEventProps) {
  const [isResizing, setIsResizing] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
    data: { event },
    disabled: isResizing,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    cursor: isResizing ? 'row-resize' : 'move',
  } : undefined;

  const handleResizeStart = (e: React.MouseEvent, direction: 'start' | 'end') => {
    e.stopPropagation();
    setIsResizing(true);
    
    const startY = e.clientY;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = Math.round((moveEvent.clientY - startY) / 20) * 15; // Snap to 15-minute intervals
      onResize?.(direction, delta);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className="group relative"
    >
      {(view === 'day' || view === 'week') && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-2 cursor-row-resize opacity-0 group-hover:opacity-100 bg-primary"
            onMouseDown={(e) => handleResizeStart(e, 'start')}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize opacity-0 group-hover:opacity-100 bg-primary"
            onMouseDown={(e) => handleResizeStart(e, 'end')}
          />
        </>
      )}
      <EventCard event={event} view={view} />
    </div>
  );
}