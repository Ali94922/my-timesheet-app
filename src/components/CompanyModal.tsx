import React, { useState } from 'react';
import { CompanyInfo } from '../types';
import { Building2, Check, X } from 'lucide-react';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyInfo;
  onSave: (updated: CompanyInfo) => void;
}

const PRESETS = [
  {
    nameAr: 'شركة يواندا',
    nameEn: 'Yuanda',
    nameZh: '远大考勤表',
    showChinese: true,
  },
  {
    nameAr: 'المقاولون العرب (عثمان أحمد عثمان)',
    nameEn: 'The Arab Contractors',
    nameZh: '',
    showChinese: false,
  },
  {
    nameAr: 'أوراسكوم للإنشاءات',
    nameEn: 'Orascom Construction',
    nameZh: '',
    showChinese: false,
  },
  {
    nameAr: 'بتروجيت (المشروعات البترولية)',
    nameEn: 'Petrojet',
    nameZh: '',
    showChinese: false,
  },
  {
    nameAr: 'مجموعة طلعت مصطفى',
    nameEn: 'TMG Holding',
    nameZh: '',
    showChinese: false,
  },
  {
    nameAr: 'شركة المراسم الدولية للتطوير',
    nameEn: 'Al Marasem Development',
    nameZh: '',
    showChinese: false,
  },
];

export const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  company,
  onSave,
}) => {
  const [nameAr, setNameAr] = useState(company.nameAr);
  const [nameEn, setNameEn] = useState(company.nameEn);
  const [nameZh, setNameZh] = useState(company.nameZh || '');
  const [showChinese, setShowChinese] = useState(company.showChinese);

  if (!isOpen) return null;

  const handleApply = () => {
    onSave({
      nameAr,
      nameEn,
      nameZh,
      showChinese,
    });
    onClose();
  };

  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setNameAr(preset.nameAr);
    setNameEn(preset.nameEn);
    setNameZh(preset.nameZh);
    setShowChinese(preset.showChinese);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 no-print" dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">تغيير اسم وبيانات الشركة</h2>
              <p className="text-xs text-slate-300">يتم تحديث الترويسة والعنوان تلقائياً في التايم شيت</p>
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
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              نماذج جاهزة سريعة:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.nameEn}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`text-xs px-2.5 py-1.5 rounded-md border transition-all ${
                    nameEn === p.nameEn
                      ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p.nameAr.split(' ')[0]} ({p.nameEn})
                </button>
              ))}
            </div>
          </div>

          {/* Arabic Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              اسم الشركة بالعربية <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: شركة يواندا أو أي اسم آخر"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
            />
            <p className="text-[11px] text-slate-500 mt-1">يظهر في السطر العربي: "جدول زمني لـ {nameAr || '...'}"</p>
          </div>

          {/* English Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              اسم الشركة بالإنجليزية <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Yuanda, Orascom, Petrojet"
              dir="ltr"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
            />
            <p className="text-[11px] text-slate-500 mt-1" dir="ltr">Appears at top: "{nameEn || '...'} Time Sheet"</p>
          </div>

          {/* Chinese Name Option */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">
                إظهار النص الصيني (كما في ورقة يواندا الأصلية)
              </label>
              <input
                type="checkbox"
                id="toggle-chinese"
                checked={showChinese}
                onChange={(e) => setShowChinese(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {showChinese && (
              <div>
                <input
                  type="text"
                  value={nameZh}
                  onChange={(e) => setNameZh(e.target.value)}
                  placeholder="远大考勤表"
                  dir="ltr"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            )}
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
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            حفظ وتطبيق
          </button>
        </div>
      </div>
    </div>
  );
};
