import { useState, useEffect, useMemo } from 'react';
import {
  TimesheetConfig,
  TimesheetDay,
  CompanyInfo,
} from './types';
import {
  generateDaysForMonth,
  calculateSummary,
  getDaysInMonth,
} from './utils/dateUtils';
import { HeaderBar } from './components/HeaderBar';
import { TimesheetDocument } from './components/TimesheetDocument';
import { CompanyModal } from './components/CompanyModal';
import { MonthYearModal } from './components/MonthYearModal';
import { QuickFillModal } from './components/QuickFillModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import html2canvas from 'html2canvas';

const STORAGE_CONFIG_KEY = 'timesheet_maker_config_v1';
const STORAGE_DAYS_KEY = 'timesheet_maker_days_v2';

const DEFAULT_CONFIG: TimesheetConfig = {
  year: 2026,
  month: 9, // September 2026 as in the attached PDF
  company: {
    nameAr: 'شركة يواندا',
    nameEn: 'Yuanda',
    nameZh: '远大考勤表',
    showChinese: true,
  },
  employee: {
    name: 'محمد أحمد محمود',
    department: 'قسم التركيبات والواجهات',
    position: 'مهندس موقع',
    employeeId: 'YD-2026',
  },
  supervisorName: 'م. أشرف خليل',
  managerName: 'م. وانغ ليو',
  standardWorkHours: 8,
  defaultInTime: '',
  defaultOutTime: '',
  weekendDays: [5], // Friday
};

