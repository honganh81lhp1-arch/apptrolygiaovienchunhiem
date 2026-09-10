import React, { useState } from 'react';
import { Menu, Search, Calendar, User, Printer } from 'lucide-react';
import { AppSettings } from '../types';

interface TopbarProps {
  settings: AppSettings;
  onToggleSidebar: () => void;
  onGlobalSearch: (keyword: string) => void;
  onPrintReport?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  settings,
  onToggleSidebar,
  onGlobalSearch,
  onPrintReport,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const todayFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onGlobalSearch(searchValue);
    }
  };

  return (
    <header
      id="topbar"
      className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-6 z-20 shrink-0 no-print"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
          aria-label="Mở thanh điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-sm overflow-hidden">
          <span className="font-bold text-slate-800 truncate" id="header-school-name">
            {settings.school || 'Trường Tiểu học Lê Hồng Phong'}
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="font-bold text-[#23395d] shrink-0 bg-[#23395d]/10 px-2 py-0.5 rounded-md border border-[#23395d]/20" id="header-class-name">
            Lớp {settings.class || '4C'}
          </span>
          <span className="text-slate-300 hidden md:inline">•</span>
          <span className="text-slate-600 font-medium hidden md:inline truncate" id="header-teacher-name">
            GVCN: <strong className="text-slate-800">{settings.teacher || 'Phạm Thị Hồng Anh'}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Display (Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="capitalize">{todayFormatted}</span>
        </div>

        {/* Global Search */}
        <div className="relative hidden sm:block">
          <input
            id="global-search"
            type="text"
            placeholder="Tìm học sinh (Enter)..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-slate-100/90 border border-transparent rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#23395d] focus:ring-2 focus:ring-[#23395d]/20 outline-none w-44 md:w-56 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
        </div>

        {onPrintReport && (
          <button
            onClick={onPrintReport}
            className="p-2 text-slate-600 hover:text-[#23395d] rounded-full hover:bg-slate-100 transition hidden sm:flex items-center"
            title="In nhanh báo cáo"
          >
            <Printer className="w-4 h-4" />
          </button>
        )}

        {/* Profile Pill */}
        <div
          className="w-8 h-8 rounded-full bg-[#23395d] text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-xs hover:bg-[#192a47] transition"
          title={`Hồ sơ GVCN: ${settings.teacher || 'Phạm Thị Hồng Anh'}`}
        >
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
