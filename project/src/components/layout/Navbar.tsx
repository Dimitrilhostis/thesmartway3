import React from 'react';
import { Menu, User, Book, Calendar, CheckSquare, BookOpen, Heart } from 'lucide-react';
import { useCalendarStore } from '../../store/calendarStore';

export default function Navbar() {
  const { toggleSidebar } = useCalendarStore();

  return (
    <nav className="bg-[#D4C4B0] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Menu 
              className="h-6 w-6 text-[#2C1810] cursor-pointer hover:text-[#4A3728] transition-colors"
              onClick={toggleSidebar}
            />
            <span className="ml-3 text-[#2C1810] text-xl font-semibold">VieFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <User className="h-6 w-6 text-[#2C1810] cursor-pointer hover:text-[#4A3728] transition-colors" />
          </div>
        </div>
      </div>
    </nav>
  );
}