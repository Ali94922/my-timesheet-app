import React, { useState } from 'react';
import { TimesheetConfig, TimesheetDay, TimesheetSummary } from '../types';
import { formatWhatsAppMessage, generateWhatsAppUrl } from '../utils/whatsappUtils';
import { MessageSquare, Send, Copy, Download, Check, X, Smartphone, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TimesheetConfig;
  days: TimesheetDay[];
  summary: TimesheetSummary;
  printableElementId?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  config,
  days,
  summary,
  printableElementId = 'timesheet-printable-area',
}) => {
  const [phone, setPhone] = useState('');
  const [includeBreakdown, setIncludeBreakdown] = useState(false);
  const [customNotes, setCustomNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  if (!isOpen) return null;

  const baseMessage = formatWhatsAppMessage(config, days, summary, includeBreakdown);
  const fullMessage = customNotes
    ? `${baseMessage}\n\n💬 *ملاحظة إضافية:* ${customNotes}`
    : baseMessage;

  const handleSendToWhatsApp = () => {
    const url = generateWhatsAppUrl(phone, fullMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = fullMessage;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById(printableElementId);
    if (!element) return;

    try {
      setIsExportingImage(true);
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution for crisp text
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const filename = `Timesheet_${config.company.nameEn || 'Company'}_${config.employee.name || 'Staff'}_${config.month}_${config.year}.png`;
      link.download = filename;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 rounded-xl">
              <MessageSquare className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">إرسال التايم شيت عبر واتساب</h2>
              <p className="text-xs text-emerald-100">إرسال تقرير نصي منسق ومفصل مع إمكانية إرفاق صورة الشيت</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-right">
          {/* Phone input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              رقم واتساب المستلم (اختياري مع كود الدولة):
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 201012345678 أو 9665xxxxxxxx (أو اتركه فارغاً للاختيار من جهات اتصالك)"
                dir="ltr"
                className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
              />
              <Smartphone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              💡 إذا تركته فارغاً سيتم فتح واتساب لتختار المحادثة التي تريد إرساله إليها مباشرة.
            </p>
          </div>

          {/* Additional note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              إضافة ملاحظة أو رسالة مرفقة (اختياري):
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="مثال: برجاء الاعتماد وصرف الساعات الإضافية"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
            />
          </div>

          {/* Toggle breakdown */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="toggle-breakdown"
                checked={includeBreakdown}
                onChange={(e) => setIncludeBreakdown(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="toggle-breakdown" className="text-xs font-semibold text-slate-800 cursor-pointer">
                تضمين جدول الأيام يوماً بيوم بالتفصيل في الرسالة
              </label>
            </div>
            <span className="text-[11px] text-slate-500">
              {includeBreakdown ? 'مفصل' : 'ملخص فقط'}
            </span>
          </div>

          {/* Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                معاينة نص رسالة واتساب:
              </label>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تم النسخ بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ النص</span>
                  </>
                )}
              </button>
            </div>
            <div
              className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 text-xs text-slate-800 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto select-all leading-relaxed shadow-inner"
              dir="rtl"
            >
              {fullMessage}
            </div>
          </div>

          {/* Image download hint for WhatsApp */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>نصيحة:</strong> يمكنك أيضاً تحميل التايم شيت كصورة عالية الدقة وإرفاقها في محادثة الواتساب!
              </span>
            </div>
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExportingImage}
              className="px-3 py-1.5 text-xs font-bold bg-white text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-100 flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              {isExportingImage ? 'جاري التجهيز...' : 'تحميل صورة التايم شيت'}
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            إغلاق
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'تم النسخ' : 'نسخ الرسالة'}
            </button>

            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="px-5 py-2 text-xs md:text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>إرسال عبر واتساب الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
