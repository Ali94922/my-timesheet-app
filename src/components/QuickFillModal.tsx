import React, { useState } from 'react';
import { Zap, Check, X, RotateCcw } from 'lucide-react';

interface QuickFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFill: (params: {
    defaultInTime: string;
    defaultOutTime: string;
    defaultOvertimeDay: number;
    defaultEmployeeSign: string;
    defaultSupervisorSign: string;
    skipWeekends: boolean;
    clearRemarks: boolean;
  }) => void;
  onClearAll: () => void;
}

export const QuickFillModal: React.FC<QuickFillModalProps> = ({
  isOpen,
  onClose,
  onApplyFill,
  onClearAll,
}) => {
  const [inTime, setInTime] = useState('08:00');
  const [outTime, setOutTime] = useState('17:00');
  const [overtimeDay, setOvertimeDay] = useState(0);
  const [employeeSign, setEmployeeSign] = useState('✓');
  const [supervisorSign, setSupervisorSign] = useState('✓');
  const [skipWeekends, setSkipWeekends] = useState(true);
  const [clearRemarks, setClearRemarks] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFill({
      defaultInTime: inTime,
      defaultOutTime: outTime,
      defaultOvertimeDay: Number(overtimeDay) || 0,
      defaultEmployeeSign: employeeSign,
      defaultSupervisorSign: supervisorSign,
      skipWeekends,
      clearRemarks,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 no-print" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">الملء التلقائي السريع للتايم شيت</h2>
              <p className="text-xs text-slate-300">تعبئة مواعيد الحضور والانصراف بضغطة زر</p>
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
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                وقت الدخول الافتراضي (IN)
              </label>
              <input
                type="text"
                value={inTime}
                onChange={(e) => setInTime(e.target.value)}
                placeholder="08:00"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                وقت الانصراف الافتراضي (OUT)
              </label>
              <input
                type="text"
                value={outTime}
                onChange={(e) => setOutTime(e.target.value)}
                placeholder="17:00"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-center font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ساعات إضافي افتراضية يومية (اختياري)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={overtimeDay}
              onChange={(e) => setOvertimeDay(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-center font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                توقيع الموظف
              </label>
              <input
                type="text"
                value={employeeSign}
                onChange={(e) => setEmployeeSign(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                توقيع المشرف
              </label>
              <input
                type="text"
                value={supervisorSign}
                onChange={(e) => setSupervisorSign(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-center"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="skip-weekends"
                checked={skipWeekends}
                onChange={(e) => setSkipWeekends(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded cursor-pointer"
              />
              <label htmlFor="skip-weekends" className="text-xs text-slate-700 cursor-pointer">
                تخطي أيام العطلات الأسبوعية وتركها كـ OFF
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('هل أنت متأكد من تفريغ كافة خانات الساعات بالتايم شيت؟')) {
                  onClearAll();
                  onClose();
                }
              }}
              className="w-full py-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              تفريغ كافة الخانات والبدء من الصفر
            </button>
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
            className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            تطبيق التعبئة
          </button>
        </div>
      </div>
    </div>
  );
};
