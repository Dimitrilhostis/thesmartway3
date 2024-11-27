import { create } from 'zustand';
import { Category, Event, EventGroup, ViewType } from '../types/calendar';
import { addDays, isSameDay } from 'date-fns';

interface CalendarState {
  events: Event[];
  categories: Category[];
  groups: EventGroup[];
  selectedDate: Date;
  view: ViewType;
  selectedCategories: string[];
  holidays: Event[];
  isSidebarOpen: boolean;
  
  // Actions
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  setView: (view: ViewType) => void;
  setSelectedDate: (date: Date) => void;
  toggleCategory: (categoryId: string) => void;
  createGroup: (eventIds: string[]) => void;
  ungroupEvents: (groupId: string) => void;
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categories: Category[]) => void;
  toggleSidebar: () => void;
}

const NO_CATEGORY: Category = {
  id: 'no-category',
  name: 'Sans catégorie',
  color: '#808080'
};

const defaultCategories: Category[] = [
  NO_CATEGORY,
  { id: 'vacances', name: 'Vacances', color: '#4CAF50' },
  { id: 'famille', name: 'Famille', color: '#2196F3' },
  { id: 'travail', name: 'Travail', color: '#F44336' },
];

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  categories: defaultCategories,
  groups: [],
  selectedDate: new Date(),
  view: 'week',
  selectedCategories: defaultCategories.map(c => c.id),
  holidays: [],
  isSidebarOpen: true,

  addEvent: (eventData) => {
    const newEvent = {
      ...eventData,
      id: crypto.randomUUID(),
      categoryId: eventData.categoryId || NO_CATEGORY.id,
    };
    set((state) => ({
      events: [...state.events, newEvent],
    }));
  },

  updateEvent: (updatedEvent) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === updatedEvent.id ? {
          ...updatedEvent,
          categoryId: updatedEvent.categoryId || NO_CATEGORY.id,
        } : event
      ),
    }));
  },

  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
      groups: state.groups.map((group) => ({
        ...group,
        eventIds: group.eventIds.filter((eventId) => eventId !== id),
      })),
    }));
  },

  setView: (view) => {
    set({ view });
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  toggleCategory: (categoryId) => {
    set((state) => {
      const isSelected = state.selectedCategories.includes(categoryId);
      return {
        selectedCategories: isSelected
          ? state.selectedCategories.filter((id) => id !== categoryId)
          : [...state.selectedCategories, categoryId],
      };
    });
  },

  createGroup: (eventIds) => {
    if (eventIds.length < 2) return;

    const events = get().events.filter((event) => eventIds.includes(event.id));
    if (events.length < 2) return;

    const groupId = crypto.randomUUID();
    const categoryId = events[0].categoryId || NO_CATEGORY.id;

    set((state) => ({
      groups: [
        ...state.groups,
        {
          id: groupId,
          eventIds,
          title: events[0].title,
          categoryId,
        },
      ],
      events: state.events.map((event) =>
        eventIds.includes(event.id)
          ? { ...event, groupId }
          : event
      ),
    }));
  },

  ungroupEvents: (groupId) => {
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== groupId),
      events: state.events.map((event) =>
        event.groupId === groupId
          ? { ...event, groupId: undefined }
          : event
      ),
    }));
  },

  addCategory: (name, color) => {
    set((state) => {
      // Count regular categories (excluding "No Category")
      const regularCategoryCount = state.categories.filter(c => c.id !== NO_CATEGORY.id).length;
      
      if (regularCategoryCount >= 10) {
        return state;
      }

      const newCategory = {
        id: crypto.randomUUID(),
        name,
        color,
      };
      
      return {
        categories: [...state.categories, newCategory],
        selectedCategories: [...state.selectedCategories, newCategory.id],
      };
    });
  },

  updateCategory: (id, name, color) => {
    if (id === NO_CATEGORY.id) return;
    
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, name, color } : category
      ),
    }));
  },

  deleteCategory: (id) => {
    if (id === NO_CATEGORY.id) return;
    
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
      selectedCategories: state.selectedCategories.filter((categoryId) => categoryId !== id),
      events: state.events.map((event) => ({
        ...event,
        categoryId: event.categoryId === id ? NO_CATEGORY.id : event.categoryId,
      })),
    }));
  },

  reorderCategories: (categories) => {
    set({ categories });
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },
}));