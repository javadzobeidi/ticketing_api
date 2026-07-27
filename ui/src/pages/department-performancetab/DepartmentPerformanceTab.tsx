import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { ChevronDown, ChevronUp, Users, Inbox, CheckCircle2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
// ایمپورت سرویس API شما (این مسیر را بر اساس پروژه خود تنظیم کنید)
// import { apiServices } from '@/services/api';

// ==================== TYPES ====================
type DepartmentUserPerformance = {
  userId: number;
  userName: string;
  handledTicketsCount: number;
  answeredCount: number;
  forwardedCount: number;
  openTickets: number;
  closedTickets: number;
};

type DepartmentPerformanceReport = {
  departmentId: number;
  departmentName: string;
  totalTickets: number;
  unassignedTickets: number;
  openTickets: number;
  closedTickets: number;
  users: DepartmentUserPerformance[];
};

// ==================== MOCK DATA ====================
// این داده‌ها دقیقاً شبیه‌سازی خروجی API بک‌اند جدید شما هستند
const mockDepartmentData: DepartmentPerformanceReport[] = [
  {
    departmentId: 1,
    departmentName: 'فنی و مهندسی',
    totalTickets: 350,
    unassignedTickets: 45,
    openTickets: 85,
    closedTickets: 220,
    users: [
      { userId: 101, userName: 'علی احمدی', handledTicketsCount: 150, answeredCount: 145, forwardedCount: 12, openTickets: 20, closedTickets: 130 },
      { userId: 102, userName: 'حسین رضایی', handledTicketsCount: 105, answeredCount: 98, forwardedCount: 5, openTickets: 15, closedTickets: 90 },
      { userId: 103, userName: 'محمد جعفری', handledTicketsCount: 50, answeredCount: 45, forwardedCount: 8, openTickets: 5, closedTickets: 45 },
    ]
  },
  {
    departmentId: 2,
    departmentName: 'پشتیبانی مشتریان',
    totalTickets: 520,
    unassignedTickets: 120,
    openTickets: 150,
    closedTickets: 250,
    users: [
      { userId: 201, userName: 'مریم کریمی', handledTicketsCount: 200, answeredCount: 195, forwardedCount: 30, openTickets: 15, closedTickets: 185 },
      { userId: 202, userName: 'رضا نوری', handledTicketsCount: 120, answeredCount: 110, forwardedCount: 15, openTickets: 10, closedTickets: 110 },
      { userId: 203, userName: 'امیر حسن‌زاده', handledTicketsCount: 80, answeredCount: 75, forwardedCount: 5, openContext: 5, closedTickets: 75 },
    ]
  },
  {
    departmentId: 3,
    departmentName: 'فروش',
    totalTickets: 180,
    unassignedTickets: 10,
    openTickets: 40,
    closedTickets: 130,
    users: [
      { userId: 301, userName: 'فاطمه محمدی', handledTicketsCount: 100, answeredCount: 95, forwardedCount: 2, openTickets: 20, closedTickets: 80 },
      { userId: 302, userName: 'نرگس اکبری', handledTicketsCount: 70, answeredCount: 70, forwardedCount: 4, openTickets: 10, closedTickets: 60 },
    ]
  }
];

// ==================== COMPONENT ====================
export const DepartmentPerformanceTab = ({ filters }: { filters: any }) => {
  // مدیریت ردیف‌های باز شده (آکاردئون)
  const [expandedDeps, setExpandedDeps] = useState<Set<number>>(new Set([1])); // پیش‌فرض واحد اول باز باشد

  const toggleDepartment = (depId: number) => {
    const newExpanded = new Set(expandedDeps);
    if (newExpanded.has(depId)) {
      newExpanded.delete(depId);
    } else {
      newExpanded.add(depId);
    }
    setExpandedDeps(newExpanded);
  };

  // اتصال به React Query (فعلاً از Mock Data استفاده می‌کنیم)
  const { data, isLoading } = useQuery({
    queryKey: ['departmentPerformance', filters],
    queryFn: async () => {
      // در پروژه واقعی: return await apiServices.reports.getDepartmentPerformance(filters);
      return mockDepartmentData;
    },
    initialData: mockDepartmentData // استفاده از دیتای تستی
  });

  // آماده‌سازی داده‌های نمودار
  const chartData = data?.map(dep => ({
    name: dep.departmentName,
    'تیکت‌های بسته': dep.closedTickets,
    'در کارتابل واحد (تخصیص نیافته)': dep.unassignedTickets,
    'در دست کارشناس (باز)': dep.openTickets - dep.unassignedTickets, // تیکت‌هایی که تخصیص یافته اما باز هستند
  })) || [];

  if (isLoading) return <div className="p-8 text-center">در حال دریافت اطلاعات...</div>;

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5 text-blue-600" />
            وضعیت تیکت‌ها به تفکیک واحدها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="تیکت‌های بسته" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
              <Bar dataKey="در دست کارشناس (باز)" stackId="a" fill="#f59e0b" />
              <Bar dataKey="در کارتابل واحد (تخصیص نیافته)" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Accordion Table Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            گزارش تفصیلی عملکرد واحدها و کارشناسان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[250px] font-bold">نام واحد / کارشناس</TableHead>
                  <TableHead className="text-center font-bold">کل تیکت‌ها</TableHead>
                  <TableHead className="text-center font-bold">در کارتابل (تخصیص نیافته)</TableHead>
                  <TableHead className="text-center font-bold">باز</TableHead>
                  <TableHead className="text-center font-bold">بسته شده</TableHead>
                  <TableHead className="text-center font-bold">پاسخ داده</TableHead>
                  <TableHead className="text-center font-bold">ارجاع داده</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((dep) => (
                  <React.Fragment key={`dep-${dep.departmentId}`}>
                    {/* ردیف اصلی: دپارتمان */}
                    <TableRow 
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${expandedDeps.has(dep.departmentId) ? 'bg-blue-50/30' : ''}`}
                      onClick={() => toggleDepartment(dep.departmentId)}
                    >
                      <TableCell className="font-bold text-base flex items-center gap-2">
                        {expandedDeps.has(dep.departmentId) ? 
                          <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        }
                        {dep.departmentName}
                      </TableCell>
                      <TableCell className="text-center font-bold text-blue-600">
                        {dep.totalTickets.toLocaleString('fa')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={dep.unassignedTickets > 20 ? 'destructive' : 'secondary'}>
                          {dep.unassignedTickets.toLocaleString('fa')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium text-orange-500">
                        {dep.openTickets.toLocaleString('fa')}
                      </TableCell>
                      <TableCell className="text-center font-medium text-emerald-600">
                        {dep.closedTickets.toLocaleString('fa')}
                      </TableCell>
                      <TableCell className="text-center text-gray-400">-</TableCell>
                      <TableCell className="text-center text-gray-400">-</TableCell>
                    </TableRow>

                    {/* ردیف‌های زیرمجموعه: کارشناسان (فقط در صورت باز بودن آکاردئون نمایش داده می‌شوند) */}
                    {expandedDeps.has(dep.departmentId) && dep.users.map((user) => (
                      <TableRow key={`user-${user.userId}`} className="bg-gray-50/20">
                        <TableCell className="pr-12 text-sm text-gray-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                          {user.userName}
                        </TableCell>
                        <TableCell className="text-center text-sm font-medium">
                          {user.handledTicketsCount.toLocaleString('fa')}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-400">
                          -
                        </TableCell>
                        <TableCell className="text-center text-sm text-orange-600/80">
                          {user.openTickets.toLocaleString('fa')}
                        </TableCell>
                        <TableCell className="text-center text-sm text-emerald-600/80">
                          {user.closedTickets.toLocaleString('fa')}
                        </TableCell>
                        <TableCell className="text-center text-sm font-medium text-blue-600">
                          {user.answeredCount.toLocaleString('fa')}
                        </TableCell>
                        <TableCell className="text-center text-sm font-medium text-purple-600">
                          {user.forwardedCount.toLocaleString('fa')}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {/* پیام در صورت خالی بودن واحد از کارشناس فعال */}
                    {expandedDeps.has(dep.departmentId) && dep.users.length === 0 && (
                      <TableRow className="bg-gray-50/20">
                        <TableCell colSpan={7} className="text-center py-4 text-sm text-muted-foreground">
                          هیچ تیکتی به کارشناسان این واحد تخصیص داده نشده است (همه در کارتابل هستند).
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};