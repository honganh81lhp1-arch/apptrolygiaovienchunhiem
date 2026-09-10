import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Calendar, 
  CheckCheck, 
  Save, 
  Clock, 
  AlertCircle, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';
import { Student, AttendanceStatus, AttendanceDayRecord } from '../types';

interface AttendanceViewProps {
  students: Student[];
  attendanceRecords: { [date: string]: AttendanceDayRecord };
  onSaveAttendance: (date: string, record: AttendanceDayRecord) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  attendanceRecords,
  onSaveAttendance,
}) => {
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());

  // Current day record state
  const currentRecord = attendanceRecords[selectedDate] || {};
  const [localRecord, setLocalRecord] = useState<AttendanceDayRecord>(() => {
    const initial: AttendanceDayRecord = {};
    students.forEach((s) => {
      initial[s.id] = currentRecord[s.id] || 'present';
    });
    return initial;
  });

  // When date changes, load that date's attendance or default to present
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const dayData = attendanceRecords[newDate] || {};
    const updated: AttendanceDayRecord = {};
    students.forEach((s) => {
      updated[s.id] = dayData[s.id] || 'present';
    });
    setLocalRecord(updated);
  };

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setLocalRecord((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAllPresent = () => {
    const updated: AttendanceDayRecord = {};
    students.forEach((s) => {
      updated[s.id] = 'present';
    });
    setLocalRecord(updated);
  };

  const handleSave = () => {
    onSaveAttendance(selectedDate, localRecord);
  };

  // Compute summary metrics for current date
  let countPresent = 0;
  let countAbsentP = 0;
  let countAbsentK = 0;
  let countLate = 0;

  students.forEach((s) => {
    const st = localRecord[s.id] || 'present';
    if (st === 'present') countPresent++;
    else if (st === 'absent_p') countAbsentP++;
    else if (st === 'absent_k') countAbsentK++;
    else if (st === 'late') countLate++;
  });

  const formattedDate = selectedDate.split('-').reverse().join('/');

  return (
    <div id="view-attendance" className="space-y-6 pb-8">
      {/* Header with Date Selection */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-600" />
            Điểm danh nhanh lớp 4
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ghi nhận chuyên cần hàng ngày, phân loại nghỉ phép (P), không phép (K) và đi muộn (M)
          </p>
        </div>

        {/* Date controls */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-600">
            <Calendar className="w-4 h-4 text-[#23395d]" />
            <span>Ngày:</span>
          </div>
          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="border-none outline-none text-xs font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => handleDateChange(getTodayDate())}
            className="text-xs bg-[#23395d]/10 text-[#23395d] hover:bg-[#23395d]/20 font-semibold px-2.5 py-1 rounded-lg transition"
          >
            Hôm nay
          </button>
        </div>
      </div>

      {/* Legend and Quick Actions Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span className="text-slate-700">Có mặt (CM): <strong className="text-emerald-600">{countPresent}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-100" />
            <span className="text-slate-700">Nghỉ phép (P): <strong className="text-amber-600">{countAbsentP}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-100" />
            <span className="text-slate-700">Không phép (K): <strong className="text-rose-600">{countAbsentK}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-orange-100" />
            <span className="text-slate-700">Đi muộn (M): <strong className="text-orange-600">{countLate}</strong></span>
          </div>
        </div>

        {/* Quick action button */}
        <button
          onClick={markAllPresent}
          className="text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Đánh dấu tất cả Có mặt</span>
        </button>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-16">
                  STT
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Họ và tên học sinh
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-20">
                  Tổ
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Trạng thái điểm danh ngày {formattedDate}
                </th>
              </tr>
            </thead>
            <tbody id="attendance-table-body" className="divide-y divide-slate-100 bg-white">
              {students.map((s, idx) => {
                const status = localRecord[s.id] || 'present';

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 text-xs text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span>{s.name}</span>
                        {s.note && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({s.note})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs text-slate-500 font-medium">
                        Tổ {s.group}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        {/* Present */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'present')}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            status === 'present'
                              ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500 shadow-2xs font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span>Có mặt (CM)</span>
                        </button>

                        {/* Absent with permission */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'absent_p')}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            status === 'absent_p'
                              ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-500 shadow-2xs font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span>Phép (P)</span>
                        </button>

                        {/* Absent without permission */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'absent_k')}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            status === 'absent_k'
                              ? 'bg-rose-100 text-rose-800 ring-2 ring-rose-500 shadow-2xs font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          <span>K.Phép (K)</span>
                        </button>

                        {/* Late */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'late')}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                            status === 'late'
                              ? 'bg-orange-100 text-orange-800 ring-2 ring-orange-500 shadow-2xs font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                          <span>Muộn (M)</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer save button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Sĩ số ngày {formattedDate}: <strong>{countPresent + countLate}/{students.length}</strong> em có mặt tại lớp.
          </div>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition font-bold text-xs shadow-xs flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu điểm danh ngày {formattedDate}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
