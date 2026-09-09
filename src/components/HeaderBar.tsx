import React from 'react';
import {
  Building2,
  Calendar,
  Zap,
  Printer,
  Image as ImageIcon,
  Share2,
  Eraser,
} from 'lucide-react';
import { TimesheetConfig, TimesheetSummary } from '../types';
import { MONTHS_AR } from '../utils/dateUtils';

interface HeaderBarProps {
  config: TimesheetConfig;
  summary: TimesheetSummary;
  onOpenCompanyModal: () => void;
  onOpenMonthModal: () => void;
  onOpenQuickFillModal: () => void;
  onOpenWhatsAppModal: () => void;
  onClearInOut: () => void;
  onPrint: () => void;
  onExportImage: () => void;
  isExportingImage?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  config,
  summary,
  onOpenCompanyModal,
  onOpenMonthModal,
  onOpenQuickFillModal,
  onOpenWhatsAppModal,
  onClearInOut,
  onPrint,
  onExportImage,
  isExportingImage = false,
}) => {
  const monthName = MONTHS_AR[config.month - 1];

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40 no-print border-b border-slate-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Main top row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Logo & Current info */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center shadow-md">
                <span className="text-xl font-black text-white tracking-tighter">TS</span>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <span>برنامج التايم شيت</span>
                  <span className="text-[11px] bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
                    Time Sheet
                  </span>
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                  <span className="font-semibold text-white">{config.company.nameAr || config.company.nameEn}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-300 font-medium">
                    {monthName} {config.year}
                  </span>
                  {config.employee.name && (
                    <>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300">{config.employee.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile primary WhatsApp button */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={onOpenWhatsAppModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>واتساب</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 w-full lg:w-auto">
            {/* Change Company button */}
            <button
              id="btn-change-company"
              type="button"
              onClick={onOpenCompanyModal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
              title="تغيير اسم الشركة بالعربية والإنجليزية"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>تغيير الشركة</span>
            </button>

            {/* Change Month button */}
            <button
              id="btn-change-month"
              type="button"
              onClick={onOpenMonthModal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
              title="تغيير الشهر والسنة وتوليد الأيام"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>تغيير الشهر ({monthName})</span>
            </button>

            {/* Quick Fill button */}
            <button
              id="btn-quick-fill"
              type="button"
              onClick={onOpenQuickFillModal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
              title="ملء تلقائي لساعات العمل العادية"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>ملء سريع</span>
            </button>

            {/* Clear IN/OUT button */}
            <button
              id="btn-clear-in-out"
              type="button"
              onClick={onClearInOut}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
              title="تفريغ خانات الدخول والخروج (IN و OUT)"
            >
              <Eraser className="w-4 h-4 text-amber-400" />
              <span>تفريغ IN / OUT</span>
            </button>

            {/* Print / PDF button */}
            <button
              id="btn-print"
              type="button"
              onClick={onPrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
              title="طباعة أو حفظ التايم شيت كملف PDF"
            >
              <Printer className="w-4 h-4 text-purple-400" />
              <span>طباعة / PDF</span>
            </button>

            {/* Export Image button */}
            <button
              id="btn-export-image"
              type="button"
              onClick={onExportImage}
              disabled={isExportingImage}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
              title="تنزيل التايم شيت كصورة لإرسالها في الشات"
            >
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>{isExportingImage ? 'جاري التحميل...' : 'حفظ كصورة'}</span>
            </button>

            {/* Primary WhatsApp button */}
            <button
              id="btn-whatsapp"
              type="button"
              onClick={onOpenWhatsAppModal}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95 ring-2 ring-emerald-400/30"
              title="إرسال التايم شيت إلى واتساب"
            >
              <Share2 className="w-4 h-4" />
              <span>إرسال واتساب</span>
            </button>
          </div>
        </div>

        {/* Quick summary stats pills row */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              أيام الحضور:{' '}
              <strong className="text-white font-mono">{summary.totalPresentDays}</strong> يوم
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              إضافي نهاري:{' '}
              <strong className="text-amber-300 font-mono">{summary.totalOvertimeDayHours}</strong> س
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              إضافي ليلي:{' '}
              <strong className="text-blue-300 font-mono">{summary.totalOvertimeNightHours}</strong> س
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              إجمالي الإضافي:{' '}
              <strong className="text-purple-300 font-mono">{summary.grandTotalOvertimeHours}</strong> س
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            💡 يمكنك النقر المباشر على أي خانة في التايم شيت لتعديلها
          </div>
        </div>
      </div>
    </header>
  );
};
