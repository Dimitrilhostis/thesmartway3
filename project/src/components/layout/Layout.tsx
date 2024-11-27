import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useCalendarStore } from '../../store/calendarStore';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isSidebarOpen } = useCalendarStore();

  return (
    <div className="min-h-screen bg-[#FAF7F5]">
      <Navbar />
      <div className="flex">
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
          <Sidebar />
        </div>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}