import { TimesheetDay, TimesheetSummary } from '../types';

export const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export const DAYS_EN = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const DAYS_AR = [
  'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function generateDaysForMonth(
  year: number,
  month: number,
  weekendDays: number[] = [5] // Default Friday (5 in JS getDay() where 0=Sunday, 5=Friday, 6=Saturday)
): TimesheetDay[] {
  const numDays = getDaysInMonth(year, month);
  const days: TimesheetDay[] = [];

  for (let d = 1; d <= numDays; d++) {
    const date = new Date(year, month - 1, d);
    const dayOfWeekIdx = date.getDay();
    const dayNameEn = DAYS_EN[dayOfWeekIdx];
    const monthNameEn = MONTHS_EN[month - 1];
    const dayNameAr = DAYS_AR[dayOfWeekIdx];
    const monthNameAr = MONTHS_AR[month - 1];

    const isWeekend = weekendDays.includes(dayOfWeekIdx);
    
    // PDF exact format: "Tuesday, September 1, 2026"
    const dateStr = `${dayNameEn}, ${monthNameEn} ${d}, ${year}`;
    const dateFormattedAr = `${dayNameAr}، ${d} ${monthNameAr} ${year}`;

    days.push({
      dayNumber: d,
      dateStr,
      dateFormattedAr,
      dayOfWeek: dayNameEn,
      isWeekend,
      inTime: '',
      outTime: '',
      overtimeDay: 0,
      overtimeNight: 0,
      overtimeTotal: 0,
      employeeSign: '',
      supervisorSign: '',
      remark: isWeekend ? 'OFF / عطلة' : '',
      status: isWeekend ? 'weekend' : 'present',
    });
  }

  return days;
}

export function calculateSummary(days: TimesheetDay[]): TimesheetSummary {
  let totalPresentDays = 0;
  let totalAbsentDays = 0;
  let totalWeekendDays = 0;
  let totalOvertimeDayHours = 0;
  let totalOvertimeNightHours = 0;
  let totalRegularHours = 0;

  for (const day of days) {
    if (day.status === 'present' || (day.inTime && day.outTime && day.status !== 'absent')) {
      totalPresentDays++;
      totalRegularHours += 8; // standard daily work
    } else if (day.status === 'absent') {
      totalAbsentDays++;
    } else if (day.status === 'weekend' || day.isWeekend) {
      totalWeekendDays++;
    }

    const dayOT = Number(day.overtimeDay) || 0;
    const nightOT = Number(day.overtimeNight) || 0;
    totalOvertimeDayHours += dayOT;
    totalOvertimeNightHours += nightOT;
  }

  return {
    totalPresentDays,
    totalAbsentDays,
    totalWeekendDays,
    totalOvertimeDayHours,
    totalOvertimeNightHours,
    grandTotalOvertimeHours: totalOvertimeDayHours + totalOvertimeNightHours,
    totalRegularHours,
  };
}
