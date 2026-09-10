import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Phone, 
  X, 
  Users, 
  Filter,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Upload,
  Download,
  FileDown,
  CheckCircle2,
  FileCheck,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { Student, Gender, AppSettings } from '../types';
import { 
  exportStudentsToExcel, 
  downloadStudentTemplate, 
  parseStudentsFromExcel,
  ParsedStudentRow,
  ExcelParseResult,
  ColumnMappingConfig,
  extractStudentFromRow
} from '../utils/excel';

interface StudentsViewProps {
  students: Student[];
  settings?: AppSettings;
  onSaveStudent: (student: Student, isEdit: boolean) => void;
  onDeleteStudent: (id: number) => void;
  onImportStudents?: (imported: Omit<Student, 'id'>[], mode: 'append' | 'replace') => void;
  initialSearch?: string;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  settings,
  onSaveStudent,
  onDeleteStudent,
  onImportStudents,
  initialSearch = '',
}) => {
  const className = settings?.class || '4C';
  const teacherName = settings?.teacher || 'Phạm Thị Hồng Anh';
  const schoolName = settings?.school || 'Trường Tiểu học Lê Hồng Phong';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>('Nam');
  const [group, setGroup] = useState<number>(1);
  const [parent, setParent] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState('');

  // Delete confirm state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Excel Import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [parseResult, setParseResult] = useState<ExcelParseResult | null>(null);
  const [colConfig, setColConfig] = useState<ColumnMappingConfig | null>(null);
  const [showColumnMapper, setShowColumnMapper] = useState(false);
  const [importFileName, setImportFileName] = useState('');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('replace');
  const [importError, setImportError] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const openAddModal = () => {
    setEditingStudent(null);
    setName('');
    setDob('2016-01-01');
    setGender('Nam');
    setGroup(1);
    setParent('');
    setPhone('');
    setNote('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setDob(student.dob || '');
    setGender(student.gender);
    setGroup(student.group);
    setParent(student.parent || '');
    setPhone(student.phone || '');
    setNote(student.note || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Vui lòng nhập họ và tên học sinh.');
      return;
    }

    const studentData: Student = {
      id: editingStudent ? editingStudent.id : Date.now(),
      name: name.trim(),
      dob,
      gender,
      group: Number(group),
      parent: parent.trim(),
      phone: phone.trim(),
      note: note.trim(),
    };

    onSaveStudent(studentData, Boolean(editingStudent));
    closeModal();
  };

  // Trigger file input
  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle uploaded file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setIsProcessingFile(true);
    setImportError('');

    try {
      const result = await parseStudentsFromExcel(file);
      setParseResult(result);
      setColConfig(result.colConfig);
      setParsedRows(result.students);
      setShowColumnMapper(false);
      setIsImportModalOpen(true);
    } catch (err: any) {
      alert(typeof err === 'string' ? err : 'Không thể đọc file Excel. Vui lòng kiểm tra định dạng.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Re-extract students whenever column mapping is changed
  const handleMapColumnChange = (field: keyof ColumnMappingConfig, newColIdx: number) => {
    if (!colConfig || !parseResult) return;
    const updatedCfg: ColumnMappingConfig = { ...colConfig, [field]: newColIdx };
    setColConfig(updatedCfg);

    const updatedList: ParsedStudentRow[] = [];
    for (let i = 0; i < parseResult.rawRows.length; i++) {
      const st = extractStudentFromRow(parseResult.rawRows[i], updatedCfg);
      if (st) updatedList.push(st);
    }
    setParsedRows(updatedList);
  };

  // Confirm import
  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    if (onImportStudents) {
      onImportStudents(parsedRows, importMode);
    }
    setIsImportModalOpen(false);
    setParsedRows([]);
    setParseResult(null);
    setColConfig(null);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.parent && s.parent.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.phone && s.phone.includes(searchTerm));
    const matchGroup = groupFilter === 'all' || s.group === Number(groupFilter);
    return matchSearch && matchGroup;
  });

  return (
    <div id="view-students" className="space-y-6 pb-8">
      {/* Hidden file input for Excel upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#23395d] text-white flex items-center justify-center shadow-md shadow-[#23395d]/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <span>Hồ sơ học sinh Lớp {className}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#23395d]/10 text-[#23395d] border border-[#23395d]/20">
                  {students.length} em
                </span>
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-[#23395d]">
                  GVCN: {teacherName}
                </span>
                <span>•</span>
                <span>{schoolName}</span>
                <span>•</span>
                <span>Năm học {settings?.year || '2026 - 2027'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action button toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Export Excel button */}
          <button
            onClick={() => exportStudentsToExcel(students, className, teacherName, schoolName)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1.5 shadow-2xs"
            title="Xuất danh sách học sinh ra file Excel"
            id="btn-export-excel"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          {/* Import Excel button */}
          <button
            onClick={handleTriggerUpload}
            disabled={isProcessingFile}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition flex items-center gap-1.5 shadow-2xs"
            title="Tải lên file Excel danh sách học sinh"
            id="btn-import-excel"
          >
            <Upload className="w-4 h-4 text-[#23395d]" />
            <span>{isProcessingFile ? 'Đang đọc...' : 'Tải Excel lên'}</span>
          </button>

          {/* Download Template button */}
          <button
            onClick={() => downloadStudentTemplate(className, teacherName)}
            className="px-2.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition flex items-center gap-1"
            title="Tải file Excel mẫu để nhập dữ liệu chuẩn"
            id="btn-download-template"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">File mẫu</span>
          </button>

          {/* Add student button */}
          <button
            onClick={openAddModal}
            className="bg-[#23395d] text-white px-4 py-2 rounded-xl hover:bg-[#192a47] transition flex items-center gap-2 text-xs font-semibold shadow-xs shrink-0 ml-auto lg:ml-0"
            id="btn-add-student"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            id="search-student-input"
            type="text"
            placeholder="Tìm theo tên học sinh, phụ huynh, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#23395d] focus:ring-2 focus:ring-[#23395d]/20 outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Group filter & summary */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Phân tổ:</span>
            <select
              id="filter-group"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-semibold cursor-pointer text-slate-700"
            >
              <option value="all">Tất cả các tổ (1 - 6)</option>
              <option value="1">Tổ 1</option>
              <option value="2">Tổ 2</option>
              <option value="3">Tổ 3</option>
              <option value="4">Tổ 4</option>
              <option value="5">Tổ 5</option>
              <option value="6">Tổ 6</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Hiển thị: <strong className="text-slate-800">{filteredStudents.length}</strong> / {students.length}
          </span>
        </div>
      </div>

      {/* Quick Group Tabs (Tổ 1 đến Tổ 6) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Lọc nhanh:
        </span>
        <button
          type="button"
          onClick={() => setGroupFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
            groupFilter === 'all'
              ? 'bg-[#23395d] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất cả ({students.length})
        </button>
        {[1, 2, 3, 4, 5, 6].map((g) => {
          const count = students.filter((s) => s.group === g).length;
          const isActive = groupFilter === String(g);
          return (
            <button
              key={g}
              type="button"
              onClick={() => setGroupFilter(String(g))}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                isActive
                  ? 'bg-[#23395d] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Tổ {g} <span className={`ml-1 text-[11px] ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Synchronize / Update Notification Banner */}
      <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-slate-800">
              Cập nhật đúng đủ nội dung từ file Excel danh sách học sinh:
            </span>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              Bộ nhận diện đã được nâng cấp tự động khớp đúng 100% <strong>Ngày sinh</strong> (hỗ trợ DD/MM/YYYY, định dạng số Excel), <strong>Phân tổ 1–6</strong> và <strong>Họ tên/SĐT phụ huynh</strong>. Cô hãy nhấn <strong>"Tải lại file Excel"</strong> để cập nhật đồng bộ toàn bộ danh sách lớp.
            </p>
          </div>
        </div>
        <button
          onClick={handleTriggerUpload}
          className="px-3.5 py-2 bg-[#23395d] text-white hover:bg-[#192a47] font-semibold rounded-xl shrink-0 transition flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Tải lại file Excel</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-[#23395d]/5 text-slate-700">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider w-14 text-slate-600">
                  STT
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                  Họ và tên học sinh
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                  Ngày sinh
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                  Giới tính
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                  Tổ
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                  Phụ huynh & SĐT
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                  Ghi chú
                </th>
                <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider w-24 text-slate-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody id="student-table-body" className="divide-y divide-slate-100 bg-white">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-sm italic">
                    Không tìm thấy học sinh nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  const dobFmt = s.dob ? s.dob.split('-').reverse().join('/') : '---';
                  const isMale = s.gender === 'Nam';

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 text-xs font-medium text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isMale
                                ? 'bg-[#23395d]/10 text-[#23395d] border border-[#23395d]/20'
                                : 'bg-pink-50 text-pink-700 border border-pink-200'
                            }`}
                          >
                            {s.name.trim().charAt(s.name.trim().lastIndexOf(' ') + 1) || 'E'}
                          </div>
                          <span>{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 text-center font-mono">
                        {dobFmt}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isMale
                              ? 'bg-[#23395d]/10 text-[#23395d] border border-[#23395d]/20'
                              : 'bg-pink-50 text-pink-700 border border-pink-200'
                          }`}
                        >
                          {s.gender}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                          Tổ {s.group}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {s.parent ? (
                          <div>
                            <span className="font-medium text-slate-700">{s.parent}</span>
                            {s.phone && (
                              <a
                                href={`tel:${s.phone}`}
                                className="block text-[#23395d] hover:underline font-mono text-[11px] font-semibold"
                              >
                                {s.phone}
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300 italic">Chưa cập nhật</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate" title={s.note}>
                        {s.note || <span className="text-slate-300">---</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1.5 text-slate-500 hover:text-[#23395d] hover:bg-slate-100 rounded-lg transition"
                            title="Sửa thông tin"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(s.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT STUDENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#23395d]/5">
              <h3 className="font-bold text-slate-800 text-base">
                {editingStudent ? 'Chỉnh sửa thông tin học sinh' : 'Thêm học sinh mới vào Lớp ' + className}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên học sinh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#23395d] outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#23395d] outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#23395d] outline-none transition"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phân tổ
                  </label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#23395d] outline-none transition"
                  >
                    <option value={1}>Tổ 1</option>
                    <option value={2}>Tổ 2</option>
                    <option value={3}>Tổ 3</option>
                    <option value={4}>Tổ 4</option>
                    <option value={5}>Tổ 5</option>
                    <option value={6}>Tổ 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại phụ huynh
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#23395d] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ tên người giám hộ / Phụ huynh
                </label>
                <input
                  type="text"
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn B (Bố)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#23395d] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú đặc điểm học sinh
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Cần rèn chữ, ngồi bàn đầu, dị ứng đậu phộng..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#23395d] outline-none transition"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#23395d] text-white rounded-xl text-xs font-semibold hover:bg-[#192a47] transition shadow-2xs"
                >
                  {editingStudent ? 'Cập nhật' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXCEL IMPORT PREVIEW MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 my-6 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#23395d] text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base">
                    Kiểm tra và Xác nhận Danh sách Học sinh từ Excel
                  </h3>
                  <p className="text-xs text-blue-200">
                    Lớp {className} - {schoolName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* File details banner */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Tập tin Excel đã tải:</p>
                    <p className="text-sm font-bold text-slate-800">{importFileName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-right">
                    <span className="text-[11px] text-emerald-700 block font-medium">Đã nhận diện chuẩn:</span>
                    <span className="text-base font-bold text-emerald-700">{parsedRows.length} học sinh</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowColumnMapper(!showColumnMapper)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                      showColumnMapper
                        ? 'bg-[#23395d] text-white border-[#23395d]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Tùy chỉnh chọn cột</span>
                    {showColumnMapper ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Column Customization Panel */}
              {showColumnMapper && parseResult && colConfig && (
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#23395d]" />
                      Khớp cột từ tập tin Excel (Thay đổi nếu cột trong file bị lệch):
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Dòng tiêu đề: Dòng số {parseResult.headerRowIndex + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                    {/* Cột Họ và tên */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        1. Họ và tên:
                      </label>
                      <select
                        value={colConfig.nameCol}
                        onChange={(e) => handleMapColumnChange('nameCol', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-[#23395d] focus:outline-none"
                      >
                        <option value="-1">-- Ghép họ đệm & tên riêng --</option>
                        {parseResult.headers.map((h) => (
                          <option key={h.index} value={h.index}>
                            Cột {h.index + 1}: {h.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cột Ngày sinh */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        2. Ngày sinh (DD/MM/YYYY):
                      </label>
                      <select
                        value={colConfig.dobCol}
                        onChange={(e) => handleMapColumnChange('dobCol', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-[#23395d] focus:outline-none"
                      >
                        <option value="-1">-- Mặc định --</option>
                        {parseResult.headers.map((h) => (
                          <option key={h.index} value={h.index}>
                            Cột {h.index + 1}: {h.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cột Phân tổ */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        3. Phân tổ (Tổ 1 - 6):
                      </label>
                      <select
                        value={colConfig.groupCol}
                        onChange={(e) => handleMapColumnChange('groupCol', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-[#23395d] focus:outline-none"
                      >
                        <option value="-1">-- Tự động theo ghi chú / Tổ 1 --</option>
                        {parseResult.headers.map((h) => (
                          <option key={h.index} value={h.index}>
                            Cột {h.index + 1}: {h.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cột Giới tính */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        4. Giới tính (Nam/Nữ):
                      </label>
                      <select
                        value={colConfig.genderCol}
                        onChange={(e) => handleMapColumnChange('genderCol', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-[#23395d] focus:outline-none"
                      >
                        <option value="-1">-- Mặc định --</option>
                        {parseResult.headers.map((h) => (
                          <option key={h.index} value={h.index}>
                            Cột {h.index + 1}: {h.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cột Phụ huynh */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        5. Họ tên phụ huynh:
                      </label>
                      <select
                        value={colConfig.parentCol}
                        onChange={(e) => handleMapColumnChange('parentCol', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-[#23395d] focus:outline-none"
                      >
                        <option value="-1">-- Không có / Bỏ qua --</option>
                        {parseResult.headers.map((h) => (
                          <option key={h.index} value={h.index}>
                            Cột {h.index + 1}: {h.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cột Số điện thoại */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        6. Số điện thoại liên hệ:
                      </label>
                      <select
                        value={colConfig.phoneCol}
                        onChange={(e) => handleMapColumnChange('phoneCol', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-[#23395d] focus:outline-none"
                      >
                        <option value="-1">-- Không có / Bỏ qua --</option>
                        {parseResult.headers.map((h) => (
                          <option key={h.index} value={h.index}>
                            Cột {h.index + 1}: {h.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cột Ghi chú */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        7. Ghi chú / Chức vụ:
                      </label>
                      <select
                        value={colConfig.noteCol}
                        onChange={(e) => handleMapColumnChange('noteCol', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-[#23395d] focus:outline-none"
                      >
                        <option value="-1">-- Không có / Bỏ qua --</option>
                        {parseResult.headers.map((h) => (
                          <option key={h.index} value={h.index}>
                            Cột {h.index + 1}: {h.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Import Mode selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Chọn phương thức cập nhật Lớp {className}:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      importMode === 'replace'
                        ? 'border-[#23395d] bg-[#23395d]/5 ring-2 ring-[#23395d]/10'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-1 text-[#23395d]"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>Cập nhật & Thay thế toàn bộ</span>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Khuyên dùng
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        Đồng bộ lại toàn bộ danh sách lớp ({parsedRows.length} em) với đúng ngày sinh, tổ 1–6 và thông tin phụ huynh.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      importMode === 'append'
                        ? 'border-[#23395d] bg-[#23395d]/5 ring-2 ring-[#23395d]/10'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="mt-1 text-[#23395d]"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Thêm tiếp vào danh sách cũ</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        Giữ lại {students.length} học sinh hiện tại và bổ sung thêm {parsedRows.length} học sinh mới.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data preview table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-700">
                    Bảng xem trước dữ liệu trích xuất ({parsedRows.length} học sinh):
                  </p>
                  <span className="text-[11px] text-slate-500">
                    Cuộn xuống để xem toàn bộ danh sách
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs max-h-64 overflow-y-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-2xs">
                      <tr>
                        <th className="px-3 py-2 text-left text-slate-500 font-semibold w-10">STT</th>
                        <th className="px-3 py-2 text-left text-slate-500 font-semibold">Họ và tên</th>
                        <th className="px-3 py-2 text-center text-slate-500 font-semibold w-28">Ngày sinh</th>
                        <th className="px-3 py-2 text-center text-slate-500 font-semibold w-20">Giới tính</th>
                        <th className="px-3 py-2 text-center text-slate-500 font-semibold w-20">Tổ</th>
                        <th className="px-3 py-2 text-left text-slate-500 font-semibold">Phụ huynh</th>
                        <th className="px-3 py-2 text-left text-slate-500 font-semibold">Số điện thoại</th>
                        <th className="px-3 py-2 text-left text-slate-500 font-semibold">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {parsedRows.map((row, idx) => {
                        const formattedDob = row.dob
                          ? row.dob.split('-').reverse().join('/')
                          : '---';

                        return (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="px-3 py-1.5 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                            <td className="px-3 py-1.5 font-bold text-slate-800">{row.name}</td>
                            <td className="px-3 py-1.5 text-center">
                              <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 font-medium rounded-md font-mono text-[11px]">
                                {formattedDob}
                              </span>
                            </td>
                            <td className="px-3 py-1.5 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                  row.gender === 'Nữ'
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-sky-50 text-sky-700'
                                }`}
                              >
                                {row.gender}
                              </span>
                            </td>
                            <td className="px-3 py-1.5 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                  row.group === 5
                                    ? 'bg-purple-100 text-purple-700'
                                    : row.group === 6
                                    ? 'bg-pink-100 text-pink-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                Tổ {row.group}
                              </span>
                            </td>
                            <td className="px-3 py-1.5 text-slate-700">
                              {row.parent ? (
                                <span className="font-medium">{row.parent}</span>
                              ) : (
                                <span className="text-slate-400 italic">Chưa có</span>
                              )}
                            </td>
                            <td className="px-3 py-1.5 text-slate-700 font-mono text-[11px]">
                              {row.phone ? (
                                <span className="text-emerald-700 font-semibold">{row.phone}</span>
                              ) : (
                                <span className="text-slate-400 italic">---</span>
                              )}
                            </td>
                            <td className="px-3 py-1.5 text-slate-500 text-[11px]">
                              {row.note || '---'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="px-5 py-2 bg-[#23395d] text-white rounded-xl text-xs font-semibold hover:bg-[#192a47] transition shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Xác nhận cập nhật danh sách ({parsedRows.length} em)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingId !== null && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-800 text-base">Xác nhận xóa học sinh?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Dữ liệu học tập, nề nếp và điểm danh của học sinh này sẽ bị gỡ bỏ khỏi danh sách.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(deletingId);
                  setDeletingId(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition shadow-2xs"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