export default function App() {
  // Load initial config
  const [config, setConfig] = useState<TimesheetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load saved config', e);
    }
    return DEFAULT_CONFIG;
  });

  // Load initial days
  const [days, setDays] = useState<TimesheetDay[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DAYS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved days', e);
    }
    return generateDaysForMonth(DEFAULT_CONFIG.year, DEFAULT_CONFIG.month, DEFAULT_CONFIG.weekendDays);
  });

  // Modals state
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [isQuickFillModalOpen, setIsQuickFillModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save config', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DAYS_KEY, JSON.stringify(days));
    } catch (e) {
      console.error('Failed to save days', e);
    }
  }, [days]);

  // Recalculate summary whenever days change
  const summary = useMemo(() => calculateSummary(days), [days]);

  // Handler to update config
  const handleUpdateConfig = (updated: Partial<TimesheetConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Handler to update a single day
  const handleUpdateDay = (index: number, updated: Partial<TimesheetDay>) => {
    setDays((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...updated };
      }
      return copy;
    });
  };

  // Handler for changing month & year
  const handleApplyMonthYear = (
    year: number,
    month: number,
    weekendDays: number[],
    preserveExisting: boolean
  ) => {
    const newDays = generateDaysForMonth(year, month, weekendDays);

    if (preserveExisting) {
      // Preserve inputs for matching day numbers
      const mergedDays = newDays.map((newDay) => {
        const oldDay = days.find((d) => d.dayNumber === newDay.dayNumber);
        if (oldDay) {
          return {
            ...newDay,
            inTime: oldDay.inTime || newDay.inTime,
            outTime: oldDay.outTime || newDay.outTime,
            overtimeDay: oldDay.overtimeDay,
            overtimeNight: oldDay.overtimeNight,
            employeeSign: oldDay.employeeSign,
            supervisorSign: oldDay.supervisorSign,
            remark: oldDay.remark,
          };
        }
        return newDay;
      });
      setDays(mergedDays);
    } else {
      setDays(newDays);
    }

    setConfig((prev) => ({
      ...prev,
      year,
      month,
      weekendDays,
    }));
  };

  // Handler for Quick Fill
  const handleApplyQuickFill = ({
    defaultInTime,
    defaultOutTime,
    defaultOvertimeDay,
    defaultEmployeeSign,
    defaultSupervisorSign,
    skipWeekends,
    clearRemarks,
  }: {
    defaultInTime: string;
    defaultOutTime: string;
    defaultOvertimeDay: number;
    defaultEmployeeSign: string;
    defaultSupervisorSign: string;
    skipWeekends: boolean;
    clearRemarks: boolean;
  }) => {
    setDays((prev) =>
      prev.map((day) => {
        if (skipWeekends && day.isWeekend) {
          return {
            ...day,
            inTime: '',
            outTime: '',
            overtimeDay: 0,
            overtimeNight: 0,
            employeeSign: '',
            supervisorSign: '',
            remark: 'عطلة أسبوعية / OFF',
            status: 'weekend',
          };
        }
        return {
          ...day,
          inTime: defaultInTime,
          outTime: defaultOutTime,
          overtimeDay: defaultOvertimeDay,
          employeeSign: defaultEmployeeSign,
          supervisorSign: defaultSupervisorSign,
          remark: clearRemarks ? '' : day.remark,
          status: 'present',
        };
      })
    );
  };

  // Clear all days
  const handleClearAll = () => {
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        inTime: '',
        outTime: '',
        overtimeDay: 0,
        overtimeNight: 0,
        employeeSign: '',
        supervisorSign: '',
        remark: day.isWeekend ? 'عطلة أسبوعية / OFF' : '',
        status: day.isWeekend ? 'weekend' : 'present',
      }))
    );
  };

  // Clear IN and OUT times specifically
  const handleClearInOut = () => {
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        inTime: '',
        outTime: '',
      }))
    );
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Export Image
  const handleExportImage = async () => {
    const element = document.getElementById('timesheet-printable-area');
    if (!element) return;

    try {
      setIsExportingImage(true);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Timesheet_${config.company.nameEn || 'Company'}_${config.year}_${config.month}.png`;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error('Error exporting image:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200/70 text-slate-900 pb-16">
      {/* Top Header Navigation */}
      <HeaderBar
        config={config}
        summary={summary}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
        onOpenMonthModal={() => setIsMonthModalOpen(true)}
        onOpenQuickFillModal={() => setIsQuickFillModalOpen(true)}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
        onClearInOut={handleClearInOut}
        onPrint={handlePrint}
        onExportImage={handleExportImage}
        isExportingImage={isExportingImage}
      />

      {/* Main Document Container */}
      <main className="max-w-5xl mx-auto px-2 sm:px-4 pt-6">
        {/* Banner with quick guides */}
        <div className="mb-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-4 shadow-sm no-print border border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-3" dir="rtl">
          <div className="space-y-1 text-right">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
              جاهز للطباعة والمشاركة عبر واتساب
            </h2>
            <p className="text-xs text-slate-300">
              خانات الدخول (IN) والانصراف (OUT) فارغة تماماً وجاهزة لتدوين المواعيد. يمكنك الكتابة مباشرة في أي خانة.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleClearInOut}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg border border-amber-500/40 transition-colors flex items-center gap-1"
              title="تفريغ خانات الدخول والخروج في ثانية"
            >
              🧹 تفريغ IN و OUT
            </button>
            <button
              onClick={() => setIsCompanyModalOpen(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition-colors"
            >
              🏢 تعديل الشركة
            </button>
            <button
              onClick={() => setIsMonthModalOpen(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition-colors"
            >
              📅 تعديل الشهر
            </button>
            <button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              💬 إرسال واتس
            </button>
          </div>
        </div>

        {/* The Authentic Timesheet Sheet */}
        <TimesheetDocument
          config={config}
          days={days}
          summary={summary}
          onUpdateDay={handleUpdateDay}
          onUpdateConfig={handleUpdateConfig}
        />
      </main>

      {/* Modals */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        company={config.company}
        onSave={(updatedCompany: CompanyInfo) =>
          handleUpdateConfig({ company: updatedCompany })
        }
      />

      <MonthYearModal
        isOpen={isMonthModalOpen}
        onClose={() => setIsMonthModalOpen(false)}
        currentYear={config.year}
        currentMonth={config.month}
        weekendDays={config.weekendDays}
        onApply={handleApplyMonthYear}
      />

      <QuickFillModal
        isOpen={isQuickFillModalOpen}
        onClose={() => setIsQuickFillModalOpen(false)}
        onApplyFill={handleApplyQuickFill}
        onClearAll={handleClearAll}
      />

      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        config={config}
        days={days}
        summary={summary}
        printableElementId="timesheet-printable-area"
      />
    </div>
  );
}
