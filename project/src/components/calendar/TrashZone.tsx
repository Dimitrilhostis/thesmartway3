import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';

interface TrashZoneProps {
  isVisible: boolean;
}

export default function TrashZone({ isVisible }: TrashZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'trash',
  });

  if (!isVisible) return null;

  return (
    <div
      ref={setNodeRef}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-lg transition-all ${
        isOver ? 'bg-red-100' : 'bg-gray-100'
      }`}
    >
      <Trash2 className={`w-6 h-6 ${isOver ? 'text-red-500' : 'text-gray-500'}`} />
    </div>
  );
}