import React, { useState } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { Plus, AlertCircle } from 'lucide-react';
import { DndContext, DragEndEvent, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableCategoryCard from './SortableCategoryCard';
import TrashZone from './TrashZone';

export default function CategoryFilter() {
  const { categories, selectedCategories, toggleCategory, deleteCategory, addCategory, reorderCategories } = useCalendarStore();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#4CAF50');
  const [isDragging, setIsDragging] = useState(false);
  const [showMaxCategoriesWarning, setShowMaxCategoriesWarning] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);

    if (over?.id === 'trash') {
      deleteCategory(active.id as string);
      return;
    }

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);
      
      const newCategories = arrayMove(categories, oldIndex, newIndex);
      reorderCategories(newCategories);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const regularCategoryCount = categories.filter(c => c.id !== 'no-category').length;
      
      if (regularCategoryCount >= 10) {
        setShowMaxCategoriesWarning(true);
        setTimeout(() => setShowMaxCategoriesWarning(false), 3000);
        return;
      }

      addCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setNewCategoryColor('#4CAF50');
      setIsAddingCategory(false);
    }
  };

  // Separate "No Category" from other categories
  const noCategory = categories.find(c => c.id === 'no-category');
  const regularCategories = categories.filter(c => c.id !== 'no-category');

  return (
    <div className="w-64 p-4 border-r border-secondary overflow-hidden flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Catégories</h3>
      
      <button
        onClick={() => {
          if (regularCategories.length >= 10) {
            setShowMaxCategoriesWarning(true);
            setTimeout(() => setShowMaxCategoriesWarning(false), 3000);
            return;
          }
          setIsAddingCategory(true);
        }}
        className="w-full flex items-center justify-center p-2 mb-4 rounded-md border-2 border-dashed border-primary hover:bg-primary hover:bg-opacity-5 transition-colors"
      >
        <Plus className="w-5 h-5 mr-2" />
        Ajouter une catégorie
      </button>

      {showMaxCategoriesWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center text-yellow-800">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm">Maximum 10 catégories autorisées</span>
        </div>
      )}

      {isAddingCategory && (
        <div className="mb-4 p-4 bg-secondary bg-opacity-50 rounded-md">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nom de la catégorie"
            className="w-full p-2 mb-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
            className="w-full h-10 p-1 rounded-md cursor-pointer"
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setIsAddingCategory(false)}
              className="px-3 py-1 rounded-md hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              onClick={handleAddCategory}
              className="px-3 py-1 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {noCategory && (
          <div className="mb-4">
            <SortableCategoryCard
              id={noCategory.id}
              name={noCategory.name}
              color={noCategory.color}
              isSelected={selectedCategories.includes(noCategory.id)}
              onToggle={() => toggleCategory(noCategory.id)}
              isDraggable={false}
            />
          </div>
        )}

        <DndContext 
          onDragEnd={handleDragEnd} 
          onDragStart={handleDragStart}
          sensors={sensors}
        >
          <SortableContext 
            items={regularCategories.map(cat => cat.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {regularCategories.map((category) => (
                <SortableCategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  color={category.color}
                  isSelected={selectedCategories.includes(category.id)}
                  onToggle={() => toggleCategory(category.id)}
                />
              ))}
            </div>
          </SortableContext>
          <TrashZone isVisible={isDragging} />
        </DndContext>
      </div>
    </div>
  );
}