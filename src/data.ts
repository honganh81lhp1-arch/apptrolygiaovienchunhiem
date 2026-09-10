import { AppData, Student, SubjectItem } from './types';

export const GRADE_4_SUBJECTS: SubjectItem[] = [
  { key: 'math', name: 'Toán', shortName: 'Toán', category: 'Cơ bản' },
  { key: 'vn', name: 'Tiếng Việt', shortName: 'T.Việt', category: 'Cơ bản' },
  { key: 'nn', name: 'Ngoại ngữ 1 (Tiếng Anh)', shortName: 'N.Ngữ 1', category: 'Cơ bản' },
  { key: 'dd', name: 'Đạo đức', shortName: 'Đ.Đức', category: 'Khoa học Xã hội' },
  { key: 'kh', name: 'Khoa học', shortName: 'K.Học', category: 'Khoa học Tự nhiên' },
  { key: 'his_geo', name: 'Lịch sử và Địa lí', shortName: 'LS - ĐL', category: 'Khoa học Xã hội' },
  { key: 'tin', name: 'Tin học', shortName: 'T.Học', category: 'Công nghệ' },
  { key: 'cn', name: 'Công nghệ', shortName: 'C.Nghệ', category: 'Công nghệ' },
  { key: 'gdtc', name: 'Giáo dục thể chất', shortName: 'GDTC', category: 'Thể chất - Nghệ thuật' },
  { key: 'an', name: 'Âm nhạc', shortName: 'Â.Nhạc', category: 'Thể chất - Nghệ thuật' },
  { key: 'mt', name: 'Mĩ thuật', shortName: 'M.Thuật', category: 'Thể chất - Nghệ thuật' },
  { key: 'hdtn', name: 'Hoạt động trải nghiệm', shortName: 'HĐTN', category: 'Hoạt động chung' },
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "Nguyễn Minh Anh", dob: "2016-05-12", gender: "Nữ", group: 1, parent: "Nguyễn Văn B", phone: "0901234567", note: "Học tốt Toán, chữ viết sạch đẹp" },
  { id: 2, name: "Trần Gia Bảo", dob: "2016-08-20", gender: "Nam", group: 1, parent: "Trần Thị C", phone: "0912345678", note: "Nhanh nhẹn, hay nói chuyện riêng" },
  { id: 3, name: "Lê Hoàng Minh", dob: "2016-01-15", gender: "Nam", group: 2, parent: "Lê Văn D", phone: "0923456789", note: "Chăm chỉ, hoàn thành tốt nhiệm vụ" },
  { id: 4, name: "Phạm Khánh Linh", dob: "2016-11-05", gender: "Nữ", group: 2, parent: "Phạm Thị E", phone: "0934567890", note: "Cần rèn thêm chữ viết và tính cẩn thận" },
  { id: 5, name: "Nguyễn Ngọc Hà", dob: "2016-03-22", gender: "Nữ", group: 3, parent: "Nguyễn Văn F", phone: "0945678901", note: "Trầm tính, học lực khá" },
  { id: 6, name: "Đỗ Hải Nam", dob: "2016-07-10", gender: "Nam", group: 3, parent: "Đỗ Thị G", phone: "0956789012", note: "Lớp phó phụ trách kỷ luật" },
  { id: 7, name: "Vũ Minh Khang", dob: "2016-09-30", gender: "Nam", group: 4, parent: "Vũ Văn H", phone: "0967890123", note: "Có tiến bộ môn Tiếng Anh" },
  { id: 8, name: "Bùi Ngọc Anh", dob: "2016-12-01", gender: "Nữ", group: 4, parent: "Bùi Thị I", phone: "0978901234", note: "Hát hay, năng nổ văn nghệ" },
  { id: 9, name: "Hoàng Đức Anh", dob: "2016-04-18", gender: "Nam", group: 5, parent: "Hoàng Văn K", phone: "0989012345", note: "Cần kèm cặp môn Toán dạng toán có lời văn" },
  { id: 10, name: "Trương Thảo My", dob: "2016-09-14", gender: "Nữ", group: 5, parent: "Trương Thị L", phone: "0990123456", note: "Lớp trưởng gương mẫu, tích cực" },
  { id: 11, name: "Phan Quốc Huy", dob: "2016-02-28", gender: "Nam", group: 6, parent: "Phan Văn M", phone: "0911223344", note: "Năng động, chơi thể thao giỏi" },
  { id: 12, name: "Võ Mai Chi", dob: "2016-10-09", gender: "Nữ", group: 6, parent: "Võ Thị N", phone: "0922334455", note: "Khéo tay, vẽ tranh sáng tạo" },
];

