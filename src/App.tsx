import React, { useState, useEffect } from 'react';
import { 
  AppData, 
  ActiveTab, 
  Student, 
  AttendanceDayRecord, 
  StudentAcademics, 
  AppSettings,
  DailyReportRecord,
  WeeklyReportRecord,
  PeriodReportRecord
} from './types';
import { INITIAL_APP_DATA } from './data';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { AttendanceView } from './components/AttendanceView';
import { DisciplineView } from './components/DisciplineView';
import { AcademicsView } from './components/AcademicsView';
import { ParentsView } from './components/ParentsView';
import { ReportsView } from './components/ReportsView';
import { AIAssistantView } from './components/AIAssistantView';
import { SettingsView } from './components/SettingsView';

const STORAGE_KEY = 'gvcn4_data';

export default function App() {
  const [appData, setAppData] = useState<AppData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.students)) {
          // Ensure class is 4C and teacher is Phạm Thị Hồng Anh if previously default
          if (parsed.settings) {
            if (parsed.settings.school === 'Trường Tiểu học Chu Văn An' || parsed.settings.school === 'Trường Tiểu học' || !parsed.settings.school) {
              parsed.settings.school = 'Trường Tiểu học Lê Hồng Phong';
            }
            if (parsed.settings.class === '4A' || !parsed.settings.class) {
              parsed.settings.class = '4C';
            }
            if (parsed.settings.teacher === 'Nguyễn Thị Mai Hương' || !parsed.settings.teacher) {
              parsed.settings.teacher = 'Phạm Thị Hồng Anh';
            }
          }
          // Auto-heal students if group can be inferred from note (e.g. Lê Nhã Đan "Tổ trưởng tổ 5")
          parsed.students = parsed.students.map((st: any) => {
            if (st.note) {
              const noteLower = String(st.note).toLowerCase();
              const m = noteLower.match(/tổ\s*(?:trưởng|phó|viên)?\s*(\d+)/);
              if (m) {
                const gNum = parseInt(m[1], 10);
                if (gNum >= 1 && gNum <= 6) {
                  st.group = gNum;
                }
              } else if (noteLower.includes('tổ 6') || noteLower.includes('tổ sáu')) {
                st.group = 6;
              } else if (noteLower.includes('tổ 5') || noteLower.includes('tổ năm')) {
                st.group = 5;
              } else if (noteLower.includes('tổ 4') || noteLower.includes('tổ bốn') || noteLower.includes('tổ tư')) {
                st.group = 4;
              } else if (noteLower.includes('tổ 3') || noteLower.includes('tổ ba')) {
                st.group = 3;
              } else if (noteLower.includes('tổ 2') || noteLower.includes('tổ hai')) {
                st.group = 2;
              }
            }
            return st;
          });
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse localStorage data, using defaults:', e);
    }
    return INITIAL_APP_DATA;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [studentSearchKeyword, setStudentSearchKeyword] = useState<string>('');

  // Persist data whenever appData updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [appData]);

  // Toast notification helper
  const showToast = (text: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global search navigates to students tab
  const handleGlobalSearch = (keyword: string) => {
    setStudentSearchKeyword(keyword);
    setActiveTab('students');
  };

  // 1. Todo Handlers
  const handleAddTodo = (task: string) => {
    const newTodo = {
      id: `todo-${Date.now()}`,
      task,
      done: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAppData((prev) => ({
      ...prev,
      todos: [newTodo, ...prev.todos],
    }));
    showToast('Đã thêm công việc vào danh sách!', 'success');
  };

  const handleToggleTodo = (id: string) => {
    setAppData((prev) => ({
      ...prev,
      todos: prev.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  };

  const handleDeleteTodo = (id: string) => {
    setAppData((prev) => ({
      ...prev,
      todos: prev.todos.filter((t) => t.id !== id),
    }));
    showToast('Đã xóa công việc.', 'info');
  };

  // 2. Student Handlers
  const handleSaveStudent = (student: Student, isEdit: boolean) => {
    setAppData((prev) => {
      let updatedStudents = [...prev.students];
      let updatedDiscipline = { ...prev.discipline };

      if (isEdit) {
        const index = updatedStudents.findIndex((s) => s.id === student.id);
        if (index !== -1) {
          updatedStudents[index] = student;
        }
      } else {
        updatedStudents.push(student);
        if (!updatedDiscipline[student.id]) {
          updatedDiscipline[student.id] = 100;
        }
      }

      return {
        ...prev,
        students: updatedStudents,
        discipline: updatedDiscipline,
      };
    });

    showToast(isEdit ? `Đã cập nhật học sinh ${student.name}` : `Đã thêm học sinh mới: ${student.name}`);
  };

  const handleDeleteStudent = (id: number) => {
    const s = appData.students.find((x) => x.id === id);
    setAppData((prev) => {
      const updatedStudents = prev.students.filter((x) => x.id !== id);
      const updatedDiscipline = { ...prev.discipline };
      delete updatedDiscipline[id];
      const updatedAcademics = { ...prev.academics };
      delete updatedAcademics[id];

      return {
        ...prev,
        students: updatedStudents,
        discipline: updatedDiscipline,
        academics: updatedAcademics,
      };
    });
    showToast(`Đã xóa học sinh ${s?.name || ''}`, 'info');
  };

  const handleBatchImportStudents = (
    imported: Omit<Student, 'id'>[],
    mode: 'append' | 'replace'
  ) => {
    const timestamp = Date.now();
    const newStudents: Student[] = imported.map((item, idx) => ({
      ...item,
      id: timestamp + idx + 1,
    }));

    setAppData((prev) => {
      let finalStudents: Student[];
      let finalDiscipline = { ...prev.discipline };
      let finalAcademics = { ...prev.academics };

      if (mode === 'replace') {
        finalStudents = newStudents;
        finalDiscipline = {};
        finalAcademics = {};
        newStudents.forEach((s) => {
          finalDiscipline[s.id] = 100;
        });
      } else {
        finalStudents = [...prev.students, ...newStudents];
        newStudents.forEach((s) => {
          if (!finalDiscipline[s.id]) {
            finalDiscipline[s.id] = 100;
          }
        });
      }

      return {
        ...prev,
        students: finalStudents,
        discipline: finalDiscipline,
        academics: finalAcademics,
      };
    });

    showToast(
      mode === 'replace'
        ? `Đã thay thế toàn bộ bằng ${imported.length} học sinh từ file Excel!`
        : `Đã nhập thêm ${imported.length} học sinh từ file Excel thành công!`,
      'success'
    );
  };

  // 3. Attendance Handler
  const handleSaveAttendance = (date: string, record: AttendanceDayRecord) => {
    setAppData((prev) => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        [date]: record,
      },
    }));
    showToast(`Đã lưu bảng điểm danh ngày ${date.split('-').reverse().join('/')}!`, 'success');
  };

  // 4. Discipline Handlers
  const handleAddDisciplinePoints = (studentId: number, points: number, reason: string) => {
    const targetStudent = appData.students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    const newLog = {
      id: `log-${Date.now()}`,
      studentId,
      studentName: targetStudent.name,
      points,
      reason,
      timestamp: 'Hôm nay, ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setAppData((prev) => {
      const currentPts = prev.discipline[studentId] || 100;
      return {
        ...prev,
        discipline: {
          ...prev.discipline,
          [studentId]: currentPts + points,
        },
        disciplineLogs: [newLog, ...prev.disciplineLogs.slice(0, 19)], // Keep last 20 logs
      };
    });

    const ptStr = points > 0 ? `+${points}` : String(points);
    showToast(`${ptStr} điểm: ${targetStudent.name} (${reason})`, points > 0 ? 'success' : 'warning');
  };

  const handleResetDisciplinePoints = () => {
    const resetMap: { [id: number]: number } = {};
    appData.students.forEach((s) => {
      resetMap[s.id] = 100;
    });
    setAppData((prev) => ({
      ...prev,
      discipline: resetMap,
    }));
    showToast('Đã làm mới điểm thi đua 100đ cho tất cả học sinh tuần mới!', 'success');
  };

  // 5. Academics Handler
  const handleSaveAcademics = (updated: { [studentId: number]: StudentAcademics }) => {
    setAppData((prev) => ({
      ...prev,
      academics: updated,
    }));
    showToast('Đã lưu kết quả đánh giá học tập 12 môn!', 'success');
  };

  // 6. Reports Handlers
  const handleUpdateReportNote = (note: string) => {
    setAppData((prev) => ({
      ...prev,
      reportNote: note,
    }));
  };

  const handleSaveDailyReport = (record: DailyReportRecord) => {
    setAppData((prev) => ({
      ...prev,
      dailyReports: {
        ...(prev.dailyReports || {}),
        [record.date]: record,
      },
    }));
    showToast(`Đã lưu báo cáo ngày ${record.date.split('-').reverse().join('/')}!`, 'success');
  };

  const handleSaveWeeklyReport = (record: WeeklyReportRecord) => {
    setAppData((prev) => ({
      ...prev,
      weeklyReports: {
        ...(prev.weeklyReports || {}),
        [record.week]: record,
      },
    }));
    showToast(`Đã lưu báo cáo tổng kết Tuần ${record.week}!`, 'success');
  };

  const handleSavePeriodReport = (record: PeriodReportRecord) => {
    setAppData((prev) => ({
      ...prev,
      periodReports: {
        ...(prev.periodReports || {}),
        [record.periodKey]: record,
      },
    }));
    showToast(`Đã lưu ${record.title}!`, 'success');
  };

  // 7. AI Apply to Report
  const handleApplyAIToReport = (rawText: string) => {
    let cleanText = rawText
      .replace(/^[\s"“]+|[\s"”]+$/g, '')
      .replace(/\*\*Gợi ý.*?\*\*/gi, '')
      .trim();

    setAppData((prev) => ({
      ...prev,
      reportNote: cleanText,
    }));
  };

  // 8. Settings Handlers
  const handleSaveSettings = (newSettings: AppSettings) => {
    setAppData((prev) => ({
      ...prev,
      settings: newSettings,
    }));
  };

  const handleRestoreData = (restored: AppData) => {
    setAppData(restored);
  };

  const handleFactoryReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAppData(INITIAL_APP_DATA);
    showToast('Đã khôi phục cài đặt mặc định của hệ thống!', 'info');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        classNameLabel={appData.settings.class}
      />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <Topbar
          settings={appData.settings}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onGlobalSearch={handleGlobalSearch}
          onPrintReport={() => {
            setActiveTab('reports');
            setTimeout(() => window.print(), 200);
          }}
        />

        {/* Dynamic Views Container */}
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto w-full">
            {activeTab === 'dashboard' && (
              <DashboardView
                appData={appData}
                onAddTodo={handleAddTodo}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'students' && (
              <StudentsView
                students={appData.students}
                settings={appData.settings}
                onSaveStudent={handleSaveStudent}
                onDeleteStudent={handleDeleteStudent}
                onImportStudents={handleBatchImportStudents}
                initialSearch={studentSearchKeyword}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceView
                students={appData.students}
                attendanceRecords={appData.attendance}
                onSaveAttendance={handleSaveAttendance}
              />
            )}

            {activeTab === 'discipline' && (
              <DisciplineView
                students={appData.students}
                disciplinePoints={appData.discipline}
                disciplineLogs={appData.disciplineLogs}
                onAddPoints={handleAddDisciplinePoints}
                onResetPoints={handleResetDisciplinePoints}
              />
            )}

            {activeTab === 'academics' && (
              <AcademicsView
                students={appData.students}
                academics={appData.academics}
                onSaveAcademics={handleSaveAcademics}
              />
            )}

            {activeTab === 'parents' && (
              <ParentsView
                students={appData.students}
                settings={appData.settings}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                appData={appData}
                onUpdateReportNote={handleUpdateReportNote}
                onSaveDailyReport={handleSaveDailyReport}
                onSaveWeeklyReport={handleSaveWeeklyReport}
                onSavePeriodReport={handleSavePeriodReport}
                onNavigateTab={setActiveTab}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'ai' && (
              <AIAssistantView
                settings={appData.settings}
                onApplyToReport={handleApplyAIToReport}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={appData.settings}
                appData={appData}
                onSaveSettings={handleSaveSettings}
                onRestoreData={handleRestoreData}
                onFactoryReset={handleFactoryReset}
                onShowToast={showToast}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
