import React, { useState } from 'react';
import { 
  PhoneCall, 
  Search, 
  MessageSquare, 
  Copy, 
  Check, 
  Send, 
  RotateCcw, 
  Phone, 
  Users,
  Sparkles
} from 'lucide-react';
import { Student, AppSettings } from '../types';

interface ParentsViewProps {
  students: Student[];
  settings: AppSettings;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ParentsView: React.FC<ParentsViewProps> = ({
  students,
  settings,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [targetStudentId, setTargetStudentId] = useState<string>('');
  const [messageContent, setMessageContent] = useState('');
  const [copied, setCopied] = useState(false);

  // Template loader
  const handleTemplateChange = (tmpl: string, studentIdVal: string = targetStudentId) => {
    setSelectedTemplate(tmpl);
    const targetStudent = students.find((s) => s.id === Number(studentIdVal));
    const studentName = targetStudent ? targetStudent.name : '[Tên học sinh]';

    let text = '';
    if (tmpl === 'hop') {
      text = `Kính gửi Phụ huynh em ${studentName},

Trân trọng kính mời Anh/Chị tới dự buổi họp phụ huynh học sinh Lớp ${settings.class || '4A'} để sơ kết tình hình học tập và rèn luyện của các con trong thời gian qua.

• Thời gian: 08h00 Chủ nhật, ngày ... tháng ... năm 2026
• Địa điểm: Phòng học Lớp ${settings.class || '4A'} (Tầng 2, Dãy nhà B)
• Nội dung: Báo cáo kết quả học tập 12 môn, phương hướng rèn luyện nề nếp và kế hoạch các hoạt động trải nghiệm sắp tới.

Sự hiện diện đầy đủ và đúng giờ của Quý Phụ huynh là nguồn động viên rất lớn đối với các con và cô giáo.
Trân trọng cảm ơn!
GVCN: ${settings.teacher || 'Cô giáo'}`;
    } else if (tmpl === 'nghi') {
      text = `Kính gửi Quý Phụ huynh Lớp ${settings.class || '4A'},

Theo thông báo chính thức từ Ban Giám hiệu nhà trường, các con sẽ được nghỉ học vào ngày .../.../2026 do ...
Các con sẽ đi học trở lại bình thường theo thời khóa biểu vào ngày .../.../2026.

Kính mong Quý Phụ huynh lưu ý để sắp xếp thời gian đón con và nhắc nhở các em tự ôn bài ở nhà. 
Chúc Quý Phụ huynh và gia đình nhiều sức khỏe, bình an!
GVCN: ${settings.teacher || 'Cô giáo'}`;
    } else if (tmpl === 'nhacnho') {
      text = `Kính gửi Phụ huynh em ${studentName},

Thời gian gần đây trên lớp, cô nhận thấy con có đôi lần còn quên mang sách vở/đồ dùng học tập môn [Tên môn học] và chưa hoàn thành bài tập về nhà.

Kính mong gia đình dành chút thời gian buổi tối cùng kiểm tra thời khóa biểu, nhắc con chuẩn bị đầy đủ sách vở và dụng cụ vào cặp trước khi đi ngủ để con tự tin hơn trong mỗi tiết học nhé ạ.

Xin chân thành cảm ơn sự phối hợp chặt chẽ của gia đình!
GVCN: ${settings.teacher || 'Cô giáo'}`;
    } else if (tmpl === 'tuyenduong') {
      text = `Kính gửi Phụ huynh em ${studentName},

Tuần này trên lớp, con đã có rất nhiều cố gắng, hăng hái phát biểu xây dựng bài và chấp hành rất tốt nội quy lớp học. Kết quả thi đua tuần này của con rất xuất sắc!

Cô giáo gửi lời khen ngợi con và rất mong Quý Phụ huynh tiếp tục động viên, khích lệ để con luôn giữ vững tinh thần chăm ngoan, tiến bộ này nhé ạ!

Chúc gia đình mình cuối tuần thật nhiều niềm vui và hạnh phúc!
GVCN: ${settings.teacher || 'Cô giáo'}`;
    }

    setMessageContent(text);
  };

  const handleTargetStudentChange = (idStr: string) => {
    setTargetStudentId(idStr);
    if (selectedTemplate) {
      handleTemplateChange(selectedTemplate, idStr);
    }
  };

  const handleCopy = () => {
    if (!messageContent.trim()) {
      onShowToast('Không có nội dung để sao chép!', 'error');
      return;
    }

    navigator.clipboard.writeText(messageContent).then(
      () => {
        setCopied(true);
        onShowToast('Đã sao chép nội dung tin nhắn vào bộ nhớ tạm!', 'success');
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = messageContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        onShowToast('Đã sao chép nội dung tin nhắn!', 'success');
        setTimeout(() => setCopied(false), 2000);
      }
    );
  };

  // Filter parent list
  const filteredParents = students.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchStudent = s.name.toLowerCase().includes(q);
    const matchParent = s.parent && s.parent.toLowerCase().includes(q);
    const matchPhone = s.phone && s.phone.includes(q);
    return matchStudent || matchParent || matchPhone;
  });

  return (
    <div id="view-parents" className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <PhoneCall className="w-6 h-6 text-rose-500" />
          Liên lạc phụ huynh & Soạn thông báo nhanh
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Danh bạ điện thoại trực tiếp, mẫu tin nhắn mời họp, nhắc nhở và tuyên dương kết nối gia đình
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Phone Directory */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Danh bạ phụ huynh ({students.length} em)</span>
            </h3>
            <span className="text-xs text-slate-400">Bấm số để gọi</span>
          </div>

          {/* Search input */}
          <div className="relative mb-3">
            <input
              id="search-parent"
              type="text"
              placeholder="Tìm theo tên học sinh, phụ huynh hoặc SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 outline-none transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          {/* List of parents */}
          <div className="flex-1 overflow-y-auto pr-1 divide-y divide-slate-100">
            {filteredParents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 italic text-xs">
                Không tìm thấy phụ huynh phù hợp với từ khóa tìm kiếm.
              </div>
            ) : (
              filteredParents.map((s) => (
                <div
                  key={s.id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-xl transition"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{s.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      PH: <span className="font-semibold text-slate-700">{s.parent || 'Chưa rõ tên'}</span> • Tổ {s.group}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.phone ? (
                      <>
                        <a
                          href={`tel:${s.phone}`}
                          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition border border-blue-200"
                          title="Bấm để gọi"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{s.phone}</span>
                        </a>
                        <button
                          onClick={() => {
                            setTargetStudentId(String(s.id));
                            if (selectedTemplate) {
                              handleTemplateChange(selectedTemplate, String(s.id));
                            }
                            onShowToast(`Đã chọn học sinh: ${s.name} để soạn tin nhắn`, 'info');
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                          title="Soạn tin nhắn cho học sinh này"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Chưa có SĐT</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Notification Composer */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-pink-500" />
              <span>Soạn thông báo & Tin nhắn mẫu</span>
            </h3>
            <span className="text-xs text-slate-400">1-click Sao chép</span>
          </div>

          <div className="space-y-3 flex-1 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Template Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn mẫu thông báo:
                </label>
                <select
                  id="noti-template"
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="">-- Chọn mẫu thông báo --</option>
                  <option value="hop">📅 Mời họp phụ huynh</option>
                  <option value="nghi">🔔 Thông báo nghỉ học</option>
                  <option value="nhacnho">✏️ Nhắc nhở bài vở, đồ dùng</option>
                  <option value="tuyenduong">⭐ Khen ngợi, tuyên dương</option>
                </select>
              </div>

              {/* Student Target for template personalization */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cá nhân hóa cho học sinh:
                </label>
                <select
                  value={targetStudentId}
                  onChange={(e) => handleTargetStudentChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="">-- Chung cho cả lớp --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Tổ {s.group})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content Textarea */}
            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nội dung tin nhắn:
              </label>
              <textarea
                id="noti-content"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Chọn mẫu phía trên hoặc tự nhập nội dung thông báo gửi phụ huynh..."
                className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed placeholder-slate-400 focus:bg-white focus:border-blue-500 outline-none resize-none font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép tin nhắn!' : 'Sao chép tin nhắn'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMessageContent('');
                  setSelectedTemplate('');
                  setTargetStudentId('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
