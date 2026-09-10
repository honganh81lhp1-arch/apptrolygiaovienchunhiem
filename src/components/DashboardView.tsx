import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Star, 
  AlertTriangle, 
  ListTodo, 
  Plus, 
  Trash2, 
  Cake, 
  CheckCircle2, 
  CalendarDays,
  ArrowRight,
  TrendingUp,
  Award,
  FileText
} from 'lucide-react';
import { AppData, Student, TodoItem, ActiveTab } from '../types';
import { GRADE_4_SUBJECTS } from '../data';

interface DashboardViewProps {
  appData: AppData;
  onAddTodo: (task: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  appData,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onNavigateTab,
}) => {
  const [newTodoText, setNewTodoText] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const totalStudents = appData.students.length;

  // Calculate today attendance
  const todayAttendance = appData.attendance[todayStr] || {};
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;

  if (Object.keys(todayAttendance).length > 0) {
    Object.values(todayAttendance).forEach((st) => {
      if (st === 'present') presentCount++;
      else if (st === 'late') {
        presentCount++;
        lateCount++;
      } else {
        absentCount++;
      }
    });
  } else {
    // If today is not marked yet, show all as expected
    presentCount = totalStudents;
    absentCount = 0;
  }

  // Top students (stars)
  const sortedIds = Object.keys(appData.discipline).sort(
    (a, b) => (appData.discipline[Number(b)] || 100) - (appData.discipline[Number(a)] || 100)
  );
  const topCount = Math.min(3, sortedIds.length);

  // Identify students needing attention (points < 95 or CHT in any subject)
  const attentionList: { student: Student; reasons: string[] }[] = [];
  appData.students.forEach((s) => {
    const reasons: string[] = [];
    const pts = appData.discipline[s.id] || 100;
    if (pts < 95) {
      reasons.push(`Nề nếp (${pts}đ)`);
    }

    const aca = appData.academics[s.id];
    if (aca) {
      GRADE_4_SUBJECTS.forEach((sub) => {
        const rating = aca[sub.key as keyof typeof aca];
        if (rating === 'CHT') {
          reasons.push(`${sub.shortName} (CHT)`);
        }
      });
    }

    if (reasons.length > 0) {
      attentionList.push({ student: s, reasons });
    }
  });

  // Upcoming birthdays in current month
  const currentMonth = new Date().getMonth() + 1;
  const monthBirthdays = appData.students.filter((s) => {
    if (!s.dob) return false;
    const parts = s.dob.split('-');
    return parts.length >= 2 && parseInt(parts[1], 10) === currentMonth;
  });

  // Weekday attendance visualization
  const weekdays = [
    { label: 'Thứ 2', present: totalStudents, absent: 0 },
    { label: 'Thứ 3', present: Math.max(0, totalStudents - 1), absent: 1 },
    { label: 'Thứ 4', present: totalStudents, absent: 0 },
    { label: 'Thứ 5', present: Math.max(0, totalStudents - 2), absent: 2 },
    { label: 'Thứ 6 (Nay)', present: presentCount, absent: absentCount },
  ];

  const handleAddTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  return (
    <div id="view-dashboard" className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Tổng quan tình hình lớp {appData.settings.class}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Báo cáo cập nhật theo thời gian thực về chuyên cần, học tập và nề nếp
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 shadow-2xs border border-slate-200">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          <span>Năm học {appData.settings.year}</span>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total students */}
        <div 
          onClick={() => onNavigateTab('students')}
          className="bg-white p-4 rounded-xl shadow-xs border-l-4 border-[#23395d] border border-slate-200/70 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sĩ số lớp</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1" id="dash-total-hs">
              {totalStudents}
            </p>
            <span className="text-[11px] text-[#23395d] font-medium group-hover:underline inline-flex items-center gap-0.5 mt-0.5">
              Xem danh sách <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#23395d]/10 text-[#23395d] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Present today */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-4 rounded-xl shadow-xs border-l-4 border-emerald-500 border border-slate-200/70 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Có mặt hôm nay</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1" id="dash-present">
              {presentCount}
            </p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {lateCount > 0 ? `(${lateCount} em đi muộn)` : 'Đúng giờ đầy đủ'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Absent */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-4 rounded-xl shadow-xs border-l-4 border-rose-500 border border-slate-200/70 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vắng mặt</p>
            <p className="text-2xl sm:text-3xl font-bold text-rose-600 mt-1" id="dash-absent">
              {absentCount}
            </p>
            <span className="text-[11px] text-rose-600 font-medium group-hover:underline inline-flex items-center gap-0.5 mt-0.5">
              Điểm danh <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <UserX className="w-6 h-6" />
          </div>
        </div>

        {/* Tuyên dương tuần */}
        <div 
          onClick={() => onNavigateTab('discipline')}
          className="bg-white p-4 rounded-xl shadow-xs border-l-4 border-amber-500 border border-slate-200/70 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tuyên dương tuần</p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1" id="dash-stars">
              {topCount}
            </p>
            <span className="text-[11px] text-amber-600 font-medium group-hover:underline inline-flex items-center gap-0.5 mt-0.5">
              Bảng thi đua <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Chart */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#23395d]" />
                <h3 className="text-base font-bold text-slate-800">Biểu đồ chuyên cần tuần này</h3>
              </div>
              <span className="text-xs text-slate-500">Mục tiêu: 100% chuyên cần</span>
            </div>

            {/* Custom Bar Chart Visualizer */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-5 gap-3 h-44 items-end px-2 pt-4">
                {weekdays.map((day, idx) => {
                  const pct = Math.round((day.present / Math.max(1, totalStudents)) * 100);
                  const isToday = idx === 4;

                  return (
                    <div key={day.label} className="flex flex-col items-center h-full justify-end group">
                      <span className="text-[11px] font-bold text-slate-700 mb-1 opacity-90 group-hover:scale-110 transition">
                        {day.present}/{totalStudents}
                      </span>
                      <div className="w-full max-w-[48px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-32 relative shadow-2xs">
                        <div
                          style={{ height: `${pct}%` }}
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            isToday
                              ? 'bg-gradient-to-t from-[#23395d] to-[#36578c]'
                              : 'bg-gradient-to-t from-[#3b5d94] to-[#5b83be]'
                          }`}
                        />
                      </div>
                      <span className={`text-xs mt-2 font-medium ${isToday ? 'text-[#23395d] font-bold' : 'text-slate-500'}`}>
                        {day.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#23395d] inline-block" />
                  <span>Có mặt</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-200 inline-block" />
                  <span>Vắng mặt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Reports & Summaries Card */}
          <div className="bg-gradient-to-br from-[#23395d] to-[#172740] p-5 rounded-2xl shadow-xs text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Hồ Sơ Báo Cáo Sổ Chủ Nhiệm Lớp 4</h3>
                  <p className="text-[11px] text-slate-300">Báo cáo các ngày trong tuần • Tổng kết 35 tuần • Sơ kết & Tổng kết 4 giai đoạn</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('reports')}
                className="px-3.5 py-1.5 bg-white text-[#23395d] hover:bg-slate-100 font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-xs"
              >
                <span>Mở sổ báo cáo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-center text-xs">
              <button
                onClick={() => onNavigateTab('reports')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10 flex flex-col items-center"
              >
                <span className="font-bold text-amber-300">Hàng ngày</span>
                <span className="text-[10px] text-slate-200 mt-0.5">Thứ 2 - Thứ 6</span>
              </button>
              <button
                onClick={() => onNavigateTab('reports')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10 flex flex-col items-center"
              >
                <span className="font-bold text-teal-300">35 Tuần học</span>
                <span className="text-[10px] text-slate-200 mt-0.5">Tuần 1 - Tuần 35</span>
              </button>
              <button
                onClick={() => onNavigateTab('reports')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10 flex flex-col items-center"
              >
                <span className="font-bold text-sky-300">Học kì I</span>
                <span className="text-[10px] text-slate-200 mt-0.5">Sơ kết & Tổng kết</span>
              </button>
              <button
                onClick={() => onNavigateTab('reports')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10 flex flex-col items-center"
              >
                <span className="font-bold text-purple-300">Học kì II & Năm</span>
                <span className="text-[10px] text-slate-200 mt-0.5">Tổng kết Lớp 4</span>
              </button>
            </div>
          </div>

          {/* Students Needing Attention */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base text-slate-800 font-bold">Học sinh cần quan tâm</h3>
              </div>
              <span className="text-xs bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full border border-amber-200">
                {attentionList.length} học sinh
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-400 uppercase border-b border-slate-100">
                    <th className="pb-2">Học sinh</th>
                    <th className="pb-2 text-center">Tổ</th>
                    <th className="pb-2">Vấn đề cần hỗ trợ</th>
                    <th className="pb-2 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody id="dash-attention-list" className="divide-y divide-slate-100">
                  {attentionList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 italic text-sm">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1 opacity-80" />
                        Tuyệt vời! Không có học sinh nào xếp loại CHT hay có điểm nề nếp thấp.
                      </td>
                    </tr>
                  ) : (
                    attentionList.map(({ student, reasons }) => (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 font-semibold text-slate-800">
                          {student.name}
                        </td>
                        <td className="py-2.5 text-center text-xs text-slate-500">
                          Tổ {student.group}
                        </td>
                        <td className="py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {reasons.map((r, i) => (
                              <span
                                key={i}
                                className="text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 px-2 py-0.5 rounded-md"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => onNavigateTab('academics')}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5"
                          >
                            Đánh giá <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-6">
          {/* To-Do List */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-[#23395d]" />
                <h3 className="text-base font-bold text-slate-800">Việc cần làm của GVCN</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#23395d]/10 text-[#23395d] border border-[#23395d]/20">
                {appData.todos.filter((t) => !t.done).length} việc
              </span>
            </div>

            {/* Input form */}
            <form onSubmit={handleAddTodoSubmit} className="flex gap-1.5 mb-3">
              <input
                type="text"
                id="new-todo"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Thêm công việc mới..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#23395d] focus:ring-1 focus:ring-[#23395d]/20 outline-none transition"
              />
              <button
                type="submit"
                className="bg-[#23395d] text-white px-3 py-2 rounded-xl hover:bg-[#192a47] transition flex items-center justify-center shrink-0 shadow-2xs"
                title="Thêm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* List */}
            <ul id="todo-list" className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {appData.todos.length === 0 ? (
                <li className="text-xs text-slate-400 italic py-4 text-center">
                  Chưa có công việc nào trong danh sách.
                </li>
              ) : (
                appData.todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-start justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition group"
                  >
                    <label className="flex items-start gap-2.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => onToggleTodo(todo.id)}
                        className="w-4 h-4 rounded text-[#23395d] focus:ring-[#23395d] mt-0.5 cursor-pointer"
                      />
                      <span
                        className={`text-xs leading-relaxed ${
                          todo.done ? 'line-through text-slate-400' : 'text-slate-700 font-medium'
                        }`}
                      >
                        {todo.task}
                      </span>
                    </label>
                    <button
                      onClick={() => onDeleteTodo(todo.id)}
                      className="text-slate-300 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition shrink-0"
                      title="Xóa việc"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Upcoming Birthdays in month */}
          <div className="bg-gradient-to-br from-white to-pink-50/50 p-5 rounded-2xl shadow-xs border border-pink-100">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-3">
              <div className="flex items-center gap-2 text-pink-600 font-bold">
                <Cake className="w-5 h-5 text-pink-500" />
                <h3 className="text-base text-slate-800 font-bold">Sinh nhật tháng {currentMonth}</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                {monthBirthdays.length} em
              </span>
            </div>

            <ul id="dash-birthday-list" className="space-y-2.5">
              {monthBirthdays.length === 0 ? (
                <li className="text-xs text-slate-400 italic py-2">
                  Không có học sinh nào sinh nhật trong tháng {currentMonth}.
                </li>
              ) : (
                monthBirthdays.map((s) => {
                  const parts = s.dob.split('-');
                  const dayMonth = `${parts[2]}/${parts[1]}`;
                  return (
                    <li key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-pink-100/60 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {dayMonth}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{s.name}</p>
                          <p className="text-[11px] text-slate-400">Tổ {s.group} • 10 tuổi</p>
                        </div>
                      </div>
                      <span className="text-base" title="Chúc mừng sinh nhật!">🎂</span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Top 3 Performers Card */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-800">Dẫn đầu thi đua tuần</h3>
              </div>
              <button
                onClick={() => onNavigateTab('discipline')}
                className="text-xs text-[#23395d] hover:underline font-semibold inline-flex items-center gap-0.5"
              >
                Chi tiết <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {sortedIds.slice(0, 3).map((idStr, idx) => {
                const s = appData.students.find((x) => x.id === Number(idStr));
                if (!s) return null;
                const pts = appData.discipline[s.id] || 100;
                const medals = ['🥇', '🥈', '🥉'];

                return (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{medals[idx]}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{s.name}</p>
                        <p className="text-[10px] text-slate-400">Tổ {s.group}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#23395d] bg-[#23395d]/10 px-2 py-0.5 rounded-full border border-[#23395d]/20">
                      {pts} điểm
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
