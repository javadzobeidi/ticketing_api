import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import { 
  Download, Search, AlertTriangle, CheckCircle, Activity 
} from 'lucide-react';

// ایمپورت کامپوننت‌های UI (آدرس‌ها را بر اساس پروژه خودتان تنظیم کنید)
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { ComboboxField, PersianDatePicker } from '@/src/components/ui';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

import { apiServices } from '@/src/apis';

// تایپ داده‌های خروجی API
export type DepartmentPerformanceDto = {
  departmentId: number;
  departmentName: string;
  totalTickets: number;
  unassignedTickets: number;
  activeTickets: number;
  closedTickets: number;
};

// تایپ فیلترهای فرم
type FilterForm = {
  startDate: string;
  endDate: string;
  cityId: number | null;
  branchId: number | null;
};

const DepartmentPerformanceReportPage = () => {
  // --- Form Setup ---
  const { control, watch } = useForm<FilterForm>({
    defaultValues: {
      startDate: '', 
      endDate: '',
      cityId: null,
      branchId: null,
    }
  });

  const filters = watch();

  // --- Fetch Data ---
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["department-performance", filters.startDate, filters.endDate, filters.cityId, filters.branchId],
    queryFn: () => apiServices.reports.listDepartmentsPerformance({
      startDate: filters.startDate,
      endDate: filters.endDate,
      cityId: filters.cityId,
      branchId: filters.branchId,
    }),
  });

  const departmentsData = response || [];

  // --- محاسبات وضعیت سلامت واحد برای استفاده در جدول و اکسل ---
  const getHealthStatus = (unassigned: number, total: number) => {
    if (total === 0) return { label: 'بدون داده', status: 'default' };
    const rate = (unassigned / total) * 100;
    if (rate > 20) return { label: 'بحرانی (نیازمند رسیدگی)', status: 'destructive' };
    if (rate > 5) return { label: 'نیازمند توجه', status: 'warning' };
    return { label: 'سالم', status: 'success' };
  };

  // ------------------------------------
  // تابع خروجی اکسل
  // ------------------------------------
  const handleExportExcel = () => {
    if (!departmentsData.length) {
      alert("داده‌ای برای خروجی گرفتن وجود ندارد.");
      return;
    }

    const excelData = departmentsData.map((dept, index) => ({
      "ردیف": index + 1,
      "نام واحد / دپارتمان": dept.departmentName,
      "کل تیکت‌های ورودی": dept.totalTickets,
      "منتظر ارجاع (بدون کارشناس)": dept.unassignedTickets,
      "در دست اقدام (نزد کارشناس)": dept.activeTickets,
      "حل شده": dept.closedTickets,
      "وضعیت سلامت واحد": getHealthStatus(dept.unassignedTickets, dept.totalTickets).label
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet['!dir'] = 'rtl'; // راست‌چین کردن فایل اکسل

    // تنظیم عرض ستون‌ها
    const wscols = [
      { wch: 5 },  // ردیف
      { wch: 30 }, // نام واحد
      { wch: 20 }, // کل تیکت‌ها
      { wch: 25 }, // منتظر ارجاع
      { wch: 25 }, // در دست اقدام
      { wch: 15 }, // حل شده
      { wch: 25 }  // وضعیت سلامت
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "گزارش عملکرد واحدها");

    // دانلود فایل اکسل با تاریخ روز
    XLSX.writeFile(workbook, `Departments_Report_${new Date().toLocaleDateString('fa-IR')}.xlsx`);
  };

  return (
    <div dir="rtl" className="space-y-6">
      
      {/* --- بخش عنوان و دکمه خروجی --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">گزارش عملکرد و بار کاری واحدها</h1>
          <p className="text-muted-foreground mt-1">بررسی تیکت‌های در صف انتظار و توزیع بار کاری</p>
        </div>
        <Button variant="outline" onClick={handleExportExcel} disabled={isLoading || departmentsData.length === 0}>
          <Download className="w-4 h-4 ml-2" />
          خروجی Excel
        </Button>
      </div>

      {/* --- فیلترها --- */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <PersianDatePicker name="startDate" control={control as any} errors={{}} label="از تاریخ" />
            <PersianDatePicker name="endDate" control={control as any} errors={{}} label="تا تاریخ" />

            
            <Button 
              className="w-full" 
              onClick={() => refetch()} 
              disabled={isLoading || isFetching}
              isLoading={isLoading || isFetching}
            >
              <Search className="w-4 h-4 ml-2" />
              اعمال فیلتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- بخش نمودار بصری --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            توزیع تیکت‌ها بین واحدها
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || isFetching ? (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">در حال بارگذاری نمودار...</div>
          ) : departmentsData.length === 0 ? (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">داده‌ای برای نمایش یافت نشد</div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={departmentsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="departmentName" />
                <YAxis />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'inherit' }} 
                />
                <Legend />
                <Bar dataKey="unassignedTickets" name="منتظر ارجاع (در صف)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="activeTickets" name="در دست اقدام" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closedTickets" name="حل شده" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* --- بخش جدول جزئیات --- */}
      <Card>
        <CardHeader>
          <CardTitle>جزئیات آماری واحدها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام واحد / دپارتمان</TableHead>
                  <TableHead className="text-center">کل ورودی</TableHead>
                  <TableHead className="text-center text-red-600 font-bold">منتظر ارجاع 🚨</TableHead>
                  <TableHead className="text-center text-blue-600">در دست اقدام</TableHead>
                  <TableHead className="text-center text-green-600">حل شده</TableHead>
                  <TableHead className="text-center">وضعیت سلامت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || isFetching ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">در حال بارگذاری...</TableCell>
                  </TableRow>
                ) : departmentsData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">موردی یافت نشد.</TableCell>
                  </TableRow>
                ) : (
                  departmentsData.map((dept) => {
                    const health = getHealthStatus(dept.unassignedTickets, dept.totalTickets);
                    
                    return (
                      <TableRow key={dept.departmentId}>
                        <TableCell className="font-bold">{dept.departmentName}</TableCell>
                        <TableCell className="text-center font-bold text-lg">{dept.totalTickets.toLocaleString('fa')}</TableCell>
                        <TableCell className="text-center">
                          {dept.unassignedTickets > 0 ? (
                            <Badge variant="destructive" className="px-3 py-1 font-bold animate-pulse">
                              {dept.unassignedTickets.toLocaleString('fa')}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">۰</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-medium text-blue-600">
                          {dept.activeTickets.toLocaleString('fa')}
                        </TableCell>
                        <TableCell className="text-center font-medium text-green-600">
                          {dept.closedTickets.toLocaleString('fa')}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant="outline" 
                            className={
                              health.status === 'destructive' ? 'text-red-600 border-red-600 bg-red-50' : 
                              health.status === 'warning' ? 'text-yellow-600 border-yellow-600 bg-yellow-50' : 
                              'text-green-600 border-green-600 bg-green-50'
                            }
                          >
                            {health.status === 'destructive' && <AlertTriangle className="w-3 h-3 ml-1" />}
                            {health.status === 'success' && <CheckCircle className="w-3 h-3 ml-1" />}
                            {health.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default DepartmentPerformanceReportPage;