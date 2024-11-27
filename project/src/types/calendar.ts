export type ViewType = 'day' | 'week' | 'month' | 'year';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  categoryId: string;
  recurrence?: {
    days: number[];  // 0-6 for Sunday-Saturday
    until: Date;
  };
  groupId?: string;
}

export interface EventGroup {
  id: string;
  eventIds: string[];
  title: string;
  categoryId: string;
}