import React, { useState, useEffect } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { X, Trash2 } from 'lucide-react';
import { format, addHours } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  editingEvent?: string;
}

export default function EventModal({ isOpen, onClose, initialDate, editingEvent }: EventModalProps) {
  const { categories, addEvent, updateEvent, deleteEvent, events } = useCalendarStore();
  const editedEvent = editingEvent ? events.find(e => e.id === editingEvent) : undefined;

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    start: initialDate || new Date(),
    end: initialDate ? addHours(initialDate, 1) : addHours(new Date(), 1),
    categoryId: categories[0].id,
    recurrence: {
      days: [] as number[],
      until: addHours(new Date(), 1),
    },
  });

  useEffect(() => {
    if (editedEvent) {
      setEventData({
        title: editedEvent.title,
        description: editedEvent.description || '',
        start: editedEvent.start,
        end: editedEvent.end,
        categoryId: editedEvent.categoryId,
        recurrence: editedEvent.recurrence || {
          days: [],
          until: addHours(new Date(), 1),
        },
      });
    } else if (initialDate) {
      setEventData(prev => ({
        ...prev,
        start: initialDate,
        end: addHours(initialDate, 1),
      }));
    }
  }, [editedEvent, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent({ ...eventData, id: editingEvent });
    } else {
      addEvent(eventData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (editingEvent) {
      deleteEvent(editingEvent);
      onClose();
    }
  };

  if (!isOpen) return null;

  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="datetime-local"
                value={format(eventData.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setEventData({
                  ...eventData,
                  start: new Date(e.target.value),
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="datetime-local"
                value={format(eventData.end, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setEventData({
                  ...eventData,
                  end: new Date(e.target.value),
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setEventData({ ...eventData, categoryId: category.id })}
                  className={`p-2 rounded-md flex items-center space-x-2 transition-colors ${
                    eventData.categoryId === category.id
                      ? 'ring-2 ring-primary'
                      : 'hover:bg-gray-50'
                  }`}
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Récurrence
            </label>
            <div className="grid grid-cols-4 gap-2">
              {weekDays.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const days = eventData.recurrence.days.includes(index + 1)
                      ? eventData.recurrence.days.filter(d => d !== index + 1)
                      : [...eventData.recurrence.days, index + 1];
                    setEventData({
                      ...eventData,
                      recurrence: { ...eventData.recurrence, days },
                    });
                  }}
                  className={`px-2 py-1 text-sm rounded-md ${
                    eventData.recurrence.days.includes(index + 1)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {day.slice(0, 2)}
                </button>
              ))}
            </div>
            {eventData.recurrence.days.length > 0 && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jusqu'au
                </label>
                <input
                  type="date"
                  value={format(eventData.recurrence.until, 'yyyy-MM-dd')}
                  onChange={(e) => setEventData({
                    ...eventData,
                    recurrence: {
                      ...eventData.recurrence,
                      until: new Date(e.target.value),
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {editingEvent && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </button>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                {editingEvent ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}