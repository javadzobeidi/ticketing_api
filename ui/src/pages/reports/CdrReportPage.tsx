import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { 
  Phone, PhoneCall, PhoneOff, PhoneMissed, Clock, 
  Search, Download, ChevronRight, ChevronLeft 
} from 'lucide-react';

// ایمپورت کامپوننت‌های UI (آدرس‌ها را در صورت نیاز اصلاح کنید)
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Input, PersianDatePicker, Select } from '@/src/components/ui';
import { useOutletContext } from 'react-router-dom';

// ==========================================
// 1. Axios Client اختصاصی برای CDR
// ==========================================
const cdrApiClient = axios.create({
  baseURL: import.meta.env.VITE_CDR_API, // آدرس پایه API شما
  timeout: 10000,
});

// ==========================================
// 2. Types & Interfaces
// ==========================================
export interface CdrRecord {
  calldate: string;
  clid: string;
  src: string;
  dst: string;
  duration: number;
  billsec: number;
  disposition: 'ANSWERED' | 'NO ANSWER' | 'BUSY' | 'FAILED' | string;
  uniqueid: string;
}

export interface CdrResponse {
  filters: { from: string; to: string; src: string | null; dst: string | null; disposition: string | null };
  data: CdrRecord[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
  summary: { totalCalls: number; answered: number; busy: number; noAnswer: number; totalDuration: number; totalBillsec: number };
}

type FilterForm = {
  from: string;
  to: string;
  src: string;
  dst: string;
  disposition: string;
};

// ==========================================
// 3. API Fetch Function
// ==========================================
const fetchCdrData = async (filters: any, page: number, pageSize: number): Promise<CdrResponse> => {

  console.log("cdrApiClient",cdrApiClient)
    console.log("filters",filters)
  const { data } = await cdrApiClient.post('/cdr', {
      ...filters,
      page,
      pageSize,
  });
  return data;
};

// ==========================================
// 4. Main Component
// ==========================================
const CdrReportPage = () => {
  // --- States ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

   const { serverNow } = useOutletContext();



  // --- Form Setup ---
  const { control, watch, getValues, register } = useForm<FilterForm>({
    defaultValues: {
      from: serverNow,
      to: serverNow,
      src: '',
      dst: '',
      disposition: '',
    }
  });

  const filters = watch();

  // --- Fetch Data ---
  const {
    data: responseData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["cdr-report", page, pageSize, filters.from, filters.to, filters.src, filters.dst, filters.disposition],
    queryFn: () => fetchCdrData(filters, page, pageSize),
    keepPreviousData: true, // برای جلوگیری از پرش صفحه هنگام لودینگ دیتای جدید
  });

  const cdrData = responseData?.data || [];
  const summary = responseData?.summary || { totalCalls: 0, answered: 0, busy: 0, noAnswer: 0, totalDuration: 0, totalBillsec: 0 };
  const pagination = responseData?.pagination || { page: 1, pageSize: 10, total: 0, totalPages: 1 };

