import React from 'react';
import { Calendar, CheckSquare, Book, Heart, BookOpen } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { icon: Calendar, label: 'Emploi du temps' },
    { icon: CheckSquare, label: 'Habitudes' },
    { icon: Book, label: 'Journal' },
    { icon: Heart, label: 'To-Do List' },
    { icon: BookOpen, label: 'Bibliothèque' },
  ];

  return (
    <aside className="w-64 bg-[#E8DFD8] min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#D4C4B0] transition-all cursor-pointer"
          >
            <item.icon className="h-5 w-5 text-[#2C1810]" />
            <span className="text-[#2C1810]">{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}