import * as XLSX from 'xlsx';
import { Student, Gender } from '../types';

export interface ParsedStudentRow {
  name: string;
  dob?: string;
  gender: Gender;
  group: number;
  parent?: string;
  phone?: string;
  note?: string;
}

export interface ColumnMappingConfig {
  nameCol: number;
  hoDemCol: number;
  tenCol: number;
  dobCol: number;
  dayCol: number;
  monthCol: number;
  yearCol: number;
  genderCol: number;
  isFemaleCol: number;
  groupCol: number;
  parentCol: number;
  fatherCol: number;
  motherCol: number;
  phoneCol: number;
  fatherPhoneCol: number;
  motherPhoneCol: number;
  noteCol: number;
}

export interface ExcelParseResult {
  students: ParsedStudentRow[];
  headers: { index: number; label: string }[];
  rawRows: any[][];
  headerRowIndex: number;
  colConfig: ColumnMappingConfig;
}

/**
 * Robust date normalization: supports DD/MM/YYYY, DD.MM.YYYY, 2-digit years,
 * Excel serial dates (numbers and strings), Date objects, separate D/M/Y components.
 */
export function normalizeDate(val: any, rawCell?: any): string {
  if (val === null || val === undefined || val === '') return '2016-01-01';

  // 1. If Date object
  if (val instanceof Date) {
    const y = val.getUTCFullYear();
    const m = String(val.getUTCMonth() + 1).padStart(2, '0');
    const d = String(val.getUTCDate()).padStart(2, '0');
    if (y >= 1990 && y <= 2030) return `${y}-${m}-${d}`;
  }
  if (rawCell && rawCell.v instanceof Date) {
    const y = rawCell.v.getUTCFullYear();
    const m = String(rawCell.v.getUTCMonth() + 1).padStart(2, '0');
    const d = String(rawCell.v.getUTCDate()).padStart(2, '0');
    if (y >= 1990 && y <= 2030) return `${y}-${m}-${d}`;
  }

  // 2. If number or numeric string (Excel serial date)
  const numVal = typeof val === 'number' ? val : (typeof val === 'string' && /^\d{5}(\.\d+)?$/.test(val.trim()) ? parseFloat(val.trim()) : null);
  if (numVal && numVal > 25000 && numVal < 60000) {
    try {
      const parsed = XLSX.SSF.parse_date_code(numVal);
      if (parsed && parsed.y >= 1990 && parsed.y <= 2030) {
        const y = parsed.y;
        const m = String(parsed.m).padStart(2, '0');
        const d = String(parsed.d).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    } catch {
      // fallback
    }
  }

  const str = String(val).trim();

  // 3. DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = str.match(/^(\d{1,2})[./\-](\d{1,2})[./\-](\d{4})/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // 4. DD/MM/YY or DD-MM-YY or DD.MM.YY (2-digit year)
  const dmyShortMatch = str.match(/^(\d{1,2})[./\-](\d{1,2})[./\-](\d{2})$/);
  if (dmyShortMatch) {
    const day = dmyShortMatch[1].padStart(2, '0');
    const month = dmyShortMatch[2].padStart(2, '0');
    let yearNum = parseInt(dmyShortMatch[3], 10);
    yearNum = yearNum < 50 ? 2000 + yearNum : 1900 + yearNum;
    return `${yearNum}-${month}-${day}`;
  }

  // 5. YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const ymdMatch = str.match(/^(\d{4})[./\-](\d{1,2})[./\-](\d{1,2})/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 6. Just a 4-digit year: "2016"
  const yearOnlyMatch = str.match(/^(\d{4})$/);
  if (yearOnlyMatch) {
    const y = parseInt(yearOnlyMatch[1], 10);
    if (y >= 1990 && y <= 2030) {
      return `${y}-01-01`;
    }
  }

  // 7. Text like "ngày 15 tháng 1 năm 2016"
  const textDateMatch = str.match(/(\d{1,2})\s*th(?:áng)?\s*(\d{1,2})\s*n(?:ăm)?\s*(\d{4})/i);
  if (textDateMatch) {
    const day = textDateMatch[1].padStart(2, '0');
    const month = textDateMatch[2].padStart(2, '0');
    const year = textDateMatch[3];
    return `${year}-${month}-${day}`;
  }

  return '2016-01-01';
}

/**
 * Normalize group number (1 to 6)
 * Checks cell value, and if missing/default, looks into fallback text (e.g. note or role)
 */
export function normalizeGroup(val: any, fallbackText?: string): number {
  if (val !== undefined && val !== null && val !== '') {
    const str = String(val).toLowerCase().trim();
    
    // Check direct word
    if (str.includes('sáu') || str.includes('sau') || str === '6') return 6;
    if (str.includes('năm') || str.includes('nam') || str === '5') {
      // Ensure it's not the gender "Nam"
      if (str.includes('tổ') || str.includes('nhóm') || str === '5') return 5;
    }
    if (str.includes('bốn') || str.includes('bon') || str.includes('tư') || str === '4') return 4;
    if (str.includes('ba') || str === '3') return 3;
    if (str.includes('hai') || str === '2') return 2;
    if (str.includes('một') || str.includes('mot') || str === '1') return 1;

    // Check digit in cell
    const numMatch = str.match(/(\d+)/);
    if (numMatch) {
      const num = parseInt(numMatch[1], 10);
      if (num >= 1 && num <= 6) return num;
    }
  }

  // Check fallbackText (e.g., Note: "Tổ trưởng tổ 5", "Tổ 3", etc.)
  if (fallbackText) {
    const lower = fallbackText.toLowerCase();
    const groupMatch = lower.match(/tổ\s*(?:trưởng|phó|viên)?\s*(\d+)/);
    if (groupMatch) {
      const n = parseInt(groupMatch[1], 10);
      if (n >= 1 && n <= 6) return n;
    }
    const nhomMatch = lower.match(/nhóm\s*(\d+)/);
    if (nhomMatch) {
      const n = parseInt(nhomMatch[1], 10);
      if (n >= 1 && n <= 6) return n;
    }
    if (lower.includes('tổ sáu') || lower.includes('tổ 6')) return 6;
    if (lower.includes('tổ năm') || lower.includes('tổ 5')) return 5;
    if (lower.includes('tổ bốn') || lower.includes('tổ tư') || lower.includes('tổ 4')) return 4;
    if (lower.includes('tổ ba') || lower.includes('tổ 3')) return 3;
    if (lower.includes('tổ hai') || lower.includes('tổ 2')) return 2;
    if (lower.includes('tổ một') || lower.includes('tổ 1')) return 1;
  }

  return 1;
}

/**
 * Normalize gender string
 */
export function normalizeGender(val: any, isFemaleColumn = false): Gender {
  if (isFemaleColumn) {
    if (!val) return 'Nam';
    const s = String(val).toLowerCase().trim();
    if (s === 'x' || s === '1' || s === 'v' || s === 'nữ' || s === 'nu' || s === 'có') {
      return 'Nữ';
    }
    return 'Nam';
  }

  if (!val) return 'Nam';
  const str = String(val).toLowerCase().trim();
  if (
    str === 'nữ' ||
    str === 'nu' ||
    str === 'female' ||
    str === 'gái' ||
    str === 'f' ||
    str.startsWith('nữ')
  ) {
    return 'Nữ';
  }
  return 'Nam';
}

/**
 * Normalize phone number
 */
export function normalizePhone(val: any): string {
  if (!val) return '';
  let str = String(val).replace(/[^\d+]/g, '').trim();
  if (str.startsWith('+84')) {
    str = '0' + str.slice(3);
  } else if (str.startsWith('84') && str.length >= 11) {
    str = '0' + str.slice(2);
  }
  return str.length >= 8 ? str : '';
}

/**
 * Detect column indexes based on header names
 */
export function detectColumnsFromHeaders(headers: string[]): ColumnMappingConfig {
  const config: ColumnMappingConfig = {
    nameCol: -1,
    hoDemCol: -1,
    tenCol: -1,
    dobCol: -1,
    dayCol: -1,
    monthCol: -1,
    yearCol: -1,
    genderCol: -1,
    isFemaleCol: -1,
    groupCol: -1,
    parentCol: -1,
    fatherCol: -1,
    motherCol: -1,
    phoneCol: -1,
    fatherPhoneCol: -1,
    motherPhoneCol: -1,
    noteCol: -1,
  };

  headers.forEach((h, colIdx) => {
    if (!h) return;
    const text = h.toLowerCase().trim();

    // 1. Phone matching FIRST to prevent 'điện thoại mẹ' from matching motherCol
    if (
      text.includes('sđt cha') ||
      text.includes('sdt cha') ||
      text.includes('đt cha') ||
      text.includes('điện thoại cha') ||
      text.includes('sđt bố') ||
      text.includes('đt bố') ||
      text.includes('điện thoại bố')
    ) {
      config.fatherPhoneCol = colIdx;
    } else if (
      text.includes('sđt mẹ') ||
      text.includes('sdt mẹ') ||
      text.includes('đt mẹ') ||
      text.includes('điện thoại mẹ')
    ) {
      config.motherPhoneCol = colIdx;
    } else if (
      text.includes('điện thoại') ||
      text.includes('sđt') ||
      text.includes('sdt') ||
      text.includes('số đt') ||
      text.includes('đtdđ') ||
      text.includes('phone') ||
      text.includes('tel') ||
      text.includes('liên lạc') ||
      text.includes('liên hệ') ||
      text === 'đt' ||
      text === 'dđ'
    ) {
      if (config.phoneCol === -1) config.phoneCol = colIdx;
    }
    // 2. Parent matching
    else if (
      text.includes('họ tên cha') ||
      text.includes('họ và tên cha') ||
      text.includes('tên cha') ||
      text.includes('họ tên bố') ||
      text.includes('họ và tên bố') ||
      text.includes('tên bố')
    ) {
      config.fatherCol = colIdx;
    } else if (
      text.includes('họ tên mẹ') ||
      text.includes('họ và tên mẹ') ||
      text.includes('tên mẹ')
    ) {
      config.motherCol = colIdx;
    } else if (
      text.includes('phụ huynh') ||
      text.includes('phhs') ||
      text.includes('người giám hộ') ||
      text.includes('giám hộ') ||
      text.includes('chủ hộ') ||
      text.includes('cha mẹ') ||
      text.includes('bố mẹ') ||
      text.includes('cha/mẹ') ||
      text.includes('bố/mẹ') ||
      text.includes('đại diện') ||
      text === 'ph'
    ) {
      if (config.parentCol === -1) config.parentCol = colIdx;
    }
    // 3. Name matching
    else if (
      text.includes('họ và tên') ||
      text.includes('họ tên') ||
      text.includes('họ và tên học sinh') ||
      text.includes('họ tên hs') ||
      text.includes('tên học sinh') ||
      text === 'name'
    ) {
      if (config.nameCol === -1) config.nameCol = colIdx;
    } else if (
      text.includes('họ và đệm') ||
      text.includes('họ đệm') ||
      text.includes('họ và tên đệm') ||
      text.includes('họ lót') ||
      text === 'họ'
    ) {
      config.hoDemCol = colIdx;
    } else if (text === 'tên' || text.includes('tên gọi')) {
      config.tenCol = colIdx;
    }
    // 4. Date of birth matching
    else if (
      text.includes('ngày sinh') ||
      text.includes('ngày, tháng, năm sinh') ||
      text.includes('ngày/tháng/năm sinh') ||
      text.includes('ngày tháng năm sinh') ||
      text.includes('ng.sinh') ||
      text.includes('ng sinh') ||
      text.includes('ns') ||
      text.includes('sinh nhật') ||
      text.includes('dob') ||
      text.includes('birth')
    ) {
      if (config.dobCol === -1) config.dobCol = colIdx;
    } else if (text === 'ngày') {
      config.dayCol = colIdx;
    } else if (text === 'tháng') {
      config.monthCol = colIdx;
    } else if (text === 'năm sinh' || text === 'năm') {
      config.yearCol = colIdx;
    }
    // 5. Gender matching
    else if (text === 'nữ' || text === 'nữ (x)' || text === 'nữ(x)') {
      config.isFemaleCol = colIdx;
    } else if (
      text.includes('giới tính') ||
      text === 'phái' ||
      text === 'gender' ||
      text === 'nam/nữ'
    ) {
      if (config.genderCol === -1) config.genderCol = colIdx;
    }
    // 6. Group matching
    else if (
      (text.includes('tổ') && !text.includes('tổng') && !text.includes('tổ hợp')) ||
      text.includes('nhóm') ||
      text.includes('phân tổ') ||
      text.includes('tổ/nhóm') ||
      text.includes('tổ số') ||
      text.includes('tổ học tập') ||
      text.includes('tổ sinh hoạt') ||
      text === 'group' ||
      text === 'to' ||
      text === 'tổ'
    ) {
      if (config.groupCol === -1) config.groupCol = colIdx;
    }
    // 7. Note matching
    else if (
      text.includes('ghi chú') ||
      text.includes('nhận xét') ||
      text.includes('chức vụ') ||
      text.includes('nhiệm vụ') ||
      text.includes('đoàn') ||
      text.includes('đội') ||
      text.includes('bán trú') ||
      text.includes('khuyết tật') ||
      text.includes('note')
    ) {
      if (config.noteCol === -1) config.noteCol = colIdx;
    }
  });

  return config;
}

/**
 * Extract a student record from a table row using mapping configuration
 */
export function extractStudentFromRow(
  row: any[],
  cfg: ColumnMappingConfig,
  ws?: any,
  rowIndex?: number
): ParsedStudentRow | null {
  if (!row || !Array.isArray(row) || row.length === 0) return null;

  // 1. Extract Name
  let name = '';
  if (cfg.nameCol !== -1 && row[cfg.nameCol]) {
    name = String(row[cfg.nameCol]).trim();
  } else if (cfg.hoDemCol !== -1 || cfg.tenCol !== -1) {
    const hoDem = cfg.hoDemCol !== -1 && row[cfg.hoDemCol] ? String(row[cfg.hoDemCol]).trim() : '';
    const ten = cfg.tenCol !== -1 && row[cfg.tenCol] ? String(row[cfg.tenCol]).trim() : '';
    name = `${hoDem} ${ten}`.trim();
  }

  // Skip invalid/header rows
  if (
    !name ||
    name.toLowerCase() === 'họ và tên' ||
    name.toLowerCase() === 'họ tên' ||
    name.startsWith('DANH SÁCH') ||
    name.startsWith('Trường') ||
    name.startsWith('TRƯỜNG') ||
    name.startsWith('Tổng số') ||
    name.startsWith('Giáo viên') ||
    name.length < 2
  ) {
    return null;
  }

  // 2. Extract Note first (useful for group inference fallback)
  let note = '';
  if (cfg.noteCol !== -1 && row[cfg.noteCol]) {
    note = String(row[cfg.noteCol]).trim();
  }

  // 3. Extract Group
  let groupVal: any = undefined;
  if (cfg.groupCol !== -1 && row[cfg.groupCol] !== undefined && row[cfg.groupCol] !== null && String(row[cfg.groupCol]).trim() !== '') {
    groupVal = row[cfg.groupCol];
  }
  const group = normalizeGroup(groupVal, note);

  // 4. Extract Date of Birth
  let dob = '2016-01-01';
  let rawCellObj: any = undefined;
  if (ws && rowIndex !== undefined && cfg.dobCol !== -1) {
    rawCellObj = ws[XLSX.utils.encode_cell({ r: rowIndex, c: cfg.dobCol })];
  }

  if (cfg.dobCol !== -1 && row[cfg.dobCol]) {
    dob = normalizeDate(row[cfg.dobCol], rawCellObj);
  } else if (cfg.yearCol !== -1 && row[cfg.yearCol]) {
    const yStr = String(row[cfg.yearCol]).trim();
    const dStr = cfg.dayCol !== -1 && row[cfg.dayCol] ? String(row[cfg.dayCol]).trim().padStart(2, '0') : '01';
    const mStr = cfg.monthCol !== -1 && row[cfg.monthCol] ? String(row[cfg.monthCol]).trim().padStart(2, '0') : '01';
    dob = normalizeDate(`${dStr}/${mStr}/${yStr}`);
  }

  // 5. Extract Gender
  let gender: Gender = 'Nam';
  if (cfg.isFemaleCol !== -1) {
    gender = normalizeGender(row[cfg.isFemaleCol], true);
  } else if (cfg.genderCol !== -1 && row[cfg.genderCol]) {
    gender = normalizeGender(row[cfg.genderCol]);
  }

  // 6. Extract Parent Name & Phone
  let parent = '';
  let phone = '';

  if (cfg.parentCol !== -1 && row[cfg.parentCol]) {
    parent = String(row[cfg.parentCol]).trim();
  } else if (cfg.fatherCol !== -1 && row[cfg.fatherCol]) {
    const father = String(row[cfg.fatherCol]).trim();
    const mother = cfg.motherCol !== -1 && row[cfg.motherCol] ? String(row[cfg.motherCol]).trim() : '';
    parent = father && mother ? `${father} (Bố) - ${mother} (Mẹ)` : father;
  } else if (cfg.motherCol !== -1 && row[cfg.motherCol]) {
    parent = String(row[cfg.motherCol]).trim();
  }

  if (cfg.phoneCol !== -1 && row[cfg.phoneCol]) {
    phone = normalizePhone(row[cfg.phoneCol]);
  } else if (cfg.fatherPhoneCol !== -1 && row[cfg.fatherPhoneCol]) {
    phone = normalizePhone(row[cfg.fatherPhoneCol]);
  } else if (cfg.motherPhoneCol !== -1 && row[cfg.motherPhoneCol]) {
    phone = normalizePhone(row[cfg.motherPhoneCol]);
  }

  return {
    name,
    dob,
    gender,
    group,
    parent,
    phone,
    note,
  };
}

/**
 * Full parser: Inspects workbook, discovers header row (including merged headers),
 * auto-detects columns with extensive Vietnamese terminology, and parses all students.
 */
export async function parseStudentsFromExcel(file: File): Promise<ExcelParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const wb = XLSX.read(buffer, { type: 'array', cellDates: true });

        const sheetName = wb.SheetNames[0];
        if (!sheetName) {
          throw new Error('File Excel không có trang dữ liệu nào.');
        }

        const ws = wb.Sheets[sheetName];
        const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });

        if (!rawData || rawData.length === 0) {
          throw new Error('File Excel rỗng, không tìm thấy dữ liệu.');
        }

        // Find the best header row (from rows 0 to 15)
        let bestHeaderRow = -1;
        let isMergedHeader = false;
        let bestScore = -1;
        let bestHeaders: string[] = [];

        for (let r = 0; r < Math.min(15, rawData.length); r++) {
          const row1 = rawData[r];
          if (!row1 || !Array.isArray(row1)) continue;

          // Score single row
          const headers1 = row1.map((c) => String(c || '').trim());
          const cfg1 = detectColumnsFromHeaders(headers1);
          let score1 = 0;
          if (cfg1.nameCol !== -1 || (cfg1.hoDemCol !== -1 && cfg1.tenCol !== -1)) score1 += 5;
          if (cfg1.dobCol !== -1 || cfg1.yearCol !== -1) score1 += 3;
          if (cfg1.genderCol !== -1 || cfg1.isFemaleCol !== -1) score1 += 2;
          if (cfg1.groupCol !== -1) score1 += 2;
          if (cfg1.parentCol !== -1 || cfg1.fatherCol !== -1 || cfg1.motherCol !== -1) score1 += 2;
          if (cfg1.phoneCol !== -1 || cfg1.fatherPhoneCol !== -1 || cfg1.motherPhoneCol !== -1) score1 += 2;

          if (score1 > bestScore) {
            bestScore = score1;
            bestHeaderRow = r;
            isMergedHeader = false;
            bestHeaders = headers1;
          }

          // Also check merged with next row
          if (r + 1 < rawData.length) {
            const row2 = rawData[r + 1];
            if (row2 && Array.isArray(row2)) {
              const maxCols = Math.max(row1.length, row2.length);
              const compositeHeaders: string[] = [];
              for (let c = 0; c < maxCols; c++) {
                const h1 = String(row1[c] || '').trim();
                const h2 = String(row2[c] || '').trim();
                compositeHeaders.push(h1 === h2 ? h1 : `${h1} ${h2}`.trim());
              }

              const cfg2 = detectColumnsFromHeaders(compositeHeaders);
              let score2 = 0;
              if (cfg2.nameCol !== -1 || (cfg2.hoDemCol !== -1 && cfg2.tenCol !== -1)) score2 += 5;
              if (cfg2.dobCol !== -1 || cfg2.yearCol !== -1) score2 += 3;
              if (cfg2.genderCol !== -1 || cfg2.isFemaleCol !== -1) score2 += 2;
              if (cfg2.groupCol !== -1) score2 += 2;
              if (cfg2.parentCol !== -1 || cfg2.fatherCol !== -1 || cfg2.motherCol !== -1) score2 += 2;
              if (cfg2.phoneCol !== -1 || cfg2.fatherPhoneCol !== -1 || cfg2.motherPhoneCol !== -1) score2 += 2;

              if (score2 > bestScore) {
                bestScore = score2;
                bestHeaderRow = r;
                isMergedHeader = true;
                bestHeaders = compositeHeaders;
              }
            }
          }
        }

        // Fallback header configuration if not found
        if (bestHeaderRow === -1 || bestScore < 3) {
          bestHeaderRow = 0;
          bestHeaders = [
            'STT',
            'Họ và tên',
            'Ngày sinh',
            'Giới tính',
            'Tổ',
            'Phụ huynh',
            'Số điện thoại',
            'Ghi chú',
          ];
        }

        const colConfig = detectColumnsFromHeaders(bestHeaders);
        const dataStartIndex = bestHeaderRow + (isMergedHeader ? 2 : 1);

        const students: ParsedStudentRow[] = [];
        for (let r = dataStartIndex; r < rawData.length; r++) {
          const row = rawData[r];
          const student = extractStudentFromRow(row, colConfig, ws, r);
          if (student) {
            students.push(student);
          }
        }

        if (students.length === 0) {
          throw new Error('Không đọc được danh sách học sinh nào từ file. Hãy kiểm tra lại file Excel.');
        }

        const headersFormatted = bestHeaders.map((label, idx) => ({
          index: idx,
          label: label || `Cột ${String.fromCharCode(65 + (idx % 26))}`,
        }));

        resolve({
          students,
          headers: headersFormatted,
          rawRows: rawData.slice(dataStartIndex),
          headerRowIndex: bestHeaderRow,
          colConfig,
        });
      } catch (err: any) {
        reject(err.message || 'Lỗi khi đọc file Excel.');
      }
    };

    reader.onerror = () => {
      reject('Đã xảy ra lỗi khi đọc tập tin từ thiết bị.');
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Export students list to Excel (.xlsx) file
 */
export function exportStudentsToExcel(
  students: Student[],
  className: string = '4C',
  teacherName: string = 'Phạm Thị Hồng Anh',
  schoolName: string = 'Trường Tiểu học Lê Hồng Phong'
) {
  const wb = XLSX.utils.book_new();

  const titleRows = [
    [schoolName.toUpperCase()],
    [`DANH SÁCH HỌC SINH LỚP ${className}`],
    [`Giáo viên chủ nhiệm: ${teacherName} - Sĩ số: ${students.length} học sinh`],
    [`Ngày xuất file: ${new Date().toLocaleDateString('vi-VN')}`],
    [],
    [
      'STT',
      'Họ và tên',
      'Ngày sinh',
      'Giới tính',
      'Tổ',
      'Họ tên phụ huynh',
      'Số điện thoại',
      'Ghi chú'
    ]
  ];

  const dataRows = students.map((s, idx) => [
    idx + 1,
    s.name,
    s.dob ? s.dob.split('-').reverse().join('/') : '',
    s.gender,
    `Tổ ${s.group}`,
    s.parent || '',
    s.phone || '',
    s.note || ''
  ]);

  const allRows = [...titleRows, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(allRows);

  ws['!cols'] = [
    { wch: 6 },
    { wch: 24 },
    { wch: 14 },
    { wch: 12 },
    { wch: 10 },
    { wch: 24 },
    { wch: 16 },
    { wch: 28 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, `Lop_${className}`);
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Danh_Sach_Hoc_Sinh_Lop_${className}_${dateStr}.xlsx`);
}

/**
 * Download standard Excel template with 6 groups for easy input
 */
export function downloadStudentTemplate(className: string = '4C', teacherName: string = 'Phạm Thị Hồng Anh') {
  const wb = XLSX.utils.book_new();

  const sampleRows = [
    ['DANH SÁCH HỌC SINH MẪU ĐỂ NHẬP LIỆU (LỚP ' + className + ') - TRƯỜNG TIỂU HỌC LÊ HỒNG PHONG'],
    ['Hướng dẫn: Giữ nguyên dòng tiêu đề cột ở dòng số 3. Điền thông tin học sinh từ dòng số 4. Phân tổ từ 1 đến 6.'],
    ['STT', 'Họ và tên', 'Ngày sinh (DD/MM/YYYY)', 'Giới tính (Nam/Nữ)', 'Tổ (1-6)', 'Họ tên phụ huynh', 'Số điện thoại', 'Ghi chú'],
    [1, 'Nguyễn Bảo An', '15/03/2016', 'Nam', 1, 'Nguyễn Văn A', '0901234567', 'Nhanh nhẹn, chăm chỉ'],
    [2, 'Lê Nhã Đan', '22/07/2016', 'Nữ', 5, 'Lê Văn B', '0912345678', 'Tổ trưởng tổ 5'],
    [3, 'Võ Phạm Thành Đạt', '10/11/2016', 'Nam', 2, 'Võ Văn C', '0923456789', 'Học tốt môn Toán'],
    [4, 'Trần Gia Bảo', '20/08/2016', 'Nam', 3, 'Trần Thị D', '0934567890', 'Hăng hái phát biểu'],
    [5, 'Phạm Khánh Linh', '05/11/2016', 'Nữ', 4, 'Phạm Thị E', '0945678901', 'Chữ viết sạch đẹp'],
    [6, 'Hoàng Đức Anh', '18/04/2016', 'Nam', 6, 'Hoàng Văn K', '0989012345', 'Năng nổ hoạt động']
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleRows);

  ws['!cols'] = [
    { wch: 6 },
    { wch: 24 },
    { wch: 22 },
    { wch: 18 },
    { wch: 10 },
    { wch: 22 },
    { wch: 16 },
    { wch: 30 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'MauNhapHocSinh');
  XLSX.writeFile(wb, `Mau_Nhap_Hoc_Sinh_Lop_${className}.xlsx`);
}