  const formatDateTime = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('fa-IR', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const getDispositionBadge = (status: string) => {
    switch (status) {
      case 'ANSWERED': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">پاسخ داده شده</Badge>;
      case 'NO ANSWER': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">بدون پاسخ</Badge>;
      case 'BUSY': return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">مشغول</Badge>;
      case 'FAILED': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none">ناموفق</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- Handlers ---
  const handleExportExcel = () => {
    // تبدیل دیتای فعلی جدول به فرمت مناسب برای اکسل
    const excelData = cdrData.map((call, index) => ({
      "ردیف": ((page - 1) * pageSize) + index + 1,
      "تاریخ و زمان": formatDateTime(call.calldate),
      "مشخصات تماس گیرنده (CLID)": call.clid,
      "مبدا": call.src,
      "مقصد": call.dst,
      "وضعیت": call.disposition === 'ANSWERED' ? 'پاسخ داده شده' : 
               call.disposition === 'NO ANSWER' ? 'بدون پاسخ' : 
               call.disposition === 'BUSY' ? 'مشغول' : call.disposition,
      "مدت کل (ثانیه)": call.duration,
      "مدت مکالمه (ثانیه)": call.billsec,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet['!dir'] = 'rtl';
    worksheet['!cols'] = [
      { wch: 5 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "گزارش تماس‌ها");
    XLSX.writeFile(workbook, `CDR_Report_${new Date().toLocaleDateString('fa-IR')}.xlsx`);
  };

  return (
    <div dir="rtl" className="space-y-6">
      
      {/* --- بخش عنوان و فیلترها --- */}
      <Card>
        <CardHeader>
          <CardTitle>گزارش ریز مکالمات (CDR)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
            <PersianDatePicker name="from" control={control as any} errors={{}} label="از تاریخ" />
            <PersianDatePicker name="to" control={control as any} errors={{}} label="تا تاریخ" />
           

            <div className="flex gap-2">
              <Button 
                className="w-full flex-1" 
                onClick={() => { setPage(1); refetch(); }} 
                disabled={isLoading || isFetching}
              >
                <Search className="w-4 h-4 ml-2" />
                جستجو
              </Button>
              <Button variant="outline" onClick={handleExportExcel} title="خروجی Excel صفحه فعلی">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- بخش کارت‌های خلاصه وضعیت --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">کل تماس‌ها</p>
              <h3 className="text-2xl font-bold text-blue-700">{summary.totalCalls.toLocaleString('fa')}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Phone /></div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">پاسخ داده شده</p>
              <h3 className="text-2xl font-bold text-green-700">{summary.answered.toLocaleString('fa')}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600"><PhoneCall /></div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50/50 border-orange-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">بدون پاسخ / از دست رفته</p>
              <h3 className="text-2xl font-bold text-orange-700">{summary.noAnswer.toLocaleString('fa')}</h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-full text-orange-600"><PhoneMissed /></div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50/50 border-purple-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">کل زمان مکالمه (دقیقه)</p>
              <h3 className="text-2xl font-bold text-purple-700">{Math.floor(summary.totalBillsec / 60).toLocaleString('fa')}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600"><Clock /></div>
          </CardContent>
        </Card>
      </div>

      {/* --- بخش جدول داده‌ها --- */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-base">لیست تماس‌ها</CardTitle>
          {isFetching && <span className="text-sm text-muted-foreground">در حال بروزرسانی...</span>}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-12 text-center">ردیف</TableHead>
                  <TableHead>تاریخ و زمان</TableHead>
                  <TableHead>مبدا (Source)</TableHead>
                  <TableHead>مقصد (Destination)</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>کل زمان</TableHead>
                  <TableHead>مدت مکالمه</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">در حال دریافت اطلاعات...</TableCell>
                  </TableRow>
                ) : cdrData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">رکوردی یافت نشد.</TableCell>
                  </TableRow>
                ) : (
                  cdrData.map((call, index) => (
                    <TableRow key={call.uniqueid} className="hover:bg-gray-50/50">
                      <TableCell className="text-center text-muted-foreground">
                        {((page - 1) * pageSize) + index + 1}
                      </TableCell>
                      <TableCell dir="ltr" className="text-right font-mono text-sm">
                        {formatDateTime(call.calldate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{call.src}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={call.clid}>
                            {call.clid}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">{call.dst}</TableCell>
                      <TableCell>
                        {getDispositionBadge(call.disposition)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDuration(call.duration)}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {formatDuration(call.billsec)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* --- Pagination Controls --- */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              نمایش <span className="font-medium">{cdrData.length > 0 ? ((page - 1) * pageSize) + 1 : 0}</span> تا <span className="font-medium">{((page - 1) * pageSize) + cdrData.length}</span> از <span className="font-medium">{pagination.total.toLocaleString('fa')}</span> رکورد
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronRight className="w-4 h-4 ml-1" />
                قبلی
              </Button>
              
              <div className="text-sm font-medium px-4">
                صفحه {page.toLocaleString('fa')} از {pagination.totalPages.toLocaleString('fa')}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages || isLoading}
              >
                بعدی
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CdrReportPage;