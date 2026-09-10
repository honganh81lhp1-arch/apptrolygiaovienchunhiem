import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI instance
let aiInstance: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// API Routes FIRST
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { prompt, studentName, subject, contextType } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Thiếu nội dung yêu cầu (prompt)." });
    }

    const ai = getAIClient();
    if (ai) {
      try {
        const systemInstruction = `Bạn là Trợ lý Sư phạm AI đắc lực dành riêng cho Giáo viên Chủ nhiệm (GVCN) Lớp 4 tại Việt Nam.
Nhiệm vụ của bạn là hỗ trợ giáo viên thực hiện các công việc sau:
1. Viết nhận xét học bạ, đánh giá học tập & nề nếp định kỳ theo chuẩn Thông tư 27/2020/TT-BGDĐT:
   - Nhận xét cụ thể sự tiến bộ, ưu điểm nổi bật của học sinh lớp 4 (lứa tuổi 9-10 tuổi).
   - Chỉ rõ mặt còn hạn chế nhưng bằng lời văn ân cần, mang tính khích lệ, gợi ý biện pháp giúp đỡ cụ thể (không dùng từ ngữ phê phán tiêu cực hay so sánh giữa các em).
2. Soạn thảo tin nhắn, thông báo gửi phụ huynh học sinh:
   - Giọng điệu chân thành, tôn trọng, cầu thị và thân thiện.
   - Thể hiện sự đồng hành giữa gia đình và nhà trường.
3. Soạn kịch bản, ý tưởng sinh hoạt lớp 4 cuối tuần:
   - Có cơ cấu rõ ràng: Đánh giá tuần qua - Tuyên dương - Phương hướng tuần mới - Hoạt động trò chơi/chủ đề sinh hoạt gắn kết.
4. Ngôn ngữ: Tiếng Việt chuẩn mực, sư phạm, giàu cảm xúc và thực tế.

Trả lời cô đọng, rõ ràng, chia đề mục nếu cần, và cung cấp ngay nội dung mẫu sẵn sàng để giáo viên copy hoặc chèn vào báo cáo.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const replyText = response.text || "Dạ, em chưa nhận được phản hồi từ mô hình. Thầy cô vui lòng thử lại.";
        return res.json({ reply: replyText, source: "gemini" });
      } catch (geminiError: any) {
        console.warn("Gemini API call failed, falling back to smart template:", geminiError?.message || geminiError);
      }
    }

    // Smart fallback if API key is not configured or network call fails
    const lowerPrompt = prompt.toLowerCase();
    let fallbackReply = "";

    if (lowerPrompt.includes("nhận xét") || lowerPrompt.includes("học bạ") || lowerPrompt.includes("toán") || lowerPrompt.includes("tiếng việt")) {
      fallbackReply = `Dưới đây là gợi ý nhận xét sư phạm theo Thông tư 27 dành cho học sinh Lớp 4:

• Môn Toán: "Em nắm vững các phép tính với số tự nhiên, biết vận dụng tính diện tích và chu vi tốt. Cần rèn thêm kỹ năng đọc kỹ đề toán có lời văn và trình bày bài giải cẩn thận hơn."
• Môn Tiếng Việt: "Em đọc to, lưu loát, chữ viết tương đối sạch đẹp. Cần chú ý mở rộng vốn từ khi viết đoạn văn miêu tả và rèn thêm cách dùng dấu câu."
• Năng lực, phẩm chất: "Em ngoan ngoãn, lễ phép, có tinh thần tương trợ bạn bè trong tổ. Cần mạnh dạn, tự tin hơn khi phát biểu xây dựng bài trước lớp."`;
    } else if (lowerPrompt.includes("phụ huynh") || lowerPrompt.includes("tin nhắn") || lowerPrompt.includes("đi muộn") || lowerPrompt.includes("quên")) {
      fallbackReply = `Kính gửi Phụ huynh em ${studentName || "[Tên học sinh]"},

Dạ chào Anh/Chị! Tuần qua trên lớp con rất vui vẻ và hòa đồng cùng các bạn. Tuy nhiên cô nhận thấy con có đôi lần còn quên chuẩn bị sách vở và bài tập môn ${subject || "học"}. 

Cô rất mong gia đình mình dành chút thời gian buổi tối cùng kiểm tra thời khóa biểu và nhắc nhở con chuẩn bị cặp sách trước khi đi ngủ, giúp con hình thành thói quen tự lập tốt hơn nhé ạ.

Cảm ơn sự đồng hành và phối hợp chặt chẽ của gia đình! Chúc gia đình nhiều niềm vui!
GVCN Lớp 4`;
    } else if (lowerPrompt.includes("sinh hoạt") || lowerPrompt.includes("tuần") || lowerPrompt.includes("kịch bản") || lowerPrompt.includes("chủ đề")) {
      fallbackReply = `Gợi ý kịch bản tiết Sinh hoạt lớp 4 cuối tuần (Thời lượng: 35-40 phút):

1. Khởi động (5 phút): Cả lớp cùng hát và múa theo bài "Mỗi ngày đến trường là một ngày vui".
2. Sơ kết tuần (10 phút):
   - Các tổ trưởng báo cáo nhanh tình hình nề nếp, học tập của tổ.
   - Lớp trưởng tổng kết điểm thi đua chung.
   - GVCN nhận xét chung: Biểu dương các bạn tích cực phát biểu, khen ngợi tổ có tiến bộ; nhắc nhở nhẹ nhàng các tồn tại cần khắc phục.
3. Vinh danh & Trao cờ thi đua (7 phút):
   - Tuyên dương Top 3 học sinh xuất sắc và trao huy hiệu Ngôi sao chăm ngoan tuần.
4. Sinh hoạt theo chủ đề (13 phút):
   - Chủ đề: "Tôn trọng và Biết ơn" hoặc "Giữ gìn vệ sinh trường lớp xanh - sạch - đẹp".
   - Hoạt động chia sẻ điều em muốn nói hoặc trò chơi đố vui kiến thức tuần.
5. Phương hướng tuần tới (5 phút): Nhắc nhở chuẩn bị đồ dùng, mục tiêu giữ vững nền nếp.`;
    } else {
      fallbackReply = `Chào thầy/cô! Em là Trợ lý GVCN Lớp 4. 

Em có thể hỗ trợ thầy/cô:
1. Viết nhận xét học bạ, đánh giá định kỳ chuẩn Thông tư 27 (Toán, Tiếng Việt, Khoa học, Năng lực & Phẩm chất).
2. Soạn tin nhắn gửi phụ huynh học sinh (thông báo họp, nhắc nhở học tập, khen ngợi học sinh).
3. Lên kịch bản sinh hoạt lớp, kế hoạch tuần và xây dựng tiêu chí thi đua cho học sinh lớp 4.
4. Gợi ý biện pháp kèm cặp học sinh Chưa Hoàn Thành (CHT) và phát triển học sinh Năng khiếu.

Thầy/cô hãy nhập yêu cầu chi tiết để em hỗ trợ tốt nhất ạ!`;
    }

    return res.json({ reply: fallbackReply, source: "fallback" });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    res.status(500).json({ error: "Đã xảy ra sự cố khi xử lý yêu cầu AI." });
  }
});

// Vite Middleware & Static handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
