import React from 'react';
import { TimesheetConfig, TimesheetDay, TimesheetSummary } from '../types';

interface TimesheetDocumentProps {
  config: TimesheetConfig;
  days: TimesheetDay[];
  summary: TimesheetSummary;
  onUpdateDay: (index: number, updated: Partial<TimesheetDay>) => void;
  onUpdateConfig: (updated: Partial<TimesheetConfig>) => void;
  isEditingDirectly?: boolean;
}

export const TimesheetDocument: React.FC<TimesheetDocumentProps> = ({
  config,
  days,
  summary,
  onUpdateDay,
  onUpdateConfig,
  isEditingDirectly = true,
}) => {
  return (
    <div
      id="timesheet-printable-area"
      className="print-sheet bg-white text-black mx-auto shadow-xl border border-slate-300 rounded-sm p-4 md:p-8 max-w-[850px] w-full text-center transition-all"
      style={{ minHeight: '1100px', fontFamily: '"Inter", "Cairo", sans-serif' }}
      dir="ltr"
    >
      {/* Document Header */}
      <div className="mb-4">
        <h1
          id="company-name-en-title"
          className="text-xl md:text-2xl font-bold tracking-wide uppercase text-slate-900 focus:outline-none focus:bg-amber-50 px-2 py-0.5 rounded cursor-pointer transition-colors"
          title="انقر لتعديل اسم الشركة بالإنجليزية"
          contentEditable={isEditingDirectly}
          suppressContentEditableWarning
          onBlur={(e) => {
            const val = e.currentTarget.textContent || '';
            onUpdateConfig({
              company: { ...config.company, nameEn: val },
            });
          }}
        >
          {config.company.nameEn} Time Sheet
        </h1>

        {config.company.showChinese && (
          <h2
            id="company-name-zh-title"
            className="text-base md:text-lg font-semibold text-slate-800 tracking-wider focus:outline-none focus:bg-amber-50 px-2 py-0.5 rounded cursor-pointer"
            title="انقر لتعديل الاسم بالصينية"
            contentEditable={isEditingDirectly}
            suppressContentEditableWarning
            onBlur={(e) => {
              const val = e.currentTarget.textContent || '';
              onUpdateConfig({
                company: { ...config.company, nameZh: val },
              });
            }}
          >
            {config.company.nameZh || '远大考勤表'}
          </h2>
        )}

        <h3
          id="company-name-ar-title"
          className="text-base md:text-lg font-bold text-slate-900 focus:outline-none focus:bg-amber-50 px-2 py-0.5 rounded cursor-pointer"
          title="انقر لتعديل اسم الشركة بالعربية"
          dir="rtl"
          contentEditable={isEditingDirectly}
          suppressContentEditableWarning
          onBlur={(e) => {
            const val = e.currentTarget.textContent || '';
            onUpdateConfig({
              company: { ...config.company, nameAr: val },
            });
          }}
        >
          {config.company.nameAr ? `جدول زمني لـ ${config.company.nameAr}` : 'جدول زمني للحضور والانصراف'}
        </h3>
      </div>

      {/* Employee & Dept Info Header Box (4 cells matching original) */}
      <div className="border-2 border-black mb-0 text-xs md:text-sm">
        <div className="grid grid-cols-2 divide-x-2 divide-black border-b-2 border-black">
          {/* Department */}
          <div className="p-2 flex flex-col justify-between text-left">
            <div className="flex items-baseline justify-between text-slate-700 text-[11px] md:text-xs font-semibold">
              <span>Department</span>
              {config.company.showChinese && <span>部门</span>}
              <span dir="rtl">القسم</span>
            </div>
            <input
              id="input-department"
              type="text"
              value={config.employee.department}
              onChange={(e) =>
                onUpdateConfig({
                  employee: { ...config.employee, department: e.target.value },
                })
              }
              placeholder="مثال: الواجهات / Facades"
              className="w-full mt-1 font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-xs md:text-sm"
            />
          </div>

          {/* Name */}
          <div className="p-2 flex flex-col justify-between text-left">
            <div className="flex items-baseline justify-between text-slate-700 text-[11px] md:text-xs font-semibold">
              <span>Name</span>
              {config.company.showChinese && <span>姓名</span>}
              <span dir="rtl">الاسم</span>
            </div>
            <input
              id="input-employee-name"
              type="text"
              value={config.employee.name}
              onChange={(e) =>
                onUpdateConfig({
                  employee: { ...config.employee, name: e.target.value },
                })
              }
              placeholder="اسم الموظف"
              className="w-full mt-1 font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-xs md:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x-2 divide-black">
          {/* Position */}
          <div className="p-2 flex flex-col justify-between text-left">
            <div className="flex items-baseline justify-between text-slate-700 text-[11px] md:text-xs font-semibold">
              <span>Position</span>
              {config.company.showChinese && <span>工种</span>}
              <span dir="rtl">الوظيفة</span>
            </div>
            <input
              id="input-position"
              type="text"
              value={config.employee.position}
              onChange={(e) =>
                onUpdateConfig({
                  employee: { ...config.employee, position: e.target.value },
                })
              }
              placeholder="مثال: مهندس موقع / Site Engineer"
              className="w-full mt-1 font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-xs md:text-sm"
            />
          </div>

          {/* Employee ID */}
          <div className="p-2 flex flex-col justify-between text-left">
            <div className="flex items-baseline justify-between text-slate-700 text-[11px] md:text-xs font-semibold">
              <span>Employee ID</span>
              {config.company.showChinese && <span>工号</span>}
              <span dir="rtl">الكود الوظيفى</span>
            </div>
            <input
              id="input-employee-id"
              type="text"
              value={config.employee.employeeId}
              onChange={(e) =>
                onUpdateConfig({
                  employee: { ...config.employee, employeeId: e.target.value },
                })
              }
              placeholder="مثال: YD-1048"
              className="w-full mt-1 font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-xs md:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-black border-t-0 text-center border-collapse text-[10px] sm:text-xs">
          <thead>
            <tr className="border-b-2 border-black bg-slate-50 font-bold text-slate-900">
              {/* Date */}
              <th className="border-r-2 border-black p-1.5 w-[25%] text-center align-middle">
                <div>Date</div>
                {config.company.showChinese && <div className="text-[10px]">日期</div>}
                <div dir="rtl">التاريخ</div>
              </th>

              {/* IN */}
              <th className="border-r-2 border-black p-1.5 w-[11%] text-center align-middle">
                <div dir="rtl">دخول</div>
                {config.company.showChinese && <div className="text-[10px]">在场</div>}
                <div>IN</div>
              </th>

              {/* OUT */}
              <th className="border-r-2 border-black p-1.5 w-[11%] text-center align-middle">
                <div dir="rtl">انصراف</div>
                {config.company.showChinese && <div className="text-[10px]">离开</div>}
                <div>OUT</div>
              </th>

              {/* OVER TIME */}
              <th className="border-r-2 border-black p-1.5 w-[13%] text-center align-middle">
                {config.company.showChinese && <div className="text-[10px]">加时赛</div>}
                <div dir="rtl" className="text-[10px] leading-tight">الوقت الإضافي</div>
                <div>OVER Time</div>
              </th>

              {/* Employee Sign */}
              <th className="border-r-2 border-black p-1.5 w-[13%] text-center align-middle">
                <div>Employee Sign</div>
                {config.company.showChinese && <div className="text-[10px]">签字</div>}
                <div dir="rtl">توقيع الموظف</div>
              </th>

              {/* Supervisor Sign */}
              <th className="border-r-2 border-black p-1.5 w-[14%] text-center align-middle">
                <div>Supervisor/Chief Sign</div>
                {config.company.showChinese && <div className="text-[10px]">负责人签字</div>}
                <div dir="rtl">توقيع المشرف</div>
              </th>

              {/* Remark */}
              <th className="p-1.5 w-[13%] text-center align-middle">
                <div>Remark</div>
                {config.company.showChinese && <div className="text-[10px]">备注</div>}
                <div dir="rtl">الملاحظات</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, idx) => {
              const isWeekendRow = day.isWeekend || day.status === 'weekend';
              return (
                <tr
                  key={day.dayNumber}
                  className={`border-b border-black ${
                    isWeekendRow
                      ? 'bg-amber-50/40 print:bg-slate-50'
                      : day.status === 'absent'
                      ? 'bg-rose-50/40'
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Date Column */}
                  <td className="border-r-2 border-black px-1.5 py-1 text-left font-medium whitespace-nowrap text-slate-900">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{day.dateStr}</span>
                      {isWeekendRow && (
                        <span className="text-[9px] bg-slate-200 text-slate-700 px-1 rounded no-print">
                          عطلة
                        </span>
                      )}
                    </div>
                  </td>

                  {/* IN Time */}
                  <td className="border-r-2 border-black p-0">
                    <input
                      type="text"
                      value={day.inTime}
                      onChange={(e) => onUpdateDay(idx, { inTime: e.target.value })}
                      className="w-full text-center py-1 bg-transparent focus:bg-blue-50 focus:outline-none font-medium"
                      placeholder="--"
                    />
                  </td>

                  {/* OUT Time */}
                  <td className="border-r-2 border-black p-0">
                    <input
                      type="text"
                      value={day.outTime}
                      onChange={(e) => onUpdateDay(idx, { outTime: e.target.value })}
                      className="w-full text-center py-1 bg-transparent focus:bg-blue-50 focus:outline-none font-medium"
                      placeholder="--"
                    />
                  </td>

                  {/* OVER Time */}
                  <td className="border-r-2 border-black p-0">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={day.overtimeDay + day.overtimeNight || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        onUpdateDay(idx, {
                          overtimeDay: val,
                          overtimeTotal: val,
                        });
                      }}
                      className="w-full text-center py-1 bg-transparent focus:bg-blue-50 focus:outline-none font-semibold text-blue-900"
                      placeholder=""
                    />
                  </td>

                  {/* Employee Sign */}
                  <td className="border-r-2 border-black p-0">
                    <input
                      type="text"
                      value={day.employeeSign}
                      onChange={(e) => onUpdateDay(idx, { employeeSign: e.target.value })}
                      className="w-full text-center py-1 bg-transparent focus:bg-blue-50 focus:outline-none"
                      placeholder=""
                    />
                  </td>

                  {/* Supervisor Sign */}
                  <td className="border-r-2 border-black p-0">
                    <input
                      type="text"
                      value={day.supervisorSign}
                      onChange={(e) => onUpdateDay(idx, { supervisorSign: e.target.value })}
                      className="w-full text-center py-1 bg-transparent focus:bg-blue-50 focus:outline-none"
                      placeholder=""
                    />
                  </td>

                  {/* Remark */}
                  <td className="p-0">
                    <input
                      type="text"
                      value={day.remark}
                      onChange={(e) => onUpdateDay(idx, { remark: e.target.value })}
                      className="w-full text-center py-1 bg-transparent focus:bg-blue-50 focus:outline-none text-slate-700"
                      placeholder=""
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* OVER TIME HOURS Section */}
      <div className="border-2 border-black border-t-0 text-center">
        <div className="font-bold py-1 border-b-2 border-black text-xs md:text-sm tracking-wider uppercase bg-slate-50">
          OVER TIME HOURS
        </div>

        <div className="grid grid-cols-2 divide-x-2 divide-black border-b-2 border-black text-[11px] md:text-xs">
          {/* Daytime Overtime */}
          <div className="p-2 text-center flex flex-col justify-between">
            <div>
              <div className="font-semibold text-slate-800">
                NO of overtime hours during the day
              </div>
              <div dir="rtl" className="text-slate-700 font-medium">
                عدد الساعات الإضافية النهارية
              </div>
              {config.company.showChinese && (
                <div className="text-[10px] text-slate-600">额外日照时数</div>
              )}
            </div>
            <div className="mt-2 text-base md:text-lg font-bold text-slate-900">
              {summary.totalOvertimeDayHours} <span className="text-xs font-normal">ساعة / Hrs</span>
            </div>
          </div>

          {/* Nighttime Overtime */}
          <div className="p-2 text-center flex flex-col justify-between">
            <div>
              <div className="font-semibold text-slate-800">
                NO of overtime hours during the night
              </div>
              <div dir="rtl" className="text-slate-700 font-medium">
                عدد الساعات الإضافية الليلية
              </div>
              {config.company.showChinese && (
                <div className="text-[10px] text-slate-600">夜间加班小时数</div>
              )}
            </div>
            <div className="mt-2 text-base md:text-lg font-bold text-slate-900">
              {summary.totalOvertimeNightHours} <span className="text-xs font-normal">ساعة / Hrs</span>
            </div>
          </div>
        </div>

        {/* Bottom Signatures Box */}
        <div className="grid grid-cols-2 divide-x-2 divide-black text-[11px] md:text-xs">
          {/* Supervisor/Chief Sign */}
          <div className="p-2 min-h-[65px] flex flex-col justify-between text-center">
            <div>
              <div className="font-semibold text-slate-800">Supervisor/Chief Sign</div>
              {config.company.showChinese && (
                <div className="text-[10px] text-slate-600">负责人签字</div>
              )}
              <div dir="rtl" className="text-slate-700 font-medium">توقيع المشرف</div>
            </div>
            <input
              id="input-supervisor-sign-text"
              type="text"
              value={config.supervisorSignText || config.supervisorName || ''}
              onChange={(e) =>
                onUpdateConfig({
                  supervisorSignText: e.target.value,
                  supervisorName: e.target.value,
                })
              }
              placeholder="توقيع / اسم المشرف"
              className="text-center font-bold text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:outline-none mt-2"
            />
          </div>

          {/* Dept Manager Sign */}
          <div className="p-2 min-h-[65px] flex flex-col justify-between text-center">
            <div>
              <div className="font-semibold text-slate-800">Dept Manager Sign</div>
              {config.company.showChinese && (
                <div className="text-[10px] text-slate-600">部门经理</div>
              )}
              <div dir="rtl" className="text-slate-700 font-medium">توقيع مدير القسم</div>
            </div>
            <input
              id="input-manager-sign-text"
              type="text"
              value={config.managerSignText || config.managerName || ''}
              onChange={(e) =>
                onUpdateConfig({
                  managerSignText: e.target.value,
                  managerName: e.target.value,
                })
              }
              placeholder="توقيع / اسم مدير القسم"
              className="text-center font-bold text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:outline-none mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
