import React, { useState } from 'react';
import { Check, Edit2, GripVertical } from 'lucide-react';
import { useCalendarStore } from '../../store/calendarStore';

interface CategoryCardProps {
  id: string;
  name: string;
  color: string;
  isSelected: boolean;
  onToggle: () => void;
  isDraggable?: boolean;
  dragHandleProps?: any;
  style?: React.CSSProperties;
}

export default function CategoryCard({
  id,
  name,
  color,
  isSelected,
  onToggle,
  isDraggable = true,
  dragHandleProps = {},
  style,
}: CategoryCardProps) {
  const { updateCategory } = useCalendarStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editColor, setEditColor] = useState(color);

  const handleSubmit = () => {
    if (editName.trim()) {
      updateCategory(id, editName.trim(), editColor);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div
        className="p-2 rounded-md bg-white shadow-sm"
        style={style}
      >
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={editColor}
            onChange={(e) => setEditColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
              if (e.key === 'Escape') setIsEditing(false);
            }}
          />
          <button
            onClick={handleSubmit}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-2 rounded-md bg-white shadow-sm flex items-center space-x-2"
      style={style}
    >
      {isDraggable && (
        <div {...dragHandleProps} className="cursor-grab">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <div
        className="w-4 h-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="flex-1 text-sm" onDoubleClick={() => id !== 'no-category' && setIsEditing(true)}>
        {name}
      </span>
      {id !== 'no-category' && (
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 hover:bg-gray-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center justify-center w-5 h-5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
      </div>
    </div>
  );
}