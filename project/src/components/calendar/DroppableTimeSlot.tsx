import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableTimeSlotProps {
  id: string;
  children: React.ReactNode;
  date: Date;
  onClick?: () => void;
}

export default function DroppableTimeSlot({ id, children, date, onClick }: DroppableTimeSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { date },
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`relative h-full cursor-pointer hover:bg-primary hover:bg-opacity-5 transition-colors ${
        isOver ? 'bg-primary bg-opacity-10' : ''
      }`}
    >
      {children}
    </div>
  );
}