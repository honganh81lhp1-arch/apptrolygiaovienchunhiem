import { DailyReportRecord, WeeklyReportRecord, PeriodReportRecord, AppData } from '../types';

export interface WeekMeta {
  week: number;
  term: 1 | 2;
  title: string;
  focus: string;
}

export const WEEKS_35_LIST: WeekMeta[] = [
  // Học kì I (Tuần 1 - 18)
  { week: 1, term: 1, title: 'Tuần 1: Khởi động năm học & Ổn định tổ chức lớp', focus: 'Bầu ban cán sự, chia 6 tổ, phổ biến nội quy trường lớp' },
  { week: 2, term: 1, title: 'Tuần 2: Rèn luyện nền nếp chuyên cần & Tự quản', focus: 'Thực hiện 15 phút truy bài đầu giờ, xếp hàng ra vào lớp nghiêm túc' },
  { week: 3, term: 1, title: 'Tuần 3: Giữ gìn vở sạch chữ đẹp & Thi đua phát biểu', focus: 'Rèn tư thế ngồi học, phát biểu to rõ ràng và tự tin' },
  { week: 4, term: 1, title: 'Tuần 4: Vui Tết Trung Thu & Phong trào Đội Sao', focus: 'Tham gia hoạt động trải nghiệm Trung thu, phát động đôi bạn cùng tiến' },
  { week: 5, term: 1, title: 'Tuần 5: Thi đua "Hoa điểm mười" tháng 10', focus: 'Tăng cường chất lượng môn Toán và đọc hiểu Tiếng Việt' },
  { week: 6, term: 1, title: 'Tuần 6: Tăng cường tự học và giúp bạn tiến bộ', focus: 'Ban cán sự kèm cặp học sinh còn lúng túng trong làm bài tập' },
  { week: 7, term: 1, title: 'Tuần 7: Chấp hành luật ATGT & Văn hóa học đường', focus: 'Đội mũ bảo hiểm khi ngồi xe máy, lễ phép chào hỏi thầy cô' },
  { week: 8, term: 1, title: 'Tuần 8: Ôn tập củng cố kiến thức Giữa Học kì I', focus: 'Hệ thống hóa kiến thức 8 tuần đầu môn Toán, Tiếng Việt, Khoa học' },
  { week: 9, term: 1, title: 'Tuần 9: Sơ kết & Đánh giá định kì Giữa Học kì I', focus: 'Khảo sát định kì giữa kì I, phân tích chất lượng để có biện pháp bồi dưỡng' },
  { week: 10, term: 1, title: 'Tuần 10: Phát huy kết quả giữa kì & Thi đua 20/11', focus: 'Phát động tuần học tốt, giờ học tốt chào mừng ngày Nhà giáo Việt Nam' },
  { week: 11, term: 1, title: 'Tuần 11: Hội diễn văn nghệ & Tri ân thầy cô giáo', focus: 'Tập luyện văn nghệ, làm bưu thiếp tri ân thầy cô giáo 20/11' },
  { week: 12, term: 1, title: 'Tuần 12: Nâng cao chất lượng giải toán có lời văn', focus: 'Rèn kỹ năng tóm tắt đề và trình bày bài giải cẩn thận' },
  { week: 13, term: 1, title: 'Tuần 13: Xây dựng lớp học xanh - sạch - đẹp', focus: 'Giữ vệ sinh bàn ghế, chăm sóc công trình măng non của lớp' },
  { week: 14, term: 1, title: 'Tuần 14: Rèn luyện kỹ năng sống & Tự phục vụ', focus: 'Tự giác chuẩn bị đồ dùng học tập theo thời khóa biểu' },
  { week: 15, term: 1, title: 'Tuần 15: Thi đua mừng Ngày thành lập QĐND VN 22/12', focus: 'Tìm hiểu truyền thống anh bộ đội Cụ Hồ, rèn tác phong nhanh nhẹn' },
  { week: 16, term: 1, title: 'Tuần 16: Cao điểm ôn tập kiến thức Cuối Học kì I', focus: 'Luyện đề cương ôn tập môn Toán, Tiếng Việt, Lịch sử - Địa lí, Khoa học' },
  { week: 17, term: 1, title: 'Tuần 17: Kiểm tra định kì Cuối Học kì I', focus: 'Nghiêm túc trong thi cử, làm bài cẩn thận, không nhìn bài bạn' },
  { week: 18, term: 1, title: 'Tuần 18: Đánh giá xếp loại & Tổng kết Học kì I', focus: 'Bình xét thi đua 6 tổ, đánh giá học tập theo Thông tư 27, họp PHHS HKI' },

  // Học kì II (Tuần 19 - 35)
  { week: 19, term: 2, title: 'Tuần 19: Khởi động Học kì II & Quyết tâm mới', focus: 'Ổn định sĩ số, kiện toàn ban cán sự, đăng ký chỉ tiêu phấn đấu HKII' },
  { week: 20, term: 2, title: 'Tuần 20: Chào mừng Ngày thành lập Đảng 3/2', focus: 'Thi đua đạt điểm tốt, thực hiện nghiêm túc 5 điều Bác Hồ dạy' },
  { week: 21, term: 2, title: 'Tuần 21: Đón Tết Nguyên Đán an toàn, tiết kiệm', focus: 'Tuyên truyền an toàn pháo nổ, an toàn giao thông và phòng chống dịch' },
  { week: 22, term: 2, title: 'Tuần 22: Ổn định nền nếp ngay sau kỳ nghỉ Tết', focus: 'Duy trì sĩ số 100%, đi học đúng giờ, chuẩn bị đầy đủ bài vở sau Tết' },
  { week: 23, term: 2, title: 'Tuần 23: Phong trào "Đọc và làm theo báo Đội"', focus: 'Xây dựng tủ sách lớp học, duy trì thói quen đọc sách 15 phút mỗi ngày' },
  { week: 24, term: 2, title: 'Tuần 24: Kỷ niệm Ngày Quốc tế Phụ nữ 8/3', focus: 'Giáo dục lòng hiếu thảo với bà, mẹ, cô giáo; thi đua giành bông hoa điểm tốt' },
  { week: 25, term: 2, title: 'Tuần 25: Đẩy mạnh phong trào Rèn chữ - Giữ vở', focus: 'Kiểm tra nếp giữ vở, rèn chữ viết đều nét, sửa lỗi chính tả' },
  { week: 26, term: 2, title: 'Tuần 26: Ngày hội Thiếu nhi vui khỏe - Tiến bước lên Đoàn 26/3', focus: 'Tham gia trò chơi dân gian, đồng diễn thể dục toàn trường' },
  { week: 27, term: 2, title: 'Tuần 27: Sơ kết & Đánh giá định kì Giữa Học kì II', focus: 'Khảo sát giữa HKII, rà soát học sinh có nguy cơ chưa hoàn thành môn học' },
  { week: 28, term: 2, title: 'Tuần 28: Thi đua cao điểm hướng tới Đại thắng 30/4', focus: 'Tăng tốc học tập, tích cực phát biểu, tăng cường phụ đạo nhóm đôi bạn' },
  { week: 29, term: 2, title: 'Tuần 29: Kỷ niệm Ngày Giải phóng miền Nam 30/4 & 1/5', focus: 'Giáo dục truyền thống yêu nước và lòng biết ơn các thế hệ cha anh' },
  { week: 30, term: 2, title: 'Tuần 30: Tổng ôn tập toàn diện 12 môn học Lớp 4', focus: 'Hệ thống hóa kiến thức trọng tâm cả năm môn Toán, Tiếng Việt, Tiếng Anh' },
  { week: 31, term: 2, title: 'Tuần 31: Kỷ niệm Ngày thành lập Đội 15/5 & Sinh nhật Bác 19/5', focus: 'Phong trào nghìn việc tốt, kết nạp Đội viên đợt cuối, học tập gương Bác Hồ' },
  { week: 32, term: 2, title: 'Tuần 32: Kiểm tra định kì Cuối Học kì II & Cuối năm', focus: 'Tập trung làm bài kiểm tra nghiêm túc, trung thực, đạt kết quả cao nhất' },
  { week: 33, term: 2, title: 'Tuần 33: Hoàn thành đánh giá học bạ & Sổ theo dõi', focus: 'Giáo viên hoàn thiện nhận xét học bạ, vào điểm số, tổng hợp kết quả cả năm' },
  { week: 34, term: 2, title: 'Tuần 34: Bình xét danh hiệu thi đua & Khen thưởng cuối năm', focus: 'Bình chọn Học sinh Xuất sắc, Học sinh Tiêu biểu hoàn thành tốt trong học tập' },
  { week: 35, term: 2, title: 'Tuần 35: Lễ Bế giảng năm học & Bàn giao sinh hoạt hè', focus: 'Tổng kết năm học 2026 - 2027, phát thưởng, bàn giao học sinh về Đoàn xã/phường' },
];

export const DAY_NAMES = [
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy'
];

/**
 * Generate default daily report based on app data and selected date
 */
export function generateDefaultDailyReport(dateStr: string, appData: AppData): DailyReportRecord {
  const d = new Date(dateStr);
  const dayIdx = d.getDay(); // 0 = Chủ nhật, 1 = Thứ Hai...
  const dayName = dayIdx >= 1 && dayIdx <= 6 ? DAY_NAMES[dayIdx - 1] : 'Thứ Hai';
  const total = appData.students.length;

  const dayAtt = appData.attendance[dateStr] || {};
  let p = 0, cp = 0, k = 0, m = 0;
  Object.values(dayAtt).forEach((st) => {
    if (st === 'present') p++;
    else if (st === 'absent_p') cp++;
    else if (st === 'absent_k') k++;
    else if (st === 'late') m++;
  });

  const hasData = Object.keys(dayAtt).length > 0;
  let attText = '';
  if (hasData) {
    attText = `Sĩ số: ${p + m}/${total} học sinh có mặt (${Math.round(((p + m) / Math.max(1, total)) * 100)}%). `;
    if (cp > 0) attText += `Nghỉ có phép: ${cp} em. `;
    if (k > 0) attText += `Nghỉ không phép: ${k} em. `;
    if (m > 0) attText += `Đi học muộn: ${m} em.`;
  } else {
    attText = `Sĩ số duy trì đủ ${total}/${total} em (đạt 100%). Lớp đi học đúng giờ, chuyên cần nghiêm túc.`;
  }

  return {
    date: dateStr,
    dayOfWeek: dayName,
    attendanceText: attText,
    morningNote: '- Lớp trưởng và các tổ trưởng điều hành 15 phút truy bài đầu giờ nghiêm túc.\n- 100% học sinh mặc đúng đồng phục, đeo khăn quàng đỏ chỉnh tề.\n- Vệ sinh lớp học sạch sẽ, bàn ghế kê ngay ngắn, bảng lau sạch trước giờ vào lớp.',
    academicNote: '- Các tiết học sáng và chiều diễn ra sôi nổi, học sinh hăng hái giơ tay phát biểu.\n- Tiết Toán: Đa số học sinh nắm chắc cách tính và áp dụng làm bài tốt.\n- Tiết Tiếng Việt: Các em đọc diễn cảm, chữ viết nắn nót, hoàn thành bài viết tại lớp.\n- Giáo viên bộ môn nhận xét lớp trật tự, chuẩn bị sách vở và đồ dùng chu đáo.',
    conductNote: '- Tuyên dương Tổ 1 và Tổ 5 có tinh thần học tập tích cực, nhiều hoa điểm tốt.\n- Tuyên dương em Trương Thảo My, Đỗ Hải Nam gương mẫu trong quản lý và hỗ trợ bạn.\n- Nhắc nhở một vài em còn nói chuyện tự do trong giờ làm bài tập cần tập trung hơn.',
    homeworkNote: '- Ôn lại các công thức Toán vừa học và hoàn thành bài tập vận dụng trong vở bài tập.\n- Chuẩn bị bài đọc tiếp theo cho môn Tiếng Việt.\n- Đem đầy đủ dụng cụ học tập theo thời khóa biểu ngày mai.',
    specialEventNote: 'Lớp học diễn ra an toàn, không có sự cố đột xuất về sức khỏe hay nề nếp.',
  };
}

/**
 * Generate default weekly report for week 1 -> 35
 */
export function generateDefaultWeeklyReport(weekNum: number, appData: AppData): WeeklyReportRecord {
  const meta = WEEKS_35_LIST.find((w) => w.week === weekNum) || {
    week: weekNum,
    term: weekNum <= 18 ? 1 : 2,
    title: `Tuần ${weekNum}: Đẩy mạnh thi đua Dạy tốt - Học tốt`,
    focus: 'Duy trì nền nếp chuyên cần và rèn luyện kỹ năng học tập',
  };

  const total = appData.students.length;
  const teacher = appData.settings.teacher || 'Phạm Thị Hồng Anh';
  const className = appData.settings.class || '4C';

  return {
    week: weekNum,
    term: meta.term,
    title: meta.title,
    attendanceNote: `Duy trì sĩ số ổn định ${total}/${total} học sinh (đạt 100%). Tỷ lệ chuyên cần trong tuần đạt mức cao, học sinh đi học đúng giờ, không có hiện tượng bỏ tiết hay nghỉ không lý do. Các trường hợp nghỉ ốm đều có đơn xin phép kịp thời của phụ huynh.`,
    disciplineNote: `Nề nếp kỷ luật của lớp chuyển biến rất tích cực:\n- 15 phút truy bài đầu giờ được duy trì đều đặn dưới sự hướng dẫn của Ban chỉ huy chi đội và 6 tổ trưởng.\n- Tác phong, trang phục, khăn quàng đỏ chỉnh tề, thực hiện tốt nếp xếp hàng ra vào lớp.\n- Xếp loại thi đua các tổ trong tuần: Tổ 1 và Tổ 5 đạt giải Nhất; Tổ 2 và Tổ 6 đạt giải Nhì; Tổ 3 và Tổ 4 đạt giải Ba.\n- Tuyên dương các em học sinh tiêu biểu: Nguyễn Minh Anh, Đỗ Hải Nam, Trương Thảo My, Võ Mai Chi.`,
    academicNote: `Hoạt động học tập bám sát chương trình Giáo dục phổ thông 2018:\n- Các em học sinh tích cực phát biểu xây dựng bài, biết hợp tác nhóm hiệu quả trong các tiết Toán, Khoa học, Lịch sử và Địa lí.\n- Đa số học sinh hoàn thành tốt bài kiểm tra miệng và bài tập trên lớp.\n- Đối với một số học sinh còn chậm tính toán hay chính tả, GVCN đã phân công nhóm "Đôi bạn cùng tiến" và dành thời gian bồi dưỡng cuối buổi học.`,
    movementNote: `- Lớp tham gia đầy đủ các phong trào do Liên đội phát động: "Kế hoạch nhỏ", chăm sóc bồn hoa măng non.\n- Duy trì tập thể dục giữa giờ đều đặn, đúng động tác, hàng ngũ thẳng tắp.\n- Sinh hoạt Sao nhi đồng và sinh hoạt Chi đội diễn ra sôi nổi, đúng chủ điểm tuần.`,
    teacherNote: `Nhìn chung trong ${meta.title.toLowerCase()}, tập thể Lớp ${className} dưới sự đôn đốc thường xuyên của GVCN ${teacher} đã giữ vững được kỷ cương, nề nếp và hoàn thành thắng lợi các mục tiêu đề ra. Sự gắn kết giữa giáo viên, phụ huynh và học sinh ngày càng khăng khít.`,
    nextWeekPlan: `- Tiếp tục duy trì sĩ số và nền nếp chuyên cần, kiểm tra nghiêm ngặt việc học bài cũ.\n- Đẩy mạnh phong trào hoa điểm mười, thi đua lập thành tích xuất sắc.\n- Tăng cường kiểm tra vở ghi và sách giáo khoa của học sinh.\n- Phối hợp chặt chẽ với phụ huynh các em cần hỗ trợ môn Toán và Tiếng Việt.`,
  };
}

/**
 * Generate default Period Reports (Sơ kết giữa kì 1, Cuối kì 1, Sơ kết giữa kì 2, Cuối kì 2 / Tổng kết năm)
 */
export function generateDefaultPeriodReport(
  periodKey: 'mid1' | 'end1' | 'mid2' | 'end2',
  appData: AppData
): PeriodReportRecord {
  const total = appData.students.length;
  const boys = appData.students.filter((s) => s.gender === 'Nam').length;
  const girls = appData.students.filter((s) => s.gender === 'Nữ').length;
  const className = appData.settings.class || '4C';
  const school = appData.settings.school || 'Trường Tiểu học Lê Hồng Phong';
  const teacher = appData.settings.teacher || 'Phạm Thị Hồng Anh';

  if (periodKey === 'mid1') {
    return {
      periodKey: 'mid1',
      title: `BÁO CÁO SƠ KẾT GIỮA HỌC KÌ I - LỚP ${className}`,
      subTitle: `Năm học: ${appData.settings.year} - Trường Tiểu học Lê Hồng Phong`,
      attendanceText: `Tổng số học sinh: ${total} em (Nam: ${boys}, Nữ: ${girls}). Duy trì sĩ số 100%, không có học sinh bỏ học. Tỷ lệ chuyên cần đạt 99.2%. Các em đi học đúng giờ, đầy đủ, chấp hành nghiêm nội quy trường lớp.`,
      academicSummary: `- Đánh giá thường xuyên 12 môn học: Toàn bộ học sinh đều được đánh giá đầy đủ, công bằng theo Thông tư 27/2020/TT-BGDĐT.\n- Môn Toán: Hoàn thành tốt: ${Math.round(total * 0.58)} em (${Math.round(58)}%), Hoàn thành: ${Math.round(total * 0.38)} em, Cần hỗ trợ: ${Math.max(1, total - Math.round(total * 0.96))} em.\n- Môn Tiếng Việt: Đọc trôi chảy, diễn cảm, kỹ năng viết đoạn văn miêu tả tiến bộ rõ rệt.\n- Các môn Tiếng Anh, Tin học, Khoa học, Lịch sử - Địa lí, Nghệ thuật đạt kết quả tốt.`,
      competenceSummary: `- Năng lực tự chủ và tự học: ${Math.round(total * 0.65)} em đạt mức Tốt, các em biết tự chuẩn bị bài và thực hiện nhiệm vụ được giao.\n- Năng lực giao tiếp và hợp tác: Hoạt động thảo luận nhóm 6 tổ diễn ra sôi nổi, biết lắng nghe và chia sẻ.\n- Năng lực giải quyết vấn đề và sáng tạo: Nhiều em có ý tưởng mới trong môn Mĩ thuật và giải toán thông minh.`,
      qualitySummary: `- Phẩm chất Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm được hình thành và rèn luyện vững chắc qua từng bài học và hoạt động trải nghiệm.\n- 100% học sinh lễ phép với thầy cô, hòa đồng giúp đỡ bạn bè, trung thực trong kiểm tra.`,
      movementSummary: `- Tham gia tích cực phong trào "Thiếu nhi vui khỏe", hoạt động Trung Thu và làm kế hoạch nhỏ.\n- Công tác bán trú: Các em ăn hết suất, giữ trật tự giờ ngủ trưa, thực hiện nếp sống văn minh.`,
      praiseSummary: `Tuyên dương 10 học sinh xuất sắc tiêu biểu giữa Học kì I: Trương Thảo My, Đỗ Hải Nam, Nguyễn Minh Anh, Lê Hoàng Minh, Bùi Ngọc Anh, Vũ Minh Khang, Võ Mai Chi, Nguyễn Ngọc Hà...`,
      directionPlan: `1. Tiếp tục duy trì sĩ số 100% và giữ vững nền nếp lớp tự quản.\n2. Tăng cường phụ đạo học sinh còn chậm môn Toán và rèn chính tả Tiếng Việt.\n3. Đẩy mạnh phong trào thi đua chào mừng Ngày Nhà giáo Việt Nam 20/11.\n4. Tăng cường liên lạc thường xuyên với phụ huynh học sinh qua sổ liên lạc và Zalo nhóm lớp.`,
      teacherNote: `Trong nửa đầu Học kì I, tập thể lớp ${className} đã thể hiện sự đoàn kết, chăm chỉ và đạt được nhiều kết quả đáng tự hào. Cô Phạm Thị Hồng Anh tiếp tục đồng hành để đưa lớp đạt danh hiệu Tập thể Xuất sắc.`,
    };
  }

  if (periodKey === 'end1') {
    return {
      periodKey: 'end1',
      title: `BÁO CÁO TỔNG KẾT CUỐI HỌC KÌ I - LỚP ${className}`,
      subTitle: `Năm học: ${appData.settings.year} - Trường Tiểu học Lê Hồng Phong`,
      attendanceText: `Sĩ số cuối kỳ: ${total}/${total} học sinh (Nam: ${boys}, Nữ: ${girls}), đạt tỷ lệ duy trì 100%. Tỷ lệ học sinh đi học chuyên cần cả học kì đạt 99.5%.`,
      academicSummary: `- Kết quả đánh giá giáo dục 12 môn học cuối Học kì I:\n  + Hoàn thành Tốt (HTT): ${Math.round(total * 0.62)} em (${Math.round(62)}%)\n  + Hoàn thành (HT): ${total - Math.round(total * 0.62)} em (${Math.round(38)}%)\n  + Chưa hoàn thành (CHT): 0 em (100% học sinh hoàn thành chương trình HKI).\n- Môn Toán và Tiếng Việt có sự tiến bộ vượt bậc về tư duy và kỹ năng viết văn bản.`,
      competenceSummary: `- 100% học sinh xếp loại Đạt và Tốt về các năng lực cốt lõi.\n- Tinh thần tự học ở nhà và tinh thần tự quản trong lớp nâng lên rõ rệt.\n- Kỹ năng ứng dụng công nghệ thông tin và ngoại ngữ được phụ huynh và nhà trường đánh giá cao.`,
      qualitySummary: `- 100% học sinh đạt mức Tốt và Đạt về 5 phẩm chất chủ yếu theo chương trình GDPT 2018.\n- Không có học sinh vi phạm kỷ luật hay làm ảnh hưởng đến nề nếp chung của nhà trường.`,
      movementSummary: `- Đạt giải Nhất phong trào văn nghệ chào mừng 20/11 cấp trường.\n- Chi đội 4C đạt danh hiệu Chi đội Mạnh xuất sắc học kì I.\n- Hoàn thành xuất sắc chỉ tiêu phong trào "Kế hoạch nhỏ" và "Nuôi heo đất giúp bạn vượt khó".`,
      praiseSummary: `- Đề nghị Hiệu trưởng khen thưởng:\n  + Học sinh Xuất sắc HKI: ${Math.round(total * 0.45)} em.\n  + Học sinh Tiêu biểu hoàn thành tốt: ${Math.round(total * 0.35)} em.\n  + Khen thưởng 6 tổ trưởng và Ban chỉ huy chi đội đã hoàn thành xuất sắc nhiệm vụ.`,
      directionPlan: `1. Ổn định ngay nền nếp sau kì nghỉ Tết Nguyên đán, bảo đảm sĩ số 100%.\n2. Triển khai kế hoạch dạy học Học kì II bám sát phân phối chương trình.\n3. Duy trì mô hình "Đôi bạn cùng tiến", nâng cao chất lượng đại trà và bồi dưỡng năng khiếu.\n4. Chuẩn bị tốt cho Hội khỏe Phù Đổng và ngày hội Thiếu nhi tiến bước lên Đoàn.`,
      teacherNote: `Học kì I khép lại với nhiều thành tích rực rỡ của Lớp ${className}. Giáo viên chủ nhiệm biểu dương sự cố gắng vượt bậc của tất cả các em học sinh và xin chân thành cảm ơn sự đồng hành quý báu của Ban đại diện CMHS.`,
    };
  }

  if (periodKey === 'mid2') {
    return {
      periodKey: 'mid2',
      title: `BÁO CÁO SƠ KẾT GIỮA HỌC KÌ II - LỚP ${className}`,
      subTitle: `Năm học: ${appData.settings.year} - Trường Tiểu học Lê Hồng Phong`,
      attendanceText: `Sĩ số hiện tại: ${total} học sinh (Nam: ${boys}, Nữ: ${girls}). Sau Tết Nguyên Đán, 100% học sinh trở lại trường đúng lịch, nề nếp ổn định nhanh chóng. Tỷ lệ chuyên cần đạt 99.4%.`,
      academicSummary: `- Khảo sát định kì Giữa Học kì II phản ánh đúng năng lực thực chất của học sinh.\n- Điểm kiểm tra định kì môn Toán và Tiếng Việt phân hóa tốt, không có điểm dưới trung bình.\n- Tỷ lệ học sinh đạt điểm 9-10 tăng 12% so với kì trước.\n- Môn Khoa học, Lịch sử - Địa lí, Tin học các em học tập hào hứng, nắm vững kiến thức thực hành.`,
      competenceSummary: `- Các năng lực đặc thù như ngôn ngữ, tính toán, khoa học, thẩm mỹ phát triển đồng đều.\n- Học sinh mạnh dạn, tự tin thuyết trình bài làm trước lớp và giao lưu tiếng Anh.`,
      qualitySummary: `- Các em có ý thức bảo vệ của công, giữ gìn vệ sinh khuôn viên trường lớp.\n- Đoàn kết, thân ái, biết nhường nhịn và sẻ chia cùng bạn bè trong lớp.`,
      movementSummary: `- 100% học sinh tham gia Ngày hội Thiếu nhi vui khỏe - Tiến bước lên Đoàn 26/3.\n- Đạt giải Ba cuộc thi cờ vua cấp trường và 2 giải thi vẽ tranh thiếu nhi.`,
      praiseSummary: `Tuyên dương các học sinh có tiến bộ vượt bậc giữa kì II: Hoàng Đức Anh, Phạm Khánh Linh, Trần Gia Bảo, Phan Quốc Huy cùng các cá nhân xuất sắc giữ vững phong độ.`,
      directionPlan: `1. Bước vào giai đoạn cao điểm ôn tập chuẩn bị cho kỳ kiểm tra Cuối năm học.\n2. Phân loại đối tượng học sinh để có kế hoạch ôn tập sát sao theo từng nhóm.\n3. Phối hợp với gia đình quản lý việc học tập và thời gian sử dụng thiết bị điện tử ở nhà.\n4. Đảm bảo sức khỏe cho học sinh trong giai đoạn giao mùa.`,
      teacherNote: `Lớp ${className} giữ vững phong độ học tập tốt và nề nếp tự quản vững vàng. Toàn thể học sinh quyết tâm nỗ lực hết mình cho đợt thi đua cuối năm.`,
    };
  }

  // end2: Tổng kết Cuối Học kì 2 & Tổng kết Năm học
  return {
    periodKey: 'end2',
    title: `BÁO CÁO TỔNG KẾT NĂM HỌC 2026 - 2027 (CUỐI HỌC KÌ II) - LỚP ${className}`,
    subTitle: `Trường Tiểu học Lê Hồng Phong - GVCN: Cô Phạm Thị Hồng Anh`,
    attendanceText: `Duy trì sĩ số cả năm: ${total}/${total} học sinh (đạt 100%), không có học sinh bỏ học hoặc chuyển trường giữa chừng. Tỷ lệ chuyên cần bình quân cả năm đạt 99.6%.`,
    academicSummary: `- Đánh giá kết quả giáo dục cuối năm học theo Thông tư 27/2020/TT-BGDĐT:\n  + Hoàn thành xuất sắc các nội dung học tập và rèn luyện: ${Math.round(total * 0.48)} em (${Math.round(48)}%)\n  + Hoàn thành tốt: ${Math.round(total * 0.35)} em (${Math.round(35)}%)\n  + Hoàn thành: ${total - Math.round(total * 0.83)} em (${Math.round(17)}%)\n  + Chưa hoàn thành: 0 em (0%)\n- Tỷ lệ hoàn thành chương trình Lớp 4 lên Lớp 5: 100% (${total}/${total} học sinh lên lớp thẳng).`,
    competenceSummary: `- Đánh giá mức độ hình thành và phát triển năng lực cuối năm:\n  + Tự chủ và tự học: Tốt: ${Math.round(total * 0.7)} em; Đạt: ${total - Math.round(total * 0.7)} em.\n  + Giao tiếp và hợp tác: Tốt: ${Math.round(total * 0.75)} em; Đạt: ${total - Math.round(total * 0.75)} em.\n  + Giải quyết vấn đề và sáng tạo: Tốt: ${Math.round(total * 0.65)} em; Đạt: ${total - Math.round(total * 0.65)} em.`,
    qualitySummary: `- 100% học sinh xếp loại Đạt và Tốt về 5 phẩm chất chủ yếu (Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm).\n- Tập thể lớp đạt chuẩn "Lớp học thân thiện, học sinh tích cực", nền nếp gương mẫu toàn khối 4.`,
    movementSummary: `- Đạt danh hiệu "Tập thể lớp Xuất sắc" cấp trường năm học 2026 - 2027.\n- Chi đội đạt danh hiệu "Chi đội Vững mạnh Xuất sắc" nhận Giấy khen của Hội đồng Đội.\n- 100% đội viên đạt danh hiệu Cháu ngoan Bác Hồ.`,
    praiseSummary: `- Đề nghị khen thưởng tổng kết năm học:\n  + Danh hiệu Học sinh Xuất sắc: ${Math.round(total * 0.48)} em.\n  + Danh hiệu Học sinh Tiêu biểu hoàn thành tốt: ${Math.round(total * 0.35)} em.\n  + Khen thưởng học sinh có thành tích vượt bậc và hoạt động phong trào xuất sắc: ${total - Math.round(total * 0.83)} em.`,
    directionPlan: `1. Hoàn tất bàn giao hồ sơ học bạ Lớp 4 lên Lớp 5 đầy đủ, chính xác.\n2. Tổ chức buổi họp phụ huynh cuối năm trang trọng, ấm cúng và đầy ý nghĩa.\n3. Bàn giao 100% học sinh về sinh hoạt hè an toàn, bổ ích tại địa phương.\n4. Dặn dò học sinh vui chơi lành mạnh, phòng chống tai nạn thương tích và đuối nước trong dịp hè.`,
    teacherNote: `Năm học 2026 - 2027 đã thành công rực rỡ với sự nỗ lực không ngừng nghỉ của cô và trò Lớp ${className}. Cô Phạm Thị Hồng Anh vô cùng tự hào về sự trưởng thành của các em học sinh và chân thành cảm ơn Ban Giám hiệu cùng quý bậc phụ huynh đã luôn tin tưởng, đồng hành.`,
  };
}
