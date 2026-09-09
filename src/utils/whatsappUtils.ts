import { TimesheetConfig, TimesheetDay, TimesheetSummary } from '../types';
import { MONTHS_AR, MONTHS_EN } from './dateUtils';

export function formatWhatsAppMessage(
  config: TimesheetConfig,
  days: TimesheetDay[],
  summary: TimesheetSummary,
  includeDailyBreakdown: boolean = false
): string {
  const monthNameAr = MONTHS_AR[config.month - 1];
  const monthNameEn = MONTHS_EN[config.month - 1];

  let msg = `📋 *كشف التايم شيت والحضور (Time Sheet)*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🏢 *الشركة:* ${config.company.nameAr} (${config.company.nameEn})\n`;
  msg += `📅 *الشهر والمدة:* ${monthNameAr} ${config.year} (${monthNameEn} ${config.year})\n`;
  msg += `👤 *اسم الموظف:* ${config.employee.name}\n`;
  if (config.employee.employeeId) {
    msg += `🆔 *الكود الوظيفي:* ${config.employee.employeeId}\n`;
  }
  if (config.employee.position) {
    msg += `💼 *الوظيفة:* ${config.employee.position}\n`;
  }
  if (config.employee.department) {
    msg += `🏛️ *القسم:* ${config.employee.department}\n`;
  }
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📊 *ملخص ساعات العمل والحضور:*\n`;
  msg += `✅ *أيام الحضور:* ${summary.totalPresentDays} يوم\n`;
  if (summary.totalAbsentDays > 0) {
    msg += `❌ *أيام الغياب:* ${summary.totalAbsentDays} يوم\n`;
  }
  msg += `🏖️ *أيام العطلات:* ${summary.totalWeekendDays} يوم\n`;
  msg += `☀️ *إضافي نهاري (Day Overtime):* ${summary.totalOvertimeDayHours} ساعة\n`;
  msg += `🌙 *إضافي ليلي (Night Overtime):* ${summary.totalOvertimeNightHours} ساعة\n`;
  msg += `⭐ *إجمالي الإضافي الكلي:* ${summary.grandTotalOvertimeHours} ساعة\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;

  if (includeDailyBreakdown) {
    msg += `📝 *تفاصيل الأيام والساعات:*\n`;
    days.forEach((day) => {
      const ot = (Number(day.overtimeDay) || 0) + (Number(day.overtimeNight) || 0);
      const otText = ot > 0 ? ` [إضافي: ${ot} س]` : '';
      const remarkText = day.remark ? ` (${day.remark})` : '';
      
      if (day.status === 'weekend') {
        msg += `▫️ يوم ${day.dayNumber}: عطلة أسبوعية${remarkText}\n`;
      } else if (day.status === 'absent') {
        msg += `▫️ يوم ${day.dayNumber}: غياب${remarkText}\n`;
      } else {
        msg += `▫️ يوم ${day.dayNumber}: دخول ${day.inTime || '-'} / خروج ${day.outTime || '-'}${otText}${remarkText}\n`;
      }
    });
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  }

  msg += `✍️ *توقيع المشرف:* ${config.supervisorName || 'تم التدقيق والتوقيع'}\n`;
  msg += `تم الإنشاء عبر برنامج التايم شيت ⏱️`;

  return msg;
}

export function generateWhatsAppUrl(phone: string, text: string): string {
  // Clean phone number: remove spaces, pluses, dashes
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);

  if (cleanPhone) {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

export async function shareFileOrImage(file: File, title: string, text: string): Promise<boolean> {
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title,
        text,
      });
      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing file:', err);
      }
      return false;
    }
  }
  return false;
}
