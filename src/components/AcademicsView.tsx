import React, { useState } from 'react';
import { 
  BookOpen, 
  Filter, 
  Save, 
  X, 
  AlertTriangle, 
  CheckCircle2,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Student, StudentAcademics, AcademicRating } from '../types';
import { GRADE_4_SUBJECTS } from '../data';

interface AcademicsViewProps {
  students: Student[];
  academics: { [studentId: number]: StudentAcademics };
  onSaveAcademics: (updated: { [studentId: number]: StudentAcademics }) => void;
}

export const AcademicsView: React.FC<AcademicsViewProps> = ({
  students,
  academics,
  onSaveAcademics,
}) => {
  const [localAcademics, setLocalAcademics] = useState<{ [studentId: number]: StudentAcademics }>(() => {
    const initial: { [studentId: number]: StudentAcademics } = {};
    students.forEach((s) => {
      initial[s.id] = academics[s.id] || {
        math: 'HT',
        vn: 'HT',
        nn: 'HT',
        dd: 'HT',
        kh: 'HT',
        his_geo: 'HT',
        tin: 'HT',
        cn: 'HT',
        gdtc: 'HT',
        an: 'HT',
        mt: 'HT',
        hdtn: 'HT',
        note: '',
      };
    });
    return initial;
  });

  const [filterOnlyCHT, setFilterOnlyCHT] = useState(false);

  const handleRatingChange = (studentId: number, subjectKey: string, rating: AcademicRating) => {
    setLocalAcademics((prev) => {
      const studentData = prev[studentId] || {
        math: 'HT',
        vn: 'HT',
        nn: 'HT',
        dd: 'HT',
        kh: 'HT',
        his_geo: 'HT',
        tin: 'HT',
        cn: 'HT',
        gdtc: 'HT',
        an: 'HT',
        mt: 'HT',
        hdtn: 'HT',
        note: '',
      };
      return {
        ...prev,
        [studentId]: {
          ...studentData,
          [subjectKey]: rating,
        },
      };
    });
  };

  const handleNoteChange = (studentId: number, note: string) => {
    setLocalAcademics((prev) => {
      const studentData = prev[studentId] || {
        math: 'HT',
        vn: 'HT',
        nn: 'HT',
        dd: 'HT',
        kh: 'HT',
        his_geo: 'HT',
        tin: 'HT',
        cn: 'HT',
        gdtc: 'HT',
        an: 'HT',
        mt: 'HT',
        hdtn: 'HT',
        note: '',
      };
      return {
        ...prev,
        [studentId]: {
          ...studentData,
          note,
        },
      };
    });
  };

  const handleSave = () => {
    onSaveAcademics(localAcademics);
  };

  // Helper check if student has any CHT
  const hasCHT = (studentId: number) => {
    const data = localAcademics[studentId];
    if (!data) return false;
    return GRADE_4_SUBJECTS.some((sub) => data[sub.key as keyof StudentAcademics] === 'CHT');
  };

  // Filtered student list
  const displayedStudents = filterOnlyCHT
    ? students.filter((s) => hasCHT(s.id))
    : students;

  const totalCHTCount = students.filter((s) => hasCHT(s.id)).length;

  const getSelectClasses = (rating: AcademicRating) => {
    if (rating === 'HTT') {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
    }
    if (rating === 'CHT') {
      return 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
    }
    return 'bg-amber-50 text-amber-900 border-amber-200';
  };

  return (
    <div id="view-academics" className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-600" />
            Theo dõi học tập 12 môn (Thông tư 27)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Đánh giá theo 3 mức: Hoàn thành tốt (HTT), Hoàn thành (HT) và Chưa hoàn thành (CHT)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOnlyCHT(!filterOnlyCHT)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs ${
              filterOnlyCHT
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filterOnlyCHT ? 'Bỏ lọc (Xem tất cả)' : `Lọc HS cần hỗ trợ CHT (${totalCHTCount})`}</span>
          </button>
        </div>
      </div>

      {/* Legend & Guide */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700">Mức xếp loại:</span>
          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-bold border border-emerald-200">
            HTT (Hoàn thành tốt)
          </span>
          <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-semibold border border-amber-200">
            HT (Hoàn thành)
          </span>
          <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-lg font-bold border border-rose-200">
            CHT (Chưa hoàn thành)
          </span>
        </div>
        <div className="text-[11px] text-slate-400 italic flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Cột tên học sinh được cố định khi cuộn ngang 12 môn học.</span>
        </div>
      </div>

      {/* Table with fixed left column */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto relative w-full">
          <table className="min-w-max w-full divide-y divide-slate-200 text-xs table-fixed">
            <thead className="bg-slate-50">
              <tr>
                {/* Sticky student column */}
                <th className="w-48 px-4 py-3 text-left font-bold text-slate-700 uppercase sticky left-0 bg-slate-100 z-20 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                  Học sinh
                </th>
                {GRADE_4_SUBJECTS.map((sub) => (
                  <th
                    key={sub.key}
                    className="w-24 px-1.5 py-3 text-center font-bold text-slate-600 uppercase"
                    title={sub.name}
                  >
                    {sub.shortName}
                  </th>
                ))}
                <th className="w-64 px-4 py-3 text-left font-bold text-slate-600 uppercase border-l border-slate-200">
                  Nhận xét / Biện pháp hỗ trợ
                </th>
              </tr>
            </thead>
            <tbody id="academics-table-body" className="divide-y divide-slate-100 bg-white">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400 italic text-sm">
                    {filterOnlyCHT
                      ? 'Không có học sinh nào xếp loại Chưa hoàn thành (CHT) ở bất kỳ môn nào!'
                      : 'Không có dữ liệu học sinh.'}
                  </td>
                </tr>
              ) : (
                displayedStudents.map((s, idx) => {
                  const studentData = localAcademics[s.id] || {
                    math: 'HT',
                    vn: 'HT',
                    nn: 'HT',
                    dd: 'HT',
                    kh: 'HT',
                    his_geo: 'HT',
                    tin: 'HT',
                    cn: 'HT',
                    gdtc: 'HT',
                    an: 'HT',
                    mt: 'HT',
                    hdtn: 'HT',
                    note: '',
                  };
                  const studentHasCHT = hasCHT(s.id);

                  return (
                    <tr
                      key={s.id}
                      className={`transition-colors ${
                        studentHasCHT ? 'bg-rose-50/40 hover:bg-rose-50' : 'hover:bg-blue-50/40'
                      }`}
                    >
                      {/* Sticky left name column */}
                      <td
                        className={`px-4 py-2.5 font-bold sticky left-0 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] whitespace-nowrap ${
                          studentHasCHT ? 'bg-rose-50/90 text-rose-950' : 'bg-white text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{idx + 1}. {s.name}</span>
                          {studentHasCHT && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Có môn CHT" />
                          )}
                        </div>
                      </td>

                      {/* 12 Subjects select */}
                      {GRADE_4_SUBJECTS.map((sub) => {
                        const currentRating =
                          (studentData[sub.key as keyof StudentAcademics] as AcademicRating) || 'HT';

                        return (
                          <td key={sub.key} className="px-1 py-1.5 text-center">
                            <select
                              value={currentRating}
                              onChange={(e) =>
                                handleRatingChange(
                                  s.id,
                                  sub.key,
                                  e.target.value as AcademicRating
                                )
                              }
                              className={`w-full py-1.5 px-1 rounded-lg text-xs outline-none border focus:ring-1 focus:ring-blue-400 cursor-pointer text-center ${getSelectClasses(
                                currentRating
                              )}`}
                            >
                              <option value="HTT">HTT</option>
                              <option value="HT">HT</option>
                              <option value="CHT">CHT</option>
                            </select>
                          </td>
                        );
                      })}

                      {/* Notes input */}
                      <td className="px-3 py-1.5 border-l border-slate-200">
                        <input
                          type="text"
                          value={studentData.note || ''}
                          onChange={(e) => handleNoteChange(s.id, e.target.value)}
                          placeholder="Nhập ghi chú hoặc biện pháp phụ đạo..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:border-blue-500 outline-none"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer save bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Số học sinh cần hỗ trợ (có ít nhất 1 môn CHT): <strong>{totalCHTCount} em</strong>.
          </div>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition font-bold text-xs shadow-xs flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu đánh giá học tập 12 môn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
