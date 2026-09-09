import React, { useState } from 'react';
import { Calendar, Check, X, Info } from 'lucide-react';
import { MONTHS_AR, MONTHS_EN, getDaysInMonth } from '../utils/dateUtils';

interface MonthYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  currentMonth: number;
  weekendDays: number[];
  onApply: (year: number, month: number, weekendDays: number[], preserveExisting: boolean) => void;
}

export const MonthYearModal: React.FC<MonthYearModalProps> = ({
  isOpen,
  onClose,
  currentYear,
  currentMonth,
  weekendDays,
  onApply,
}) => {
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [selectedWeekends, setSelectedWeekends] = useState<number[]>(weekendDays);
  const [preserveExisting, setPreserveExisting] = useState<boolean>(true);

  if (!isOpen) return null;

  const daysCount = getDaysInMonth(year, month);
  const yearsList = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  const handleApply = () => {
    onApply(year, month, selectedWeekends, preserveExisting);
    onClose();
  };

  const toggleWeekendDay = (dayIdx: number) => {
    if (selectedWeekends.includes(dayIdx)) {
      setSelectedWeekends(selectedWeekends.filter((d) => d !== dayIdx));
    } else {
      setSelectedWeekends([...selectedWeekends, dayIdx]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 no-print" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">تغيير الشهر والسنة</h2>
              <p className="text-xs text-slate-300">يتم توليد الأيام وتواريخها وأيام الأسبوع تلقائياً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Year and Month Pickers */}
          <div className="grid grid-cols-2 gap-4">
            {/* Month */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                الشهر
              </label>
              <select
                id="select-month"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-semibold"
              >
                {MONTHS_AR.map((mAr, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} - {mAr} ({MONTHS_EN[i]})
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                السنة
              </label>
              <select
                id="select-year"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-semibold"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Month preview note */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2 text-xs text-emerald-900">
            <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              شهر <strong>{MONTHS_AR[month - 1]} {year}</strong> يحتوي على{' '}
              <strong>{daysCount} يوماً</strong>. تبدأ الصفوف تلقائياً من يوم 1 حتى يوم {daysCount} مع
              اسم اليوم والتاريخ بالميلادي بالإنجليزية (مثل Tuesday, September 1, 2026).
            </div>
          </div>

          {/* Weekend Configuration */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              أيام العطلة الأسبوعية (تُميز تلقائياً كـ OFF):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => toggleWeekendDay(5)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedWeekends.includes(5)
                    ? 'bg-amber-50 border-amber-400 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span>الجمعة (Friday)</span>
                {selectedWeekends.includes(5) && <Check className="w-4 h-4 text-amber-700" />}
              </button>

              <button
                type="button"
                onClick={() => toggleWeekendDay(6)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedWeekends.includes(6)
                    ? 'bg-amber-50 border-amber-400 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span>السبت (Saturday)</span>
                {selectedWeekends.includes(6) && <Check className="w-4 h-4 text-amber-700" />}
              </button>
            </div>
          </div>

          {/* Preservation option */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <input
              type="checkbox"
              id="preserve-data"
              checked={preserveExisting}
              onChange={(e) => setPreserveExisting(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="preserve-data" className="text-xs text-slate-700 cursor-pointer">
              الاحتفاظ بالساعات والملاحظات للأيام المتطابقة عند التغيير (تفريغ الأيام الجديدة فقط)
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            تطبيق الشهر الجديد
          </button>
        </div>
      </div>
    </div>
  );
};
