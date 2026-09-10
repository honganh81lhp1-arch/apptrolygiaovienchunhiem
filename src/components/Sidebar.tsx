import React from 'react';
import { 
  GraduationCap, 
  Home, 
  Users, 
  CalendarCheck, 
  Trophy, 
  BookOpen, 
  PhoneCall, 
  FileText, 
  Bot, 
  Settings, 
  X,
  Sparkles
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
  classNameLabel: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  classNameLabel,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Tổng quan', icon: Home, badge: null, color: 'text-[#23395d]' },
    { id: 'students' as ActiveTab, label: 'Học sinh', icon: Users, badge: null, color: 'text-[#23395d]' },
    { id: 'attendance' as ActiveTab, label: 'Điểm danh', icon: CalendarCheck, badge: null, color: 'text-emerald-600' },
    { id: 'discipline' as ActiveTab, label: 'Thi đua - Nề nếp', icon: Trophy, badge: null, color: 'text-amber-500' },
    { id: 'academics' as ActiveTab, label: 'Học tập (12 môn)', icon: BookOpen, badge: null, color: 'text-teal-600' },
    { id: 'parents' as ActiveTab, label: 'Phụ huynh', icon: PhoneCall, badge: null, color: 'text-rose-500' },
    { id: 'reports' as ActiveTab, label: 'Báo cáo & Tổng kết', icon: FileText, badge: null, color: 'text-slate-700' },
    { id: 'ai' as ActiveTab, label: 'Trợ lý AI Chủ nhiệm', icon: Bot, badge: 'AI', color: 'text-purple-600' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        id="sidebar"
        className={`w-64 bg-white border-r border-slate-200 h-full flex flex-col z-50 fixed md:static transition-transform duration-300 ease-in-out shrink-0 no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#23395d] text-white flex items-center justify-center shadow-md shadow-[#23395d]/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 tracking-tight leading-tight">
                TRỢ LÝ GVCN
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#23395d]/10 text-[#23395d] border border-[#23395d]/20">
                  Lớp {classNameLabel || '4C'}
                </span>
                <span className="text-[11px] text-slate-400">
                  TH Lê Hồng Phong
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            const isAI = item.id === 'ai';

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? isAI
                      ? 'bg-purple-50 text-purple-700 font-semibold shadow-xs'
                      : 'bg-[#23395d] text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? (isAI ? 'text-purple-600' : 'text-white') : item.color}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              id="nav-settings"
              onClick={() => {
                onSelectTab('settings');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                activeTab === 'settings'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Cài đặt & Dữ liệu</span>
            </button>
          </div>
        </nav>

        {/* Footer teacher badge */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 m-3 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
              GV
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-700 truncate">Thông tư 27/2020</p>
              <p className="text-[11px] text-slate-400 truncate">Đánh giá HS tiểu học</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
