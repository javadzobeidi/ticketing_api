import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { 
  Users, CheckCircle, AlertCircle, Clock, Search, ArrowUpDown ,Download
} from 'lucide-react';
import * as XLSX from 'xlsx';
// ایمپورت کامپوننت‌های UI شما (آدرس‌ها را در صورت نیاز اصلاح کنید)
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { ComboboxField, Input, PersianDatePicker } from '@/src/components/ui';
import { apiServices } from '@/src/apis';
import { ExpertPerformanceDto } from '@/src/apis/reports.api'; // تایپی که بالا تعریف کردیم

// تایپ فیلترهای فرم
type FilterForm = {
  startDate: string;
  endDate: string;
  cityId: number | null;
  branchId: number | null;
  departmentId: number | null;
};

const ExpertPerformanceReportPage = () => {
  // --- States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: keyof ExpertPerformanceDto; direction: 'asc' | 'desc' }>({
    field: 'assignedCount',
    direction: 'desc'
  });

  // --- Form Setup ---
  const { control, watch, getValues } = useForm<FilterForm>({
    defaultValues: {
      startDate: '', // می‌توانید از serverNow استفاده کنید
      endDate: '',
      cityId: null,
      branchId: null,
      departmentId: null,
    }
  });

  // مقادیر فرم برای پاس دادن به API
  const filters = watch();

  // --- Fetch Data ---
  const {
    data: expertsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["expert-performance", filters.startDate, filters.endDate, filters.cityId, filters.branchId, filters.departmentId],
    queryFn: () => apiServices.reports.listExpertPerformance({
      startDate: filters.startDate,
      endDate: filters.endDate,
      cityId: filters.cityId,
      branchId: filters.branchId,
      departmentId: filters.departmentId
    }),
    // در صورت نیاز به دیتای پایه (Base Data) برای دراپ‌داون‌ها، کوئری‌های جداگانه بنویسید
  });

  // استخراج آرایه دیتا از ریسپانس
  console.log("expertsResponse:",expertsResponse)
  const expertsData = expertsResponse || [];

  // --- Data Processing (Search & Sort) ---
  const processedData = useMemo(() => {
    let result = [...expertsData];

    // اعمال سرچ لوکال روی نام کارشناس
    if (searchQuery) {
      result = result.filter(exp => exp.name.includes(searchQuery) || exp.department.includes(searchQuery));
    }

    // اعمال مرتب‌سازی لوکال
    result.sort((a, b) => {
      const aVal = a[sortConfig.field];
      const bVal = b[sortConfig.field];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [expertsData, searchQuery, sortConfig]);

  // --- Summary Calculations ---
  const summary = useMemo(() => {
    if (!expertsData.length) return { totalAssigned: 0, totalClosed: 0, totalActive: 0, avgTime: 0 };
    return {
      totalAssigned: expertsData.reduce((sum, item) => sum + item.assignedCount, 0),
      totalClosed: expertsData.reduce((sum, item) => sum + item.closedCount, 0),
      totalActive: expertsData.reduce((sum, item) => sum + item.activeTickets, 0),
      avgTime: (expertsData.reduce((sum, item) => sum + item.avgResponseTime, 0) / expertsData.length).toFixed(1)
    };
  }, [expertsData]);

  // --- Handlers ---
  const handleSort = (field: keyof ExpertPerformanceDto) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleExportExcel = () => {
    // ۱. مپ کردن داده‌ها برای داشتن عناوین فارسی در فایل اکسل
    const excelData = processedData.map((expert, index) => ({
      "ردیف": index + 1,
      "نام کارشناس": expert.name,
      "واحد / دپارتمان": expert.department || "-",
      "شهر": expert.city || "-",
      "شعبه": expert.branch || "-",
      "کل ارجاعات": expert.assignedCount,
      "پاسخ داده": expert.answeredCount,
      "بسته شده": expert.closedCount,
      "ارجاع به غیر": expert.referredCount,
      "در دست اقدام": expert.activeTickets,
      "میانگین زمان پاسخ (دقیقه)": expert.avgResponseTime
    }));

    // ۲. تبدیل آبجکت‌های جی‌سون به شیت اکسل
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // راست‌چین کردن شیت اکسل (RTL)
    worksheet['!dir'] = 'rtl';

    // تنظیم تقریبی عرض ستون‌ها برای خوانایی بهتر
    const wscols = [
      { wch: 5 },  // ردیف
      { wch: 25 }, // نام کارشناس
      { wch: 20 }, // واحد
      { wch: 15 }, // شهر
      { wch: 15 }, // شعبه
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 }
    ];
    worksheet['!cols'] = wscols;

    // ۳. ساخت یک ورک‌بوک جدید و اضافه کردن شیت به آن
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "گزارش عملکرد کارشناسان");

    // ۴. ایجاد و دانلود فایل
    // نام فایل می‌تواند داینامیک و شامل تاریخ امروز باشد
    XLSX.writeFile(workbook, `Expert_Performance_${new Date().toLocaleDateString('fa-IR')}.xlsx`);
  };


  return (
    <div dir="rtl" className="space-y-6">
      
      {/* --- بخش عنوان و فیلترها --- */}
      <Card>
        <CardHeader>
          <CardTitle>گزارش عملکرد کارشناسان پاسخگو</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            
            {/* تقویم‌ها */}
            <PersianDatePicker name="startDate" control={control as any} errors={{}} label="از تاریخ" />
            <PersianDatePicker name="endDate" control={control as any} errors={{}} label="تا تاریخ" />


           
            {/* دکمه اعمال فیلتر */}
            <Button 
              className="w-full" 
              onClick={() => refetch()} 
              disabled={isLoading || isFetching}
              isLoading={isLoading || isFetching}
            >
              <Search className="w-4 h-4 ml-2" />
              اعمال فیلتر
            </Button>

            <Button variant="outline" onClick={handleExportExcel}>
      <Download className="w-4 h-4 ml-2" />
      خروجی Excel
    </Button>

          </div>
        </CardContent>
      </Card>

      {/* --- بخش کارت‌های خلاصه وضعیت --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-purple-50/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">کل ارجاعات (گزارش)</p>
              <h3 className="text-2xl font-bold text-purple-700">{summary.totalAssigned.toLocaleString('fa')}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600"><Users /></div>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">تیکت‌های حل شده</p>
              <h3 className="text-2xl font-bold text-green-700">{summary.totalClosed.toLocaleString('fa')}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600"><CheckCircle /></div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">تیکت‌های در دست اقدام</p>
              <h3 className="text-2xl font-bold text-orange-700">{summary.totalActive.toLocaleString('fa')}</h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-full text-orange-600"><AlertCircle /></div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">میانگین کل پاسخگویی</p>
              <h3 className="text-2xl font-bold text-blue-700">{summary.avgTime.toLocaleString('fa')} <span className="text-sm font-normal text-gray-500">دقیقه</span></h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Clock /></div>
          </CardContent>
        </Card>
      </div>

      {/* --- بخش جدول داده‌ها --- */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>جزئیات عملکرد کارشناسان</CardTitle>
          <div className="relative w-64">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجوی کارشناس..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام کارشناس</TableHead>
                  <TableHead>دپارتمان / محل</TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('assignedCount')}>
                    <div className="flex items-center gap-1">کل ارجاعات <ArrowUpDown className="w-3 h-3" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('answeredCount')}>
                    <div className="flex items-center gap-1 text-blue-600">پاسخ داده <ArrowUpDown className="w-3 h-3" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('closedCount')}>
                    <div className="flex items-center gap-1 text-green-600">بسته شده <ArrowUpDown className="w-3 h-3" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('referredCount')}>
                    <div className="flex items-center gap-1 text-orange-600">ارجاع به غیر <ArrowUpDown className="w-3 h-3" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('activeTickets')}>
                    <div className="flex items-center gap-1">در دست اقدام <ArrowUpDown className="w-3 h-3" /></div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('avgResponseTime')}>
                    <div className="flex items-center gap-1">زمان پاسخ <ArrowUpDown className="w-3 h-3" /></div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {isLoading || isFetching ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">در حال دریافت اطلاعات...</TableCell>
                  </TableRow>
                ) : processedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">اطلاعاتی برای نمایش یافت نشد.</TableCell>
                  </TableRow>
                ) : (
                  processedData.map((expert) => (
                    <TableRow key={expert.id}>
                      <TableCell className="font-bold">{expert.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">{expert.department}</span>
                          <span className="text-xs text-muted-foreground">{expert.city} - {expert.branch}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-lg">{expert.assignedCount.toLocaleString('fa')}</TableCell>
                      <TableCell className="text-blue-600 font-semibold">{expert.answeredCount.toLocaleString('fa')}</TableCell>
                      <TableCell className="text-green-600 font-semibold">{expert.closedCount.toLocaleString('fa')}</TableCell>
                      <TableCell className="text-orange-600">{expert.referredCount.toLocaleString('fa')}</TableCell>
                      <TableCell>
                        <Badge variant={expert.activeTickets > 5 ? "destructive" : "secondary"}>
                          {expert.activeTickets.toLocaleString('fa')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{expert.avgResponseTime.toLocaleString('fa')} </span>
                        <span className="text-xs text-muted-foreground">دقیقه</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default ExpertPerformanceReportPage;