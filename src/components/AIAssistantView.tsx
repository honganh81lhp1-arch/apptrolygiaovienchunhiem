import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  FileCheck2, 
  Loader2, 
  Lightbulb, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, AppSettings } from '../types';

interface AIAssistantViewProps {
  settings: AppSettings;
  onApplyToReport: (text: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  settings,
  onApplyToReport,
  onShowToast,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `Chào thầy/cô! Em là Trợ lý Sư phạm AI dành riêng cho Giáo viên Chủ nhiệm Lớp 4 theo đúng tinh thần Thông tư 27/2020/TT-BGDĐT.

Em có thể giúp thầy/cô:
• Viết lời nhận xét học bạ các môn Toán, Tiếng Việt, Khoa học, Năng lực & Phẩm chất.
• Soạn thảo tin nhắn khéo léo gửi phụ huynh về tình hình học tập và nề nếp.
• Lên kịch bản sinh hoạt lớp cuối tuần hấp dẫn theo chủ đề.
• Đề xuất biện pháp phụ đạo cho học sinh Chưa hoàn thành (CHT).

Thầy/cô có thể chọn các câu hỏi gợi ý bên dưới hoặc trực tiếp nhập yêu cầu của mình nhé!`,
      timestamp: 'Vừa xong',
      source: 'gemini',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    {
      label: '✍️ Nhận xét môn Toán',
      prompt: 'Hãy viết 3 mẫu nhận xét học bạ môn Toán lớp 4: 1 mẫu cho học sinh giỏi tư duy nhưng viết ẩu, 1 mẫu cho học sinh trung bình cần kèm toán có lời văn, 1 mẫu cho học sinh xuất sắc.',
    },
    {
      label: '👨‍👩‍👧 Nhắn phụ huynh tế nhị',
      prompt: 'Soạn tin nhắn khéo léo, chân thành gửi phụ huynh học sinh lớp 4 dạo này hay đi học muộn và quên làm bài tập về nhà môn Tiếng Việt.',
    },
    {
      label: '🎉 Kịch bản sinh hoạt lớp',
      prompt: `Gợi ý kịch bản tiết Sinh hoạt lớp 4 cuối tuần cho lớp ${settings.class || '4A'} theo chủ đề "Tự giác học tập và Đôi bạn cùng tiến" (thời lượng 35 phút).`,
    },
    {
      label: '📝 Nhận xét báo cáo tuần',
      prompt: `Hãy viết một đoạn nhận xét tổng kết tuần ngắn gọn (khoảng 4-5 câu) của GVCN lớp 4 khen ngợi nề nếp xếp hàng, sự tích cực phát biểu của lớp và nhắc nhở ôn bài chuẩn bị cho tuần tới.`,
    },
  ];

  const handleSendMessage = async (textToSend: string = inputPrompt) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          class: settings.class,
          teacher: settings.teacher,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Dạ, em đã ghi nhận yêu cầu. Thầy cô cần thêm thông tin gì không ạ?',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Error fetching AI response:', err);
      // Client-side smart fallback
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: `Dưới đây là gợi ý từ Trợ lý Sư phạm GVCN Lớp 4:

• Mẫu nhận xét học bạ: "Em có nhiều tiến bộ trong môn học, hiểu bài nhanh và biết vận dụng kiến thức tốt. Cần rèn thêm tính cẩn thận khi trình bày bài giải để đạt kết quả cao hơn nữa nhé."
• Tin nhắn nhắc nhở: "Dạ chào gia đình, tuần này trên lớp con rất vui vẻ, tuy nhiên đôi khi còn quên mang vở bài tập. Nhờ bố mẹ buổi tối nhắc con soạn sách vở theo thời khóa biểu để con luôn sẵn sàng cho bài học ngày mai nhé ạ!"`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        source: 'fallback',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedId(id);
        onShowToast('Đã sao chép phản hồi AI vào bộ nhớ tạm!', 'success');
        setTimeout(() => setCopiedId(null), 2000);
      },
      () => {
        onShowToast('Đã sao chép phản hồi!', 'success');
      }
    );
  };

  const handleApply = (text: string) => {
    onApplyToReport(text);
    onShowToast('Đã áp dụng trực tiếp vào mục Nhận xét Báo cáo tuần!', 'success');
  };

  return (
    <div id="view-ai" className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-600" />
            Trợ lý Sư phạm AI Chủ nhiệm
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tích hợp mô hình Gemini AI hỗ trợ viết nhận xét, soạn tin nhắn phụ huynh và kịch bản sư phạm
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Gemini 3.8 Flash • Sư phạm Tiểu học</span>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 flex flex-col h-[580px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed transition-all shadow-xs ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {/* Sender title */}
                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/10">
                    <span
                      className={`font-bold text-[11px] flex items-center gap-1.5 ${
                        isUser ? 'text-blue-100' : 'text-purple-700'
                      }`}
                    >
                      {isUser ? 'Giáo viên chủ nhiệm' : 'Trợ lý Sư phạm AI'}
                    </span>
                    <span className={`text-[10px] ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message body */}
                  <div className="whitespace-pre-wrap font-sans text-xs">
                    {msg.text}
                  </div>

                  {/* Actions for assistant messages */}
                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleApply(msg.text)}
                        className="inline-flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition"
                      >
                        <FileCheck2 className="w-3 h-3 text-purple-600" />
                        <span>Áp dụng vào Báo cáo tuần</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading spinner indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-2 text-xs text-purple-700 font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>Trợ lý AI đang nghiên cứu và soạn nội dung sư phạm...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggestion Prompt Chips */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Gợi ý nhanh:</span>
          </span>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              className="text-xs bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-200 px-3 py-1.5 rounded-full transition font-medium shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            id="ai-input"
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Hỏi AI: 'Viết nhận xét cho học sinh...', 'Soạn tin nhắn phụ huynh...' "
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="w-10 h-10 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl transition flex items-center justify-center shrink-0 shadow-xs"
            aria-label="Gửi yêu cầu"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
