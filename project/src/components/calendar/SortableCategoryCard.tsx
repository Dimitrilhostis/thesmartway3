import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CategoryCard from './CategoryCard';

interface SortableCategoryCardProps {
  id: string;
  name: string;
  color: string;
  isSelected: boolean;
  onToggle: () => void;
  isDraggable?: boolean;
}

export default function SortableCategoryCard({
  id,
  name,
  color,
  isSelected,
  onToggle,
  isDraggable = true,
}: SortableCategoryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <CategoryCard
        id={id}
        name={name}
        color={color}
        isSelected={isSelected}
        onToggle={onToggle}
        isDraggable={isDraggable}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}