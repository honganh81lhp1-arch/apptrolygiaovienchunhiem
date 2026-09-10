export type Gender = 'Nam' | 'Nữ';

export interface Student {
  id: number;
  name: string;
  dob: string; // YYYY-MM-DD
  gender: Gender;
  group: number; // 1, 2, 3, 4, 5, 6
  parent: string;
  phone: string;
  note: string;
}

export type AttendanceStatus = 'present' | 'absent_p' | 'absent_k' | 'late';

export interface AttendanceDayRecord {
  [studentId: number]: AttendanceStatus;
}

export type AcademicRating = 'HTT' | 'HT' | 'CHT';

export interface SubjectItem {
  key: string;
  name: string;
  shortName: string;
  category: string;
}

export interface StudentAcademics {
  math: AcademicRating;
  vn: AcademicRating;
  nn: AcademicRating;
  dd: AcademicRating;
  kh: AcademicRating;
  his_geo: AcademicRating;
  tin: AcademicRating;
  cn: AcademicRating;
  gdtc: AcademicRating;
  an: AcademicRating;
  mt: AcademicRating;
  hdtn: AcademicRating;
  note: string;
}

export interface DisciplineLog {
  id: string;
  studentId: number;
  studentName: string;
  points: number;
  reason: string;
  timestamp: string;
}

export interface TodoItem {
  id: string;
  task: string;
  done: boolean;
  createdAt: string;
}

export interface AppSettings {
  school: string;
  class: string;
  teacher: string;
  year: string;
}

export interface DailyReportRecord {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  attendanceText?: string;
  morningNote?: string;
  academicNote?: string;
  conductNote?: string;
  homeworkNote?: string;
  specialEventNote?: string;
}

export interface WeeklyReportRecord {
  week: number; // 1 to 35
  term: 1 | 2;
  title: string;
  startDate?: string;
  endDate?: string;
  attendanceNote: string;
  disciplineNote: string;
  academicNote: string;
  movementNote: string;
  teacherNote: string;
  nextWeekPlan: string;
}

export interface PeriodReportRecord {
  periodKey: 'mid1' | 'end1' | 'mid2' | 'end2';
  title: string;
  subTitle: string;
  attendanceText: string;
  academicSummary: string;
  competenceSummary: string;
  qualitySummary: string;
  movementSummary: string;
  praiseSummary: string;
  directionPlan: string;
  teacherNote: string;
}

export interface AppData {
  settings: AppSettings;
  reportNote: string;
  students: Student[];
  attendance: { [date: string]: AttendanceDayRecord };
  discipline: { [studentId: number]: number };
  disciplineLogs: DisciplineLog[];
  academics: { [studentId: number]: StudentAcademics };
  todos: TodoItem[];
  dailyReports?: { [date: string]: DailyReportRecord };
  weeklyReports?: { [week: number]: WeeklyReportRecord };
  periodReports?: { [key: string]: PeriodReportRecord };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'fallback';
}

export type ActiveTab = 
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'discipline'
  | 'academics'
  | 'parents'
  | 'reports'
  | 'ai'
  | 'settings';