export const INITIAL_APP_DATA: AppData = {
  settings: {
    school: "Trường Tiểu học Lê Hồng Phong",
    class: "4C",
    teacher: "Phạm Thị Hồng Anh",
    year: "2026 - 2027",
  },
  reportNote: "Tập thể lớp 4C trong tuần qua chấp hành rất tốt nội quy của trường và lớp. Dưới sự chủ nhiệm của cô Phạm Thị Hồng Anh, các em đi học đúng giờ, xếp hàng ra vào lớp nghiêm túc. Nhiều em hăng hái phát biểu xây dựng bài, đặc biệt trong các giờ Toán và Khoa học. Một số em còn quên vở bài tập cần gia đình tiếp tục đôn đốc nhắc nhở.",
  students: INITIAL_STUDENTS,
  attendance: {
    // Current sample attendance for a week
  },
  discipline: {
    1: 108,
    2: 96,
    3: 104,
    4: 92,
    5: 100,
    6: 112,
    7: 102,
    8: 106,
    9: 90,
    10: 115,
    11: 98,
    12: 104,
  },
  disciplineLogs: [
    { id: 'log-1', studentId: 10, studentName: 'Trương Thảo My', points: 3, reason: 'Làm việc tốt: Giúp bạn ôn bài', timestamp: 'Hôm nay, 08:30' },
    { id: 'log-2', studentId: 6, studentName: 'Đỗ Hải Nam', points: 2, reason: 'Hoàn thành tốt nhiệm vụ trực nhật', timestamp: 'Hôm nay, 07:45' },
    { id: 'log-3', studentId: 2, studentName: 'Trần Gia Bảo', points: -1, reason: 'Nói chuyện riêng trong giờ học', timestamp: 'Hôm qua, 10:15' },
    { id: 'log-4', studentId: 1, studentName: 'Nguyễn Minh Anh', points: 2, reason: 'Phát biểu xây dựng bài sôi nổi', timestamp: 'Hôm qua, 09:20' },
  ],
  academics: {
    1: { math: 'HTT', vn: 'HTT', nn: 'HTT', dd: 'HTT', kh: 'HTT', his_geo: 'HT', tin: 'HTT', cn: 'HT', gdtc: 'HT', an: 'HT', mt: 'HTT', hdtn: 'HTT', note: 'Học đều tất cả các môn, tư duy toán tốt' },
    2: { math: 'HT', vn: 'HT', nn: 'HT', dd: 'HT', kh: 'HT', his_geo: 'HT', tin: 'HTT', cn: 'HT', gdtc: 'HTT', an: 'HT', mt: 'HT', hdtn: 'HT', note: 'Cần rèn luyện tính tập trung trong giờ học' },
    3: { math: 'HTT', vn: 'HT', nn: 'HT', dd: 'HTT', kh: 'HTT', his_geo: 'HT', tin: 'HT', cn: 'HT', gdtc: 'HT', an: 'HT', mt: 'HT', hdtn: 'HTT', note: 'Ngoan ngoãn, có tinh thần trách nhiệm cao' },
    4: { math: 'CHT', vn: 'HT', nn: 'CHT', dd: 'HT', kh: 'HT', his_geo: 'HT', tin: 'HT', cn: 'HT', gdtc: 'HT', an: 'HT', mt: 'HTT', hdtn: 'HT', note: 'Cần phụ đạo thêm môn Toán và từ vựng Tiếng Anh' },
    5: { math: 'HT', vn: 'HT', nn: 'HT', dd: 'HT', kh: 'HT', his_geo: 'HT', tin: 'HT', cn: 'HT', gdtc: 'HT', an: 'HT', mt: 'HT', hdtn: 'HT', note: 'Hoàn thành chương trình các môn' },
    6: { math: 'HTT', vn: 'HTT', nn: 'HTT', dd: 'HTT', kh: 'HTT', his_geo: 'HTT', tin: 'HTT', cn: 'HTT', gdtc: 'HTT', an: 'HT', mt: 'HT', hdtn: 'HTT', note: 'Năng động, quản lý lớp tốt, tiếp thu bài nhanh' },
    7: { math: 'HT', vn: 'HT', nn: 'HTT', dd: 'HT', kh: 'HT', his_geo: 'HT', tin: 'HTT', cn: 'HT', gdtc: 'HT', an: 'HT', mt: 'HT', hdtn: 'HT', note: 'Tiếng Anh và Tin học có tiến bộ vượt trội' },
    8: { math: 'HT', vn: 'HTT', nn: 'HT', dd: 'HTT', kh: 'HT', his_geo: 'HT', tin: 'HT', cn: 'HT', gdtc: 'HT', an: 'HTT', mt: 'HTT', hdtn: 'HTT', note: 'Năng khiếu mĩ thuật và âm nhạc rất tốt' },
    9: { math: 'CHT', vn: 'CHT', nn: 'HT', dd: 'HT', kh: 'HT', his_geo: 'HT', tin: 'HT', cn: 'HT', gdtc: 'HTT', an: 'HT', mt: 'HT', hdtn: 'HT', note: 'Cần hỗ trợ giải toán lời văn và chính tả' },
    10: { math: 'HTT', vn: 'HTT', nn: 'HTT', dd: 'HTT', kh: 'HTT', his_geo: 'HTT', tin: 'HTT', cn: 'HTT', gdtc: 'HTT', an: 'HTT', mt: 'HTT', hdtn: 'HTT', note: 'Học sinh xuất sắc toàn diện, cán bộ lớp gương mẫu' },
    11: { math: 'HT', vn: 'HT', nn: 'HT', dd: 'HT', kh: 'HT', his_geo: 'HT', tin: 'HT', cn: 'HT', gdtc: 'HTT', an: 'HT', mt: 'HT', hdtn: 'HT', note: 'Hăng hái trong phong trào thể dục thể thao' },
    12: { math: 'HT', vn: 'HTT', nn: 'HT', dd: 'HTT', kh: 'HT', his_geo: 'HT', tin: 'HT', cn: 'HT', gdtc: 'HT', an: 'HT', mt: 'HTT', hdtn: 'HTT', note: 'Chăm ngoan, vẽ tranh sáng tạo, khéo tay' },
  },
  todos: [
    { id: 'todo-1', task: 'Chuẩn bị phiếu khảo sát chất lượng đầu năm môn Toán', done: false, createdAt: '2026-09-08' },
    { id: 'todo-2', task: 'Nhắc phụ huynh em Khánh Linh kiểm tra vở bài tập', done: true, createdAt: '2026-09-08' },
    { id: 'todo-3', task: 'Lập danh sách học sinh tham gia Hội khỏe Phù Đổng', done: false, createdAt: '2026-09-09' },
    { id: 'todo-4', task: 'Soạn kịch bản sinh hoạt lớp chủ đề An toàn giao thông', done: false, createdAt: '2026-09-09' },
  ],
};
