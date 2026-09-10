import React, { useState } from 'react';
import { 
  Trophy, 
  PlusCircle, 
  MinusCircle, 
  RotateCcw, 
  Award, 
  Medal, 
  Sparkles, 
  Clock, 
  Check, 
  Flame,
  Star
} from 'lucide-react';
import { Student, DisciplineLog } from '../types';

interface DisciplineViewProps {
  students: Student[];
  disciplinePoints: { [studentId: number]: number };
  disciplineLogs: DisciplineLog[];
  onAddPoints: (studentId: number, points: number, reason: string) => void;
  onResetPoints: () => void;
}

export const DisciplineView: React.FC<DisciplineViewProps> = ({
  students,
  disciplinePoints,
  disciplineLogs,
  onAddPoints,
  onResetPoints,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students.length > 0 ? String(students[0].id) : ''
  );
  const [customPoints, setCustomPoints] = useState<number>(1);
  const [customReason, setCustomReason] = useState<string>('');

  const sortedStudentIds = [...students].sort(
    (a, b) => (disciplinePoints[b.id] || 100) - (disciplinePoints[a.id] || 100)
  );

  const handleQuickAdd = (pts: number, reason: string) => {
    if (!selectedStudentId) return;
    onAddPoints(Number(selectedStudentId), pts, reason);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !customReason.trim()) return;
    onAddPoints(Number(selectedStudentId), Number(customPoints), customReason.trim());
    setCustomReason('');
  };

  // Top 3 Podium
  const top1 = sortedStudentIds[0];
  const top2 = sortedStudentIds[1];
  const top3 = sortedStudentIds[2];

  return (
    <div id="view-discipline" className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Thi đua - Nề nếp & Khen thưởng
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cộng trừ điểm thi đua theo hành vi tích cực và nhắc nhở nền nếp hàng ngày (Điểm chuẩn: 100đ)
          </p>
        </div>

        <button
          onClick={onResetPoints}
          className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
          title="Đặt lại 100 điểm cho toàn bộ lớp sang tuần mới"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Làm mới tuần mới (100đ)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Quick Actions & Custom Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5">
            <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Cộng / Trừ điểm nhanh học sinh
            </h3>

            {/* Select Student */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Chọn học sinh áp dụng:
              </label>
              <select
                id="disc-student-select"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition"
              >
                {students.map((s) => {
                  const pts = disciplinePoints[s.id] || 100;
                  return (
                    <option key={s.id} value={s.id}>
                      {s.name} (Tổ {s.group}) — {pts} điểm
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Predefined Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Positive actions */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mb-2">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>Hành vi tốt (+ điểm)</span>
                </p>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(2, 'Phát biểu xây dựng bài sôi nổi')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition flex items-center justify-between"
                >
                  <span>Phát biểu xây dựng bài</span>
                  <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[10px] font-bold">+2</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(2, 'Hoàn thành tốt nhiệm vụ được giao')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition flex items-center justify-between"
                >
                  <span>Hoàn thành tốt nhiệm vụ</span>
                  <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[10px] font-bold">+2</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(3, 'Làm việc tốt giúp đỡ bạn bè')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition flex items-center justify-between"
                >
                  <span>Làm việc tốt / Giúp bạn</span>
                  <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[10px] font-bold">+3</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(1, 'Trực nhật lớp sạch sẽ, đúng giờ')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition flex items-center justify-between"
                >
                  <span>Trực nhật lớp sạch sẽ</span>
                  <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[10px] font-bold">+1</span>
                </button>
              </div>

              {/* Reminders / Negative actions */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-rose-700 flex items-center gap-1.5 mb-2">
                  <MinusCircle className="w-4 h-4 text-rose-600" />
                  <span>Cần nhắc nhở (- điểm)</span>
                </p>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(-1, 'Quên mang đồ dùng học tập')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50/80 text-rose-800 border border-rose-200/80 hover:bg-rose-100 transition flex items-center justify-between"
                >
                  <span>Quên đồ dùng học tập</span>
                  <span className="bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded text-[10px] font-bold">-1</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(-1, 'Nói chuyện riêng, làm mất trật tự')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50/80 text-rose-800 border border-rose-200/80 hover:bg-rose-100 transition flex items-center justify-between"
                >
                  <span>Nói chuyện riêng / Mất TT</span>
                  <span className="bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded text-[10px] font-bold">-1</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(-2, 'Chưa làm bài tập về nhà')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50/80 text-rose-800 border border-rose-200/80 hover:bg-rose-100 transition flex items-center justify-between"
                >
                  <span>Chưa làm bài tập về nhà</span>
                  <span className="bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded text-[10px] font-bold">-2</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(-1, 'Đi học muộn hoặc xếp hàng chậm')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50/80 text-rose-800 border border-rose-200/80 hover:bg-rose-100 transition flex items-center justify-between"
                >
                  <span>Đi học muộn / Xếp hàng</span>
                  <span className="bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded text-[10px] font-bold">-1</span>
                </button>
              </div>
            </div>

            {/* Custom point entry */}
            <form onSubmit={handleCustomSubmit} className="mt-5 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nhập lý do & điểm tùy chỉnh:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customPoints}
                  onChange={(e) => setCustomPoints(Number(e.target.value))}
                  className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-800 text-center focus:bg-white focus:border-blue-500 outline-none"
                  placeholder="± Điểm"
                  title="Điểm cộng hoặc trừ"
                />
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Nhập lý do khen hoặc nhắc nhở..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-2xs shrink-0"
                >
                  Ghi điểm
                </button>
              </div>
            </form>
          </div>

          {/* Recent Discipline Logs */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Nhật ký nề nếp gần đây</span>
            </h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {disciplineLogs.length === 0 ? (
                <li className="text-xs text-slate-400 italic py-2">Chưa có nhật ký ghi nhận.</li>
              ) : (
                disciplineLogs.map((log) => {
                  const isPlus = log.points > 0;
                  return (
                    <li key={log.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 mr-2">{log.studentName}:</span>
                        <span className="text-slate-600">{log.reason}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                            isPlus
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {isPlus ? `+${log.points}` : log.points}
                        </span>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>

        {/* Right Column: Podium & Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-800">Bảng xếp hạng thi đua lớp</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Cập nhật trực tiếp
            </span>
          </div>

          {/* Top 3 Podium Visualizer */}
          {top1 && (
            <div className="flex justify-center items-end gap-3 sm:gap-6 my-4 pt-4 border-b border-slate-100 pb-6">
              {/* 2nd Place */}
              {top2 && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center text-xl mb-2 shadow-2xs border border-slate-200">
                    <Medal className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="w-20 h-24 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl flex flex-col items-center justify-start pt-2 border-t border-l border-r border-white shadow-2xs">
                    <span className="text-base font-black text-slate-500">2</span>
                    <span className="text-[11px] font-bold text-slate-700 truncate w-full text-center px-1">
                      {top2.name.split(' ').pop()}
                    </span>
                    <span className="text-xs font-extrabold text-slate-600 mt-1">
                      {disciplinePoints[top2.id] || 100}đ
                    </span>
                  </div>
                </div>
              )}

              {/* 1st Place (Center, Tallest) */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center text-2xl mb-2 shadow-md shadow-amber-500/20 border border-amber-300 relative">
                  <Trophy className="w-7 h-7 text-amber-500 fill-amber-400" />
                  <span className="absolute -top-1.5 -right-1.5 text-xs">👑</span>
                </div>
                <div className="w-24 h-32 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-2xl flex flex-col items-center justify-start pt-2 border-t border-l border-r border-white shadow-sm">
                  <span className="text-lg font-black text-amber-700">1</span>
                  <span className="text-xs font-bold text-slate-800 truncate w-full text-center px-1">
                    {top1.name.split(' ').pop()}
                  </span>
                  <span className="text-sm font-black text-amber-700 mt-1">
                    {disciplinePoints[top1.id] || 100}đ
                  </span>
                </div>
              </div>

              {/* 3rd Place */}
              {top3 && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl mb-2 shadow-2xs border border-amber-200">
                    <Award className="w-6 h-6 text-amber-700" />
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-t from-amber-100 to-amber-50 rounded-t-2xl flex flex-col items-center justify-start pt-2 border-t border-l border-r border-white shadow-2xs">
                    <span className="text-base font-black text-amber-700">3</span>
                    <span className="text-[11px] font-bold text-slate-700 truncate w-full text-center px-1">
                      {top3.name.split(' ').pop()}
                    </span>
                    <span className="text-xs font-extrabold text-amber-700 mt-1">
                      {disciplinePoints[top3.id] || 100}đ
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full List Leaderboard */}
          <div className="flex-1 overflow-y-auto pr-1">
            <ul id="leaderboard-list" className="space-y-1.5">
              {sortedStudentIds.map((s, index) => {
                const pts = disciplinePoints[s.id] || 100;
                const rankNum = index + 1;
                let badgeNode = (
                  <span className="text-xs font-bold text-slate-400 w-6 text-center inline-block">
                    {rankNum}
                  </span>
                );

                if (rankNum === 1) badgeNode = <span className="text-base">🥇</span>;
                else if (rankNum === 2) badgeNode = <span className="text-base">🥈</span>;
                else if (rankNum === 3) badgeNode = <span className="text-base">🥉</span>;

                const isLow = pts < 95;

                return (
                  <li
                    key={s.id}
                    className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      {badgeNode}
                      <div>
                        <span className="text-xs font-semibold text-slate-800">{s.name}</span>
                        <span className="text-[10px] text-slate-400 block">Tổ {s.group}</span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        isLow
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {pts} điểm
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
