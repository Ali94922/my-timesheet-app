export interface CompanyInfo {
  nameAr: string;
  nameEn: string;
  nameZh?: string; // Optional Chinese title matching the original PDF template
  showChinese: boolean;
  projectOrSite?: string;
}

export interface EmployeeInfo {
  name: string;
  nameZh?: string;
  department: string;
  departmentZh?: string;
  position: string;
  positionZh?: string;
  employeeId: string;
}

export interface TimesheetDay {
  dayNumber: number; // 1 to 31
  dateStr: string; // "Tuesday, September 1, 2026"
  dateFormattedAr: string; // "الثلاثاء، 1 سبتمبر 2026"
  dayOfWeek: string; // "Tuesday", etc.
  isWeekend: boolean;
  inTime: string; // "08:00"
  outTime: string; // "17:00"
  overtimeDay: number; // Day overtime in hours
  overtimeNight: number; // Night overtime in hours
  overtimeTotal: number; // Total overtime
  employeeSign: string; // "✓" or "Signed" or name
  supervisorSign: string; // "✓" or "Approved"
  remark: string; // "Present", "عطلة", "غياب", etc.
  status: 'present' | 'absent' | 'weekend' | 'leave' | 'holiday';
}

export interface TimesheetSummary {
  totalPresentDays: number;
  totalAbsentDays: number;
  totalWeekendDays: number;
  totalOvertimeDayHours: number;
  totalOvertimeNightHours: number;
  grandTotalOvertimeHours: number;
  totalRegularHours: number;
}

export interface TimesheetConfig {
  year: number;
  month: number; // 1-12
  company: CompanyInfo;
  employee: EmployeeInfo;
  supervisorName: string;
  managerName: string;
  supervisorSignText?: string;
  managerSignText?: string;
  standardWorkHours: number; // Default 8
  defaultInTime: string;
  defaultOutTime: string;
  weekendDays: number[]; // 5=Friday, 6=Saturday
}
