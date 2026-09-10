import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  FileText, 
  CheckCircle, 
  Award, 
  BookOpen, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Save, 
  Layers, 
  Users, 
  Star, 
  AlertCircle,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { 
  AppData, 
  DailyReportRecord, 
  WeeklyReportRecord, 
  PeriodReportRecord 
} from '../types';
import { GRADE_4_SUBJECTS } from '../data';
import { 
  WEEKS_35_LIST, 
  DAY_NAMES,
  generateDefaultDailyReport, 
  generateDefaultWeeklyReport, 
  generateDefaultPeriodReport 
} from '../utils/reportsData';

export type ReportCategory = 'daily' | 'weekly' | 'mid1' | 'end1' | 'mid2' | 'end2';

interface ReportsViewProps {
  appData: AppData;
  onUpdateReportNote: (note: string) => void;
  onSaveDailyReport: (record: DailyReportRecord) => void;
  onSaveWeeklyReport: (record: WeeklyReportRecord) => void;
  onSavePeriodReport: (record: PeriodReportRecord) => void;
  onNavigateTab: (tab: any) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  appData,
  onSaveDailyReport,
  onSaveWeeklyReport,
  onSavePeriodReport,
  onNavigateTab,
  onShowToast,
}) => {
  // Main Category Tab
  const [activeCategory, setActiveCategory] = useState<ReportCategory>('daily');

  // --- 1. DAILY REPORT STATE ---
  const todayStr = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // If there is existing attendance dates, use latest, otherwise today
    const attDates = Object.keys(appData.attendance).sort();
    return attDates.length > 0 ? attDates[attDates.length - 1] : todayStr;
  });

  // Load or generate daily report for selectedDate
  const currentDailyReport = useMemo<DailyReportRecord>(() => {
    if (appData.dailyReports && appData.dailyReports[selectedDate]) {
      return appData.dailyReports[selectedDate];
    }
    return generateDefaultDailyReport(selectedDate, appData);
  }, [appData, selectedDate]);

  const [editDaily, setEditDaily] = useState<DailyReportRecord>(currentDailyReport);

  // Sync editDaily whenever selectedDate or currentDailyReport changes
  React.useEffect(() => {
    setEditDaily(currentDailyReport);
  }, [currentDailyReport, selectedDate]);

  // --- 2. 35 WEEKS REPORT STATE ---
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [weekTermFilter, setWeekTermFilter] = useState<'all' | '1' | '2'>('all');

  const currentWeeklyReport = useMemo<WeeklyReportRecord>(() => {
    if (appData.weeklyReports && appData.weeklyReports[selectedWeek]) {
      return appData.weeklyReports[selectedWeek];
    }
    return generateDefaultWeeklyReport(selectedWeek, appData);
  }, [appData, selectedWeek]);

  const [editWeekly, setEditWeekly] = useState<WeeklyReportRecord>(currentWeeklyReport);

  React.useEffect(() => {
    setEditWeekly(currentWeeklyReport);
  }, [currentWeeklyReport, selectedWeek]);

  // --- 3. PERIOD REPORTS STATE (mid1, end1, mid2, end2) ---
  const currentPeriodReport = useMemo<PeriodReportRecord>(() => {
    const key = (activeCategory === 'mid1' || activeCategory === 'end1' || activeCategory === 'mid2' || activeCategory === 'end2')
      ? activeCategory
      : 'mid1';

    if (appData.periodReports && appData.periodReports[key]) {
      return appData.periodReports[key];
    }
    return generateDefaultPeriodReport(key, appData);
  }, [appData, activeCategory]);

  const [editPeriod, setEditPeriod] = useState<PeriodReportRecord>(currentPeriodReport);

  React.useEffect(() => {
    setEditPeriod(currentPeriodReport);
  }, [currentPeriodReport, activeCategory]);

  // --- STATS COMPUTATIONS ---
  const totalStudents = appData.students.length;
  const boysCount = appData.students.filter((s) => s.gender === 'Nam').length;
  const girlsCount = appData.students.filter((s) => s.gender === 'Nữ').length;

  // Group stats (Tổ 1 đến Tổ 6)
  const groupStats = useMemo(() => {
    const groups: { [grp: number]: { count: number; totalPoints: number; avgPoints: number } } = {};
    for (let g = 1; g <= 6; g++) {
      groups[g] = { count: 0, totalPoints: 0, avgPoints: 100 };
    }
    appData.students.forEach((s) => {
      const g = s.group || 1;
      if (!groups[g]) groups[g] = { count: 0, totalPoints: 0, avgPoints: 100 };
      groups[g].count += 1;
      const pts = appData.discipline[s.id] ?? 100;
      groups[g].totalPoints += pts;
    });
    for (let g = 1; g <= 6; g++) {
      if (groups[g].count > 0) {
        groups[g].avgPoints = Math.round((groups[g].totalPoints / groups[g].count) * 10) / 10;
      }
    }
    return groups;
  }, [appData.students, appData.discipline]);

  // Sorted Groups by average points
  const sortedGroups = useMemo(() => {
    return [1, 2, 3, 4, 5, 6].sort((a, b) => groupStats[b].avgPoints - groupStats[a].avgPoints);
  }, [groupStats]);

  // Top students and needs attention
  const sortedStudentIds = useMemo(() => {
    return Object.keys(appData.discipline).sort(
      (a, b) => (appData.discipline[Number(b)] || 100) - (appData.discipline[Number(a)] || 100)
    );
  }, [appData.discipline]);

  const topStudents = useMemo(() => {
    return sortedStudentIds.slice(0, 4).map((idStr) => {
      const s = appData.students.find((x) => x.id === Number(idStr));
      const pts = appData.discipline[Number(idStr)] || 100;
      return { name: s ? s.name : 'Học sinh', points: pts, group: s ? s.group : 1 };
    });
  }, [sortedStudentIds, appData.students, appData.discipline]);

  const needAttentionStudents = useMemo(() => {
    const list: { name: string; points: number; group: number }[] = [];
    for (let i = sortedStudentIds.length - 1; i >= 0; i--) {
      const id = Number(sortedStudentIds[i]);
      const pts = appData.discipline[id] || 100;
      if (pts < 95) {
        const s = appData.students.find((x) => x.id === id);
        if (s) list.push({ name: s.name, points: pts, group: s.group });
      }
      if (list.length >= 4) break;
    }
    return list;
  }, [sortedStudentIds, appData.discipline, appData.students]);

  // CHT counts
  const chtCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    GRADE_4_SUBJECTS.forEach((sub) => {
      counts[sub.key] = 0;
    });
    appData.students.forEach((s) => {
      const d = appData.academics[s.id];
      if (d) {
        GRADE_4_SUBJECTS.forEach((sub) => {
          if (d[sub.key as keyof typeof d] === 'CHT') {
            counts[sub.key]++;
          }
        });
      }
    });
    return counts;
  }, [appData.students, appData.academics]);

  // Formatted date
  const printDateFormatted = useMemo(() => {
    const d = new Date();
    return `Ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
  }, []);

  // --- HANDLERS ---
  const handlePrint = () => {
    window.print();
  };

  const handleSaveDaily = () => {
    onSaveDailyReport(editDaily);
  };

  const handleResetDailyDefault = () => {
    const def = generateDefaultDailyReport(selectedDate, appData);
    setEditDaily(def);
    onSaveDailyReport(def);
    onShowToast('Đã khôi phục mẫu báo cáo ngày chuẩn!', 'info');
  };

  const handleSaveWeekly = () => {
    onSaveWeeklyReport(editWeekly);
  };

  const handleResetWeeklyDefault = () => {
    const def = generateDefaultWeeklyReport(selectedWeek, appData);
    setEditWeekly(def);
    onSaveWeeklyReport(def);
    onShowToast(`Đã khôi phục mẫu chuẩn cho Tuần ${selectedWeek}!`, 'info');
  };

  const handleSavePeriod = () => {
    onSavePeriodReport(editPeriod);
  };

  const handleResetPeriodDefault = () => {
    const key = (activeCategory === 'mid1' || activeCategory === 'end1' || activeCategory === 'mid2' || activeCategory === 'end2')
      ? activeCategory
      : 'mid1';
    const def = generateDefaultPeriodReport(key, appData);
    setEditPeriod(def);
    onSavePeriodReport(def);
    onShowToast('Đã khôi phục mẫu chuẩn kì học!', 'info');
  };

  // Weekday buttons for daily report
  const currentWeekDays = useMemo(() => {
    // Determine the Monday of the current selectedDate or today
    const base = new Date(selectedDate);
    const day = base.getDay(); // 0 is Sun
    const diffToMon = (day === 0 ? -6 : 1) - day;
    const mon = new Date(base);
    mon.setDate(base.getDate() + diffToMon);

    const days: { name: string; dateStr: string; isSelected: boolean }[] = [];
    for (let i = 0; i < 6; i++) {
      const cur = new Date(mon);
      cur.setDate(mon.getDate() + i);
      const str = cur.toISOString().split('T')[0];
      days.push({
        name: DAY_NAMES[i],
        dateStr: str,
        isSelected: str === selectedDate,
      });
    }
    return days;
  }, [selectedDate]);

  // Selected date attendance numbers
  const dayAttendanceData = useMemo(() => {
    const dayAtt = appData.attendance[selectedDate] || {};
    let p = 0, cp = 0, k = 0, m = 0;
    Object.values(dayAtt).forEach((st) => {
      if (st === 'present') p++;
      else if (st === 'absent_p') cp++;
      else if (st === 'absent_k') k++;
      else if (st === 'late') m++;
    });
    const hasData = Object.keys(dayAtt).length > 0;
    return { p, cp, k, m, hasData, total: totalStudents };
  }, [appData.attendance, selectedDate, totalStudents]);

  return (
    <div id="view-reports" className="space-y-6 pb-16">
      {/* 1. TOP TITLE & ACTION BAR (Hidden in print) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 no-print bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#23395d]/10 text-[#23395d] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Hệ Thống Báo Cáo & Sơ Kết - Tổng Kết Lớp 4
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                GVCN: <strong className="text-slate-700">{appData.settings.teacher || 'Phạm Thị Hồng Anh'}</strong> • 
                Lớp: <strong className="text-slate-700">{appData.settings.class || '4C'}</strong> • 
                {appData.settings.school || 'Trường Tiểu học Lê Hồng Phong'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => onNavigateTab('ai')}
            className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200/70 hover:bg-purple-100 rounded-xl transition flex items-center gap-1.5 text-xs font-bold shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Trợ lý AI gợi ý nhận xét</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#23395d] text-white hover:bg-[#1a2b47] rounded-xl transition flex items-center gap-1.5 text-xs font-bold shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>In bản báo cáo (Ctrl + P)</span>
          </button>
        </div>
      </div>

      {/* 2. PRIMARY CATEGORY TABS (Hidden in print) */}
      <div className="no-print bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* Tab 1: Daily */}
          <button
            type="button"
            onClick={() => setActiveCategory('daily')}
            className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
              activeCategory === 'daily'
                ? 'bg-[#23395d] text-white shadow-sm ring-2 ring-[#23395d]/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
            }`}
          >
            <Calendar className="w-4 h-4 mb-1" />
            <span className="text-xs font-bold">Báo cáo theo Ngày</span>
            <span className={`text-[10px] mt-0.5 ${activeCategory === 'daily' ? 'text-slate-200' : 'text-slate-500'}`}>
              Các ngày trong tuần
            </span>
          </button>

          {/* Tab 2: 35 Weeks */}
          <button
            type="button"
            onClick={() => setActiveCategory('weekly')}
            className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
              activeCategory === 'weekly'
                ? 'bg-[#23395d] text-white shadow-sm ring-2 ring-[#23395d]/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
            }`}
          >
            <Layers className="w-4 h-4 mb-1" />
            <span className="text-xs font-bold">Tổng kết 35 Tuần</span>
            <span className={`text-[10px] mt-0.5 ${activeCategory === 'weekly' ? 'text-slate-200' : 'text-slate-500'}`}>
              Tuần 1 đến Tuần 35
            </span>
          </button>

          {/* Tab 3: Mid 1 */}
          <button
            type="button"
            onClick={() => setActiveCategory('mid1')}
            className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
              activeCategory === 'mid1'
                ? 'bg-[#23395d] text-white shadow-sm ring-2 ring-[#23395d]/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
            }`}
          >
            <Clock className="w-4 h-4 mb-1" />
            <span className="text-xs font-bold">Sơ kết Giữa Kì 1</span>
            <span className={`text-[10px] mt-0.5 ${activeCategory === 'mid1' ? 'text-slate-200' : 'text-slate-500'}`}>
              Khảo sát Tuần 9
            </span>
          </button>

          {/* Tab 4: End 1 */}
          <button
            type="button"
            onClick={() => setActiveCategory('end1')}
            className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
              activeCategory === 'end1'
                ? 'bg-[#23395d] text-white shadow-sm ring-2 ring-[#23395d]/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
            }`}
          >
            <Award className="w-4 h-4 mb-1" />
            <span className="text-xs font-bold">Tổng kết Cuối Kì 1</span>
            <span className={`text-[10px] mt-0.5 ${activeCategory === 'end1' ? 'text-slate-200' : 'text-slate-500'}`}>
              Đánh giá Tuần 18
            </span>
          </button>

          {/* Tab 5: Mid 2 */}
          <button
            type="button"
            onClick={() => setActiveCategory('mid2')}
            className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
              activeCategory === 'mid2'
                ? 'bg-[#23395d] text-white shadow-sm ring-2 ring-[#23395d]/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
            }`}
          >
            <Clock className="w-4 h-4 mb-1" />
            <span className="text-xs font-bold">Sơ kết Giữa Kì 2</span>
            <span className={`text-[10px] mt-0.5 ${activeCategory === 'mid2' ? 'text-slate-200' : 'text-slate-500'}`}>
              Khảo sát Tuần 27
            </span>
          </button>

          {/* Tab 6: End 2 */}
          <button
            type="button"
            onClick={() => setActiveCategory('end2')}
            className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
              activeCategory === 'end2'
                ? 'bg-[#23395d] text-white shadow-sm ring-2 ring-[#23395d]/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
            }`}
          >
            <Star className="w-4 h-4 mb-1" />
            <span className="text-xs font-bold">Tổng kết Cuối Kì 2</span>
            <span className={`text-[10px] mt-0.5 ${activeCategory === 'end2' ? 'text-slate-200' : 'text-slate-500'}`}>
              Bế giảng & Năm học
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SUB-VIEW CONTROLS & SUB-NAV                                           */}
      {/* ========================================================================= */}

      {/* 3A. DAILY REPORT SELECTOR CONTROLS */}
      {activeCategory === 'daily' && (
        <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#23395d]" />
                <span>Chọn ngày trong tuần để lập nhật ký & báo cáo:</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cô có thể bấm chọn nhanh các ngày trong tuần hoặc chọn ngày cụ thể từ lịch bên dưới
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23395d]/20 focus:border-[#23395d]"
              />
              <button
                type="button"
                onClick={() => setSelectedDate(todayStr)}
                className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
              >
                Hôm nay
              </button>
            </div>
          </div>

          {/* Weekday Quick Pills */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {currentWeekDays.map((wd) => {
              const hasReportSaved = Boolean(appData.dailyReports && appData.dailyReports[wd.dateStr]);
              return (
                <button
                  key={wd.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(wd.dateStr)}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center relative ${
                    wd.isSelected
                      ? 'bg-[#23395d] text-white border-[#23395d] shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                  }`}
                >
                  <span className="text-xs font-bold">{wd.name}</span>
                  <span className={`text-[11px] mt-0.5 ${wd.isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                    {wd.dateStr.split('-').reverse().slice(0, 2).join('/')}
                  </span>
                  {hasReportSaved && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" title="Đã lưu báo cáo" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Attendance Badge for the selected day */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Tình hình điểm danh ngày {selectedDate.split('-').reverse().join('/')}:</span>
              {dayAttendanceData.hasData ? (
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Có mặt: {dayAttendanceData.p + dayAttendanceData.m}/{dayAttendanceData.total}
                  </span>
                  {dayAttendanceData.cp > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      Nghỉ phép: {dayAttendanceData.cp}
                    </span>
                  )}
                  {dayAttendanceData.k > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                      Không phép: {dayAttendanceData.k}
                    </span>
                  )}
                  {dayAttendanceData.m > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                      Đi muộn: {dayAttendanceData.m}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-slate-500 italic">Chưa có dữ liệu điểm danh ngày này.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDailyDefault}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Nạp mẫu chuẩn</span>
              </button>
              <button
                type="button"
                onClick={handleSaveDaily}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu báo cáo ngày</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3B. 35 WEEKS SELECTOR CONTROLS */}
      {activeCategory === 'weekly' && (
        <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#23395d]" />
                <span>Chọn tuần học trong 35 tuần năm học 2026 - 2027:</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhấn vào tuần bất kỳ để xem và điều chỉnh báo cáo tổng kết tuần của GVCN
              </p>
            </div>

            {/* Semester Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setWeekTermFilter('all')}
                className={`px-3 py-1 rounded-lg transition ${weekTermFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Tất cả (35 Tuần)
              </button>
              <button
                type="button"
                onClick={() => setWeekTermFilter('1')}
                className={`px-3 py-1 rounded-lg transition ${weekTermFilter === '1' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Học kì I (1-18)
              </button>
              <button
                type="button"
                onClick={() => setWeekTermFilter('2')}
                className={`px-3 py-1 rounded-lg transition ${weekTermFilter === '2' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Học kì II (19-35)
              </button>
            </div>
          </div>

          {/* 35 Weeks Grid */}
          <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-12 lg:grid-cols-18 gap-1.5 max-h-40 overflow-y-auto p-1 bg-slate-50/50 rounded-xl border border-slate-200/60">
            {WEEKS_35_LIST
              .filter((w) => weekTermFilter === 'all' || (weekTermFilter === '1' && w.term === 1) || (weekTermFilter === '2' && w.term === 2))
              .map((w) => {
                const isSelected = w.week === selectedWeek;
                const isSaved = Boolean(appData.weeklyReports && appData.weeklyReports[w.week]);
                return (
                  <button
                    key={w.week}
                    type="button"
                    onClick={() => setSelectedWeek(w.week)}
                    className={`h-10 rounded-xl border flex flex-col items-center justify-center transition relative ${
                      isSelected
                        ? 'bg-[#23395d] text-white border-[#23395d] font-bold shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200/70 font-medium'
                    }`}
                    title={w.title}
                  >
                    <span className="text-xs font-bold leading-none">T{w.week}</span>
                    <span className={`text-[9px] mt-0.5 leading-none ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                      HK{w.term}
                    </span>
                    {isSaved && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
          </div>

          {/* Stepper + Quick Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={selectedWeek <= 1}
                onClick={() => setSelectedWeek((prev) => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-800">
                Đang xem: Tuần {selectedWeek} ({WEEKS_35_LIST[selectedWeek - 1]?.title})
              </span>
              <button
                type="button"
                disabled={selectedWeek >= 35}
                onClick={() => setSelectedWeek((prev) => Math.min(35, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetWeeklyDefault}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Nạp mẫu chuẩn tuần {selectedWeek}</span>
              </button>
              <button
                type="button"
                onClick={handleSaveWeekly}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu báo cáo Tuần {selectedWeek}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3C. PERIOD REPORTS SELECTOR CONTROLS (mid1, end1, mid2, end2) */}
      {(activeCategory === 'mid1' || activeCategory === 'end1' || activeCategory === 'mid2' || activeCategory === 'end2') && (
        <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-[#23395d]" />
              <span>{editPeriod.title}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mẫu báo cáo sơ kết / tổng kết chuẩn Thông tư 27/2020/TT-BGDĐT đối với học sinh Tiểu học
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetPeriodDefault}
              className="text-[11px] font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Nạp lại mẫu chuẩn</span>
            </button>
            <button
              type="button"
              onClick={handleSavePeriod}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu báo cáo kì này</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN EDITABLE & PRINTABLE REPORT SHEET                                */}
      {/* ========================================================================= */}
      <div
        id="printable-report"
        className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-10 md:p-12 max-w-4xl mx-auto text-slate-800"
      >
        {/* OFFICIAL ADMINISTRATIVE HEADER */}
        <div className="border-b-2 border-slate-800 pb-5 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-700 mb-4 gap-2">
            <div className="text-center sm:text-left">
              <p className="uppercase font-bold tracking-wider text-slate-600">PHÒNG GIÁO DỤC VÀ ĐÀO TẠO</p>
              <p className="uppercase font-extrabold text-slate-900 tracking-wider">
                {appData.settings.school || 'TRƯỜNG TIỂU HỌC LÊ HỒNG PHONG'}
              </p>
            </div>
            <div className="text-center sm:text-right font-medium">
              <p className="uppercase font-bold tracking-wider text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="italic text-slate-600">Độc lập - Tự do - Hạnh phúc</p>
            </div>
          </div>

          <div className="text-center pt-3">
            {activeCategory === 'daily' && (
              <>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  NHẬT KÝ & BÁO CÁO TÌNH HÌNH LỚP HỌC TRONG NGÀY
                </h2>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  {editDaily.dayOfWeek}, ngày {editDaily.date.split('-').reverse().join('/')}
                </p>
              </>
            )}

            {activeCategory === 'weekly' && (
              <>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  BÁO CÁO TỔNG KẾT TUẦN LỚP CHỦ NHIỆM
                </h2>
                <p className="text-xs font-bold text-[#23395d] mt-1">
                  {editWeekly.title} (Học kì {editWeekly.term})
                </p>
              </>
            )}

            {(activeCategory === 'mid1' || activeCategory === 'end1' || activeCategory === 'mid2' || activeCategory === 'end2') && (
              <>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  {editPeriod.title}
                </h2>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  {editPeriod.subTitle}
                </p>
              </>
            )}

            <div className="flex items-center justify-center gap-3 text-xs text-slate-600 mt-2 font-medium">
              <span>
                Lớp: <strong className="text-[#23395d] text-sm">{appData.settings.class || '4C'}</strong>
              </span>
              <span>•</span>
              <span>
                Sĩ số: <strong>{totalStudents} học sinh</strong> (Nam: {boysCount}, Nữ: {girlsCount})
              </span>
              <span>•</span>
              <span>
                GVCN: <strong>{appData.settings.teacher || 'Phạm Thị Hồng Anh'}</strong>
              </span>
              <span>•</span>
              <span>
                Năm học: <strong>{appData.settings.year}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* VIEW TYPE 1: DAILY REPORT VIEW                                       */}
        {/* --------------------------------------------------------------------- */}
        {activeCategory === 'daily' && (
          <div className="space-y-6">
            {/* 1. Sĩ số & Chuyên cần */}
            <section>
              <h4 className="font-bold text-sm text-[#23395d] uppercase tracking-wider mb-2 border-b border-[#23395d]/20 pb-1 flex items-center gap-2">
                <span>1. Tình hình Sĩ số & Chuyên cần trong ngày</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={2}
                  value={editDaily.attendanceText || ''}
                  onChange={(e) => setEditDaily({ ...editDaily, attendanceText: e.target.value })}
                  placeholder="Ghi nhận sĩ số, học sinh vắng, lý do..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-[#23395d] outline-none transition"
                />
              </div>
              <div className="text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 leading-relaxed text-slate-800">
                {editDaily.attendanceText || 'Sĩ số đủ 100%, không có học sinh vắng mặt.'}
              </div>
            </section>

            {/* 2. Nền nếp, truy bài, đồng phục, vệ sinh */}
            <section>
              <h4 className="font-bold text-sm text-amber-900 uppercase tracking-wider mb-2 border-b border-amber-200 pb-1 flex items-center gap-2">
                <span>2. Nền nếp, Trang phục, Vệ sinh & 15 phút đầu giờ</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editDaily.morningNote || ''}
                  onChange={(e) => setEditDaily({ ...editDaily, morningNote: e.target.value })}
                  placeholder="Tình hình 15 phút truy bài, khăn quàng đỏ, trực nhật vệ sinh..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-amber-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-amber-50/40 p-3.5 rounded-xl border border-amber-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editDaily.morningNote}
              </div>
            </section>

            {/* 3. Tình hình học tập các tiết */}
            <section>
              <h4 className="font-bold text-sm text-teal-900 uppercase tracking-wider mb-2 border-b border-teal-200 pb-1 flex items-center gap-2">
                <span>3. Tình hình học tập các tiết học (Sáng / Chiều)</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editDaily.academicNote || ''}
                  onChange={(e) => setEditDaily({ ...editDaily, academicNote: e.target.value })}
                  placeholder="Nhận xét các tiết học Toán, Tiếng Việt, Khoa học, Ngoại ngữ..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-teal-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-teal-50/40 p-3.5 rounded-xl border border-teal-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editDaily.academicNote}
              </div>
            </section>

            {/* 4. Khen thưởng & Nhắc nhở */}
            <section>
              <h4 className="font-bold text-sm text-indigo-900 uppercase tracking-wider mb-2 border-b border-indigo-200 pb-1 flex items-center gap-2">
                <span>4. Khen thưởng, Tuyên dương & Học sinh cần nhắc nhở</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editDaily.conductNote || ''}
                  onChange={(e) => setEditDaily({ ...editDaily, conductNote: e.target.value })}
                  placeholder="Tuyên dương học sinh, tổ hăng hái; nhắc nhở học sinh mất trật tự..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-indigo-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editDaily.conductNote}
              </div>
            </section>

            {/* 5. Dặn dò bài vở & Thông báo phụ huynh */}
            <section>
              <h4 className="font-bold text-sm text-purple-900 uppercase tracking-wider mb-2 border-b border-purple-200 pb-1 flex items-center gap-2">
                <span>5. Dặn dò học sinh chuẩn bị bài & Nhắn gửi phụ huynh</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={2}
                  value={editDaily.homeworkNote || ''}
                  onChange={(e) => setEditDaily({ ...editDaily, homeworkNote: e.target.value })}
                  placeholder="Dặn dò bài tập, mang đồ dùng học tập ngày mai..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-purple-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-purple-50/40 p-3.5 rounded-xl border border-purple-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editDaily.homeworkNote}
              </div>
            </section>

            {/* 6. Sự việc đột xuất */}
            {editDaily.specialEventNote && (
              <section>
                <h4 className="font-bold text-sm text-rose-900 uppercase tracking-wider mb-2 border-b border-rose-200 pb-1 flex items-center gap-2">
                  <span>6. Ghi chú đặc biệt / Sự việc đột xuất</span>
                </h4>
                <div className="no-print mb-2">
                  <textarea
                    rows={2}
                    value={editDaily.specialEventNote || ''}
                    onChange={(e) => setEditDaily({ ...editDaily, specialEventNote: e.target.value })}
                    placeholder="Ghi chú về sức khỏe, liên lạc gia đình..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-rose-600 outline-none transition font-sans"
                  />
                </div>
                <div className="text-xs bg-rose-50/40 p-3.5 rounded-xl border border-rose-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                  {editDaily.specialEventNote}
                </div>
              </section>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* VIEW TYPE 2: 35 WEEKS REPORT VIEW                                     */}
        {/* --------------------------------------------------------------------- */}
        {activeCategory === 'weekly' && (
          <div className="space-y-6">
            {/* 1. Sĩ số & Chuyên cần tuần */}
            <section>
              <h4 className="font-bold text-sm text-[#23395d] uppercase tracking-wider mb-2 border-b border-[#23395d]/20 pb-1 flex items-center gap-2">
                <span>1. Tình hình Sĩ số & Nền nếp chuyên cần cả tuần</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={2}
                  value={editWeekly.attendanceNote || ''}
                  onChange={(e) => setEditWeekly({ ...editWeekly, attendanceNote: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-[#23395d] outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editWeekly.attendanceNote}
              </div>
            </section>

            {/* 2. Nề nếp thi đua & Xếp hạng 6 tổ */}
            <section>
              <h4 className="font-bold text-sm text-amber-900 uppercase tracking-wider mb-2 border-b border-amber-200 pb-1 flex items-center gap-2">
                <span>2. Nề nếp kỷ luật & Kết quả thi đua 6 tổ</span>
              </h4>

              {/* Tổ Rankings Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                {sortedGroups.map((grpNum, idx) => (
                  <div
                    key={grpNum}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-center flex flex-col items-center"
                  >
                    <span className="text-[11px] font-bold text-slate-700">Tổ {grpNum}</span>
                    <span className="text-xs font-black text-[#23395d] mt-0.5">
                      {groupStats[grpNum].avgPoints} đ
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold mt-0.5">
                      Hạng {idx + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tuyên dương top học sinh */}
              <div className="text-xs mb-3 space-y-1 bg-amber-50/40 p-3 rounded-xl border border-amber-200/60">
                <p className="font-bold text-amber-900">• Top học sinh tiêu biểu xuất sắc trong tuần:</p>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                  {topStudents.map((s, i) => (
                    <li key={i}>
                      Em <strong>{s.name}</strong> (Tổ {s.group}) — Đạt <strong>{s.points} điểm</strong> thi đua.
                    </li>
                  ))}
                </ul>
              </div>

              <div className="no-print mb-2">
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Nhận xét nề nếp thi đua:
                </label>
                <textarea
                  rows={3}
                  value={editWeekly.disciplineNote || ''}
                  onChange={(e) => setEditWeekly({ ...editWeekly, disciplineNote: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-amber-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editWeekly.disciplineNote}
              </div>
            </section>

            {/* 3. Tình hình học tập & Thống kê 12 môn */}
            <section>
              <h4 className="font-bold text-sm text-teal-900 uppercase tracking-wider mb-2 border-b border-teal-200 pb-1 flex items-center gap-2">
                <span>3. Tình hình học tập & Hoạt động chuyên môn 12 môn học</span>
              </h4>

              {/* 12 Subjects CHT quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-3 text-xs">
                {GRADE_4_SUBJECTS.map((sub) => {
                  const count = chtCounts[sub.key] || 0;
                  return (
                    <div
                      key={sub.key}
                      className={`p-2 rounded-xl border flex items-center justify-between ${
                        count > 0 ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200/70 text-slate-700'
                      }`}
                    >
                      <span className="font-medium truncate pr-1">{sub.shortName}:</span>
                      <span className="font-bold shrink-0">{count > 0 ? `${count} CHT` : 'Đạt'}</span>
                    </div>
                  );
                })}
              </div>

              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editWeekly.academicNote || ''}
                  onChange={(e) => setEditWeekly({ ...editWeekly, academicNote: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-teal-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-teal-50/40 p-3.5 rounded-xl border border-teal-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editWeekly.academicNote}
              </div>
            </section>

            {/* 4. Hoạt động Đội - Sao & Phong trào */}
            <section>
              <h4 className="font-bold text-sm text-blue-900 uppercase tracking-wider mb-2 border-b border-blue-200 pb-1 flex items-center gap-2">
                <span>4. Hoạt động Đội TNTP, Sao nhi đồng & Văn thể mỹ</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editWeekly.movementNote || ''}
                  onChange={(e) => setEditWeekly({ ...editWeekly, movementNote: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-blue-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-blue-50/40 p-3.5 rounded-xl border border-blue-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editWeekly.movementNote}
              </div>
            </section>

            {/* 5. Kế hoạch tuần tiếp theo */}
            <section>
              <h4 className="font-bold text-sm text-emerald-900 uppercase tracking-wider mb-2 border-b border-emerald-200 pb-1 flex items-center gap-2">
                <span>5. Kế hoạch & Nhiệm vụ trọng tâm tuần tiếp theo</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editWeekly.nextWeekPlan || ''}
                  onChange={(e) => setEditWeekly({ ...editWeekly, nextWeekPlan: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-emerald-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editWeekly.nextWeekPlan}
              </div>
            </section>

            {/* 6. Nhận xét chung của GVCN */}
            <section>
              <h4 className="font-bold text-sm text-purple-900 uppercase tracking-wider mb-2 border-b border-purple-200 pb-1 flex items-center gap-2">
                <span>6. Nhận xét & Đánh giá chung của Giáo viên chủ nhiệm</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editWeekly.teacherNote || ''}
                  onChange={(e) => setEditWeekly({ ...editWeekly, teacherNote: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-purple-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-purple-50/40 p-3.5 rounded-xl border border-purple-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editWeekly.teacherNote}
              </div>
            </section>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* VIEW TYPE 3: PERIOD REPORTS (mid1, end1, mid2, end2)                  */}
        {/* --------------------------------------------------------------------- */}
        {(activeCategory === 'mid1' || activeCategory === 'end1' || activeCategory === 'mid2' || activeCategory === 'end2') && (
          <div className="space-y-6">
            {/* 1. Đặc điểm tình hình & Sĩ số */}
            <section>
              <h4 className="font-bold text-sm text-[#23395d] uppercase tracking-wider mb-2 border-b border-[#23395d]/20 pb-1 flex items-center gap-2">
                <span>I. Đặc điểm tình hình & Duy trì sĩ số học sinh</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={2}
                  value={editPeriod.attendanceText || ''}
                  onChange={(e) => setEditPeriod({ ...editPeriod, attendanceText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-[#23395d] outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editPeriod.attendanceText}
              </div>
            </section>

            {/* 2. Đánh giá học tập 12 môn học */}
            <section>
              <h4 className="font-bold text-sm text-teal-900 uppercase tracking-wider mb-2 border-b border-teal-200 pb-1 flex items-center gap-2">
                <span>II. Kết quả đánh giá giáo dục 12 môn học (Thông tư 27/2020/TT-BGDĐT)</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={4}
                  value={editPeriod.academicSummary || ''}
                  onChange={(e) => setEditPeriod({ ...editPeriod, academicSummary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-teal-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-teal-50/40 p-3.5 rounded-xl border border-teal-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editPeriod.academicSummary}
              </div>
            </section>

            {/* 3. Đánh giá Năng lực */}
            <section>
              <h4 className="font-bold text-sm text-blue-900 uppercase tracking-wider mb-2 border-b border-blue-200 pb-1 flex items-center gap-2">
                <span>III. Đánh giá sự hình thành và phát triển Năng lực</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editPeriod.competenceSummary || ''}
                  onChange={(e) => setEditPeriod({ ...editPeriod, competenceSummary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-blue-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-blue-50/40 p-3.5 rounded-xl border border-blue-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editPeriod.competenceSummary}
              </div>
            </section>

            {/* 4. Đánh giá Phẩm chất */}
            <section>
              <h4 className="font-bold text-sm text-indigo-900 uppercase tracking-wider mb-2 border-b border-indigo-200 pb-1 flex items-center gap-2">
                <span>IV. Đánh giá sự hình thành và phát triển 5 Phẩm chất chủ yếu</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editPeriod.qualitySummary || ''}
                  onChange={(e) => setEditPeriod({ ...editPeriod, qualitySummary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-indigo-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editPeriod.qualitySummary}
              </div>
            </section>

            {/* 5. Hoạt động Đội, Thể chất & Bán trú */}
            <section>
              <h4 className="font-bold text-sm text-amber-900 uppercase tracking-wider mb-2 border-b border-amber-200 pb-1 flex items-center gap-2">
                <span>V. Hoạt động Đội TNTP, Phong trào thi đua & Công tác bán trú</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editPeriod.movementSummary || ''}
                  onChange={(e) => setEditPeriod({ ...editPeriod, movementSummary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-amber-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-amber-50/40 p-3.5 rounded-xl border border-amber-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editPeriod.movementSummary}
              </div>
            </section>

            {/* 6. Khen thưởng danh hiệu */}
            <section>
              <h4 className="font-bold text-sm text-rose-900 uppercase tracking-wider mb-2 border-b border-rose-200 pb-1 flex items-center gap-2">
                <span>VI. Danh sách đề nghị Tuyên dương & Khen thưởng</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editPeriod.praiseSummary || ''}
                  onChange={(e) => setEditPeriod({ ...editPeriod, praiseSummary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-rose-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-rose-50/40 p-3.5 rounded-xl border border-rose-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editPeriod.praiseSummary}
              </div>
            </section>

            {/* 7. Phương hướng & Biện pháp */}
            <section>
              <h4 className="font-bold text-sm text-emerald-900 uppercase tracking-wider mb-2 border-b border-emerald-200 pb-1 flex items-center gap-2">
                <span>VII. Phương hướng, mục tiêu & Biện pháp thực hiện giai đoạn tới</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editPeriod.directionPlan || ''}
                  onChange={(e) => setEditPeriod({ ...editPeriod, directionPlan: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-emerald-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editPeriod.directionPlan}
              </div>
            </section>

            {/* 8. Nhận xét của GVCN */}
            <section>
              <h4 className="font-bold text-sm text-purple-900 uppercase tracking-wider mb-2 border-b border-purple-200 pb-1 flex items-center gap-2">
                <span>VIII. Nhận xét & Đánh giá chung của Giáo viên chủ nhiệm</span>
              </h4>
              <div className="no-print mb-2">
                <textarea
                  rows={3}
                  value={editPeriod.teacherNote || ''}
                  onChange={(e) => setEditPeriod({ ...editPeriod, teacherNote: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-purple-600 outline-none transition font-sans"
                />
              </div>
              <div className="text-xs bg-purple-50/40 p-3.5 rounded-xl border border-purple-200/60 leading-relaxed text-slate-800 whitespace-pre-wrap">
                {editPeriod.teacherNote}
              </div>
            </section>
          </div>
        )}

        {/* SIGNATURE BLOCK */}
        <section className="pt-8 mt-8 border-t border-slate-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="text-center w-full sm:w-64">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-14">
                BAN GIÁM HIỆU DUYỆT
              </p>
              <p className="text-xs text-slate-400 italic">
                (Ký và ghi rõ họ tên)
              </p>
            </div>

            <div className="text-center w-full sm:w-64">
              <p className="text-xs text-slate-600 italic mb-1">
                {printDateFormatted}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-14">
                GIÁO VIÊN CHỦ NHIỆM
              </p>
              <p className="font-bold text-sm text-slate-900 border-t border-slate-300 pt-1 inline-block min-w-[150px]">
                {appData.settings.teacher || 'Phạm Thị Hồng Anh'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
