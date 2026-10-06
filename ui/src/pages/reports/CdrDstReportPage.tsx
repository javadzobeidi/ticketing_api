import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { 
  Phone, PhoneCall, PhoneMissed, Clock, 
  Search, Download, Users
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/button';
import { PersianDatePicker } from '@/src/components/ui';
import { useOutletContext } from 'react-router-dom';

// ==========================================
// 1. Axios Client اختصاصی
// ==========================================
const cdrApiClient = axios.create({
  baseURL: import.meta.env.VITE_CDR_API,
  timeout: 10000,
});

// ==========================================
// 2. Types & Interfaces
// ==========================================
export interface GroupedCdrRecord {
  dst: string;
  totalCalls: number;
  answered: number;
  busy: number;
  noAnswer: number;
  others: number;
  totalDuration: number;
  totalBillsec: number;
}

export interface GroupedCdrResponse {
  filters: { from: string; to: string; src: string | null; disposition: string | null };
  totalDestinations: number;
  data: GroupedCdrRecord[];
}

type FilterForm = {
  from: string;
  to: string;
  src: string;
  disposition: string;
};

// ==========================================
// 3. API Fetch Function
// ==========================================
const fetchGroupedCdrData = async (filters: any): Promise<GroupedCdrResponse> => {
  const { data } = await cdrApiClient.post('/cdr/report-dst', filters);
  return data;
};

// ==========================================
// 4. Main Component
// ==========================================
const CdrDstReportPage = () => {
  // دریافت زمان فعلی سرور (در صورت وجود)
  const context = useOutletContext<{ serverNow?: string }>();
  const serverNow = context?.serverNow || '';

  // --- Form Setup ---
  const { control, watch } = useForm<FilterForm>({
    defaultValues: {
      from: serverNow,
      to: serverNow,
      src: '',
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
    queryKey: ["cdr-report-dst", filters.from, filters.to, filters.src, filters.disposition],
    queryFn: () => fetchGroupedCdrData(filters),
    keepPreviousData: true,
  });

  const allData = responseData?.data || [];

 const filteredData = useMemo(() => {
    return allData.filter(row => row.dst.length === 3 || row.dst.length === 4);
  }, [allData]);



  // محاسبه خلاصه آمارها از روی کل دیتای دریافتی
  const summary = useMemo(() => {
    return filteredData.reduce((acc, curr) => ({
      totalCalls: acc.totalCalls + curr.totalCalls,
      answered: acc.answered + curr.answered,
      noAnswer: acc.noAnswer + curr.noAnswer,
      totalBillsec: acc.totalBillsec + curr.totalBillsec,
    }), { totalCalls: 0, answered: 0, noAnswer: 0, totalBillsec: 0 });
  }, [filteredData]);

 




  // --- Formatters ---
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- Handlers ---
  const handleExportExcel = () => {
    const excelData = filteredData.map((call, index) => ({
      "ردیف": index + 1,
      "مقصد (داخلی)": call.dst,
      "کل تماس‌ها": call.totalCalls,
      "پاسخ داده شده": call.answered,
      "مشغول": call.busy,
      "بدون پاسخ": call.noAnswer,
      "سایر وضعیت‌ها": call.others,
      "کل زمان (ثانیه)": call.totalDuration,
      "مدت مکالمه (ثانیه)": call.totalBillsec,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet['!dir'] = 'rtl';
    worksheet['!cols'] = [
      { wch: 5 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "گزارش تجمیعی مقاصد");
    XLSX.writeFile(workbook, `CDR_Grouped_Dst_${new Date().toLocaleDateString('fa-IR')}.xlsx`);
  };

  return (
    <div dir="rtl" className="space-y-6">
      
      {/* --- بخش عنوان و فیلترها --- */}
      <Card>
        <CardHeader>
          <CardTitle>گزارش تجمیعی تماس‌ها (بر اساس مقصد)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
            <PersianDatePicker name="from" control={control as any} errors={{}} label="از تاریخ" />
            <PersianDatePicker name="to" control={control as any} errors={{}} label="تا تاریخ" />
            
            <div className="flex gap-2">
              <Button 
                className="w-full flex-1" 
                onClick={() => refetch()} 
                disabled={isLoading || isFetching}
              >
                <Search className="w-4 h-4 ml-2" />
                جستجو
              </Button>
              <Button variant="outline" onClick={handleExportExcel} title="خروجی Excel کل نتایج" disabled={allData.length === 0}>
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
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            عملکرد مقاصد / داخلی‌ها
          </CardTitle>
          {isFetching && <span className="text-sm text-muted-foreground">در حال بروزرسانی...</span>}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-12 text-center">ردیف</TableHead>
                  <TableHead>مقصد (داخلی)</TableHead>
                  <TableHead className="text-center">کل تماس‌ها</TableHead>
                  <TableHead className="text-center text-green-700">پاسخ داده</TableHead>
                  <TableHead className="text-center text-orange-600">بدون پاسخ</TableHead>
                  <TableHead className="text-center text-red-600">مشغول</TableHead>
                  <TableHead className="text-center">کل زمان</TableHead>
                  <TableHead className="text-center font-bold">مدت مکالمه</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">در حال دریافت اطلاعات...</TableCell>
                  </TableRow>
                ) : allData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">رکوردی یافت نشد.</TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row, index) => (
                    <TableRow key={row.dst} className="hover:bg-gray-50/50">
                      <TableCell className="text-center text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                          {row.dst}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-gray-900">{row.totalCalls.toLocaleString('fa')}</TableCell>
                      <TableCell className="text-center text-green-700 font-medium">{row.answered.toLocaleString('fa')}</TableCell>
                      <TableCell className="text-center text-orange-600 font-medium">{row.noAnswer.toLocaleString('fa')}</TableCell>
                      <TableCell className="text-center text-red-600 font-medium">{row.busy.toLocaleString('fa')}</TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {formatDuration(row.totalDuration)}
                      </TableCell>
                      <TableCell className="text-center font-bold text-gray-900">
                        {formatDuration(row.totalBillsec)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* فوتر ساده برای نمایش تعداد کل ردیف‌ها */}
          {allData.length > 0 && (
            <div className="px-6 py-4 border-t text-sm text-muted-foreground bg-gray-50/30">
              تعداد کل مقاصد یافت شده: <span className="font-bold text-gray-900">{allData.length.toLocaleString('fa')}</span>
            </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
};

export default CdrDstReportPage;