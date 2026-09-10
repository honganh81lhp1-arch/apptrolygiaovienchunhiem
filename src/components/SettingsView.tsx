import React, { useState } from 'react';
import { 
  Settings, 
  School, 
  Database, 
  Download, 
  Upload, 
  AlertTriangle, 
  Save, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { AppSettings, AppData } from '../types';
import { INITIAL_APP_DATA } from '../data';

interface SettingsViewProps {
  settings: AppSettings;
  appData: AppData;
  onSaveSettings: (newSettings: AppSettings) => void;
  onRestoreData: (restoredData: AppData) => void;
  onFactoryReset: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  appData,
  onSaveSettings,
  onRestoreData,
  onFactoryReset,
  onShowToast,
}) => {
  const [school, setSchool] = useState(settings.school);
  const [classNameVal, setClassNameVal] = useState(settings.class);
  const [teacher, setTeacher] = useState(settings.teacher);
  const [year, setYear] = useState(settings.year);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      school: school.trim() || 'Trường Tiểu học Lê Hồng Phong',
      class: classNameVal.trim() || '4C',
      teacher: teacher.trim() || 'Phạm Thị Hồng Anh',
      year: year.trim() || '2026 - 2027',
    });
    onShowToast('Đã lưu thông tin trường lớp thành công!', 'success');
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-tro-ly-gvcn-lop${settings.class || '4C'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Đã tải xuống file sao lưu backup.json an toàn!', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.students && parsed.settings) {
          onRestoreData(parsed);
          onShowToast('Khôi phục dữ liệu từ file backup thành công!', 'success');
        } else {
          onShowToast('File JSON không đúng định dạng dữ liệu Trợ Lý GVCN!', 'error');
        }
      } catch (err) {
        console.error(err);
        onShowToast('Lỗi đọc file JSON. Vui lòng kiểm tra lại!', 'error');
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  const handleLoadSampleData = () => {
    onRestoreData(INITIAL_APP_DATA);
    setSchool(INITIAL_APP_DATA.settings.school);
    setClassNameVal(INITIAL_APP_DATA.settings.class);
    setTeacher(INITIAL_APP_DATA.settings.teacher);
    setYear(INITIAL_APP_DATA.settings.year);
    onShowToast('Đã nạp bộ dữ liệu mẫu lớp 4 chuẩn Thông tư 27!', 'success');
  };

  return (
    <div id="view-settings" className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700" />
          Cài đặt & Quản lý dữ liệu lớp học
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Tùy chỉnh thông tin trường lớp, giáo viên chủ nhiệm, sao lưu xuất nhập JSON và khôi phục hệ thống
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Class Information */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5">
          <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <School className="w-5 h-5 text-[#23395d]" />
            <span>Thông tin hồ sơ lớp học</span>
          </h3>

          <form onSubmit={handleSettingsSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên trường tiểu học:
              </label>
              <input
                type="text"
                id="set-school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Ví dụ: Trường Tiểu học Lê Hồng Phong"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#23395d] outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên lớp:
                </label>
                <input
                  type="text"
                  id="set-class"
                  value={classNameVal}
                  onChange={(e) => setClassNameVal(e.target.value)}
                  placeholder="Ví dụ: 4C"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#23395d] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Năm học:
                </label>
                <input
                  type="text"
                  id="set-year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Ví dụ: 2026 - 2027"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#23395d] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và tên Giáo viên chủ nhiệm:
              </label>
              <input
                type="text"
                id="set-teacher"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="Ví dụ: Phạm Thị Hồng Anh"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#23395d] outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#23395d] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#192a47] transition shadow-2xs flex items-center justify-center gap-2 mt-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thông tin lớp học</span>
            </button>
          </form>
        </div>

        {/* Right Column: Backup, Restore & Reset */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <span>Sao lưu & Khôi phục cơ sở dữ liệu</span>
          </h3>

          {/* Export Box */}
          <div className="p-4 bg-[#23395d]/5 rounded-xl border border-[#23395d]/15">
            <p className="text-xs text-[#23395d] leading-relaxed mb-3 font-medium">
              Tải toàn bộ dữ liệu gồm {appData.students.length} học sinh, điểm danh, nề nếp thi đua và nhận xét 12 môn học về máy tính dưới dạng tệp tin <strong>backup.json</strong>.
            </p>
            <button
              onClick={handleExportData}
              className="w-full bg-white text-[#23395d] border border-[#23395d]/40 py-2.5 rounded-xl hover:bg-[#23395d]/10 transition text-xs font-bold flex justify-center items-center gap-2 shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải file sao lưu (backup.json)</span>
            </button>
          </div>

          {/* Import Box */}
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-100">
            <p className="text-xs text-amber-900 leading-relaxed mb-2">
              Khôi phục dữ liệu từ tệp tin backup đã lưu. Thao tác này sẽ cập nhật lại toàn bộ danh sách lớp:
            </p>
            <label className="block">
              <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleImportFile}
                className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
              />
            </label>
          </div>

          {/* Quick Mock Data Loader & Reset */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleLoadSampleData}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Nạp lại bộ dữ liệu mẫu Lớp 4 chuẩn</span>
            </button>

            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="w-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Xóa trắng dữ liệu (Khởi tạo lại)</span>
            </button>
          </div>
        </div>
      </div>

      {/* FACTORY RESET CONFIRM MODAL */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-800 text-base">Cảnh báo xóa sạch dữ liệu</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Thao tác này sẽ xóa toàn bộ danh sách học sinh, điểm danh, nề nếp thi đua và đưa ứng dụng về trạng thái mặc định. Bạn có chắc chắn?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  onFactoryReset();
                  setIsResetConfirmOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition shadow-2xs"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
