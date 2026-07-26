// TicketReportsPage.tsx - Complete Implementation with Static Data
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs } from '@base-ui-components/react/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { ComboboxField } from '@/src/components/ui';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';
import { 
  Users, Clock, CheckCircle, AlertCircle, Star,
  Download, Search, ArrowUpDown
} from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

// ==================== TYPES ====================
type FilterForm = {
  dateRange: string;
  cityId: number;
  branchId: number;
  departmentId: number;
};

type ExpertPerformance = {
  id: number;
  name: string;
  department: string;
  city: string;
  branch: string;
  assignedCount: number;
  answeredCount: number;
  closedCount: number;
  activeTickets: number;
  avgResponseTime: number;
  avgRating: number;
};

type OverviewStats = {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  totalAssignments: number;
  avgResponseTime: string;
  satisfactionRate: number;
  todayReservations: number;
};

// ==================== STATIC DATA ====================
const staticCities = [
  { id: -1, title: 'همه شهرها' },
  { id: 1, title: 'تهران' },
  { id: 2, title: 'مشهد' },
  { id: 3, title: 'اصفهان' },
  { id: 4, title: 'شیراز' },
  { id: 5, title: 'تبریز' },
];

const staticBranches = [
  { id: -1, title: 'همه شعب' },
  { id: 1, title: 'شعبه مرکزی تهران', cityId: 1 },
  { id: 2, title: 'شعبه ولنجک', cityId: 1 },
  { id: 3, title: 'شعبه نیاوران', cityId: 1 },
  { id: 4, title: 'شعبه مرکزی مشهد', cityId: 2 },
  { id: 5, title: 'شعبه احمدآباد', cityId: 2 },
  { id: 6, title: 'شعبه مرکزی اصفهان', cityId: 3 },
  { id: 7, title: 'شعبه شیراز', cityId: 4 },
  { id: 8, title: 'شعبه تبریز', cityId: 5 },
];

const staticDepartments = [
  { id: -1, title: 'همه واحدها' },
  { id: 1, title: 'فنی و مهندسی' },
  { id: 2, title: 'پشتیبانی مشتریان' },
  { id: 3, title: 'فروش' },
  { id: 4, title: 'حسابداری' },
  { id: 5, title: 'منابع انسانی' },
];

const staticOverviewStats: OverviewStats = {
  totalTickets: 2847,
  openTickets: 342,
  closedTickets: 2505,
  totalAssignments: 3621,
  avgResponseTime: '2.4س',
  satisfactionRate: 4.6,
  todayReservations: 87,
};

const staticExpertsData: ExpertPerformance[] = [
  { id: 1, name: 'علی احمدی', department: 'فنی و مهندسی', city: 'تهران', branch: 'شعبه مرکزی', assignedCount: 245, answeredCount: 238, closedCount: 225, activeTickets: 7, avgResponseTime: 1.8, avgRating: 4.8 },
  { id: 2, name: 'مریم کریمی', department: 'پشتیبانی مشتریان', city: 'تهران', branch: 'شعبه ولنجک', assignedCount: 312, answeredCount: 305, closedCount: 298, activeTickets: 9, avgResponseTime: 2.1, avgRating: 4.7 },
  { id: 3, name: 'حسین رضایی', department: 'فنی و مهندسی', city: 'مشهد', branch: 'شعبه مرکزی', assignedCount: 198, answeredCount: 192, closedCount: 185, activeTickets: 6, avgResponseTime: 2.5, avgRating: 4.5 },
  { id: 4, name: 'فاطمه محمدی', department: 'فروش', city: 'اصفهان', branch: 'شعبه مرکزی', assignedCount: 267, answeredCount: 260, closedCount: 253, activeTickets: 8, avgResponseTime: 1.9, avgRating: 4.9 },
  { id: 5, name: 'رضا نوری', department: 'پشتیبانی مشتریان', city: 'شیراز', branch: 'شعبه شیراز', assignedCount: 223, answeredCount: 215, closedCount: 208, activeTickets: 7, avgResponseTime: 2.3, avgRating: 4.6 },
  { id: 6, name: 'سارا حسینی', department: 'حسابداری', city: 'تهران', branch: 'شعبه نیاوران', assignedCount: 189, answeredCount: 185, closedCount: 180, activeTickets: 5, avgResponseTime: 2.0, avgRating: 4.7 },
  { id: 7, name: 'محمد جعفری', department: 'فنی و مهندسی', city: 'تبریز', branch: 'شعبه تبریز', assignedCount: 276, answeredCount: 268, closedCount: 260, activeTickets: 10, avgResponseTime: 2.4, avgRating: 4.5 },
  { id: 8, name: 'زهرا عباسی', department: 'منابع انسانی', city: 'مشهد', branch: 'شعبه احمدآباد', assignedCount: 145, answeredCount: 142, closedCount: 138, activeTickets: 4, avgResponseTime: 1.7, avgRating: 4.8 },
  { id: 9, name: 'امیر حسن‌زاده', department: 'پشتیبانی مشتریان', city: 'تهران', branch: 'شعبه مرکزی', assignedCount: 298, answeredCount: 290, closedCount: 282, activeTickets: 11, avgResponseTime: 2.6, avgRating: 4.4 },
  { id: 10, name: 'نرگس اکبری', department: 'فروش', city: 'اصفهان', branch: 'شعبه مرکزی', assignedCount: 234, answeredCount: 228, closedCount: 220, activeTickets: 8, avgResponseTime: 2.2, avgRating: 4.6 },
];

const staticTrendData = [
  { date: '۱ آبان', created: 45, assigned: 52, closed: 38 },
  { date: '۲ آبان', created: 52, assigned: 48, closed: 45 },
  { date: '۳ آبان', created: 48, assigned: 55, closed: 42 },
  { date: '۴ آبان', created: 61, assigned: 58, closed: 50 },
  { date: '۵ آبان', created: 55, assigned: 62, closed: 48 },
  { date: '۶ آبان', created: 67, assigned: 64, closed: 55 },
  { date: '۷ آبان', created: 72, assigned: 70, closed: 62 },
];

const staticCategoryData = [
  { name: 'فنی', value: 842, color: '#3b82f6' },
  { name: 'مالی', value: 456, color: '#10b981' },
  { name: 'پشتیبانی', value: 687, color: '#f59e0b' },
  { name: 'فروش', value: 523, color: '#8b5cf6' },
  { name: 'سایر', value: 339, color: '#ef4444' },
];

const staticCityDistData = [
  { name: 'تهران', value: 1245, branches: 3, color: '#3b82f6' },
  { name: 'مشهد', value: 567, branches: 2, color: '#10b981' },
  { name: 'اصفهان', value: 423, branches: 1, color: '#f59e0b' },
  { name: 'شیراز', value: 312, branches: 1, color: '#8b5cf6' },
  { name: 'تبریز', value: 300, branches: 1, color: '#ef4444' },
];

const staticSatisfactionData = {
  trend: [
    { month: 'فروردین', rating: 4.2 },
    { month: 'اردیبهشت', rating: 4.3 },
    { month: 'خرداد', rating: 4.5 },
    { month: 'تیر', rating: 4.4 },
    { month: 'مرداد', rating: 4.6 },
    { month: 'شهریور', rating: 4.7 },
    { month: 'مهر', rating: 4.6 },
  ],
  questionnaire: [
    { question: 'کیفیت خدمات', score: 4.7 },
    { question: 'سرعت پاسخگویی', score: 4.5 },
    { question: 'حل مشکل', score: 4.8 },
    { question: 'برخورد کارشناس', score: 4.9 },
    { question: 'رضایت کلی', score: 4.6 },
  ],
  distribution: {
    1: 12,
    2: 23,
    3: 89,
    4: 456,
    5: 1267,
  }
};

// ==================== STAT CARD COMPONENT ====================
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue' 
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: { value: string; positive: boolean };
  color?: 'blue' | 'orange' | 'green' | 'yellow' | 'purple' | 'red';
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && (
              <p className={`text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ==================== MAIN COMPONENT ====================
const TicketReportsPage = () => {
  const [searchExpert, setSearchExpert] = useState('');
  const [sortField, setSortField] = useState<keyof ExpertPerformance>('assignedCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Form for filters
  const { control, watch, setValue } = useForm<FilterForm>({
    defaultValues: {
      dateRange: 'week',
      cityId: -1,
      branchId: -1,
      departmentId: -1,
    }
  });

  const cityId = watch('cityId');

  // Filter branches based on selected city
  const filteredBranches = cityId === -1 
    ? staticBranches 
    : [
        { id: -1, title: 'همه شعب' },
        ...staticBranches.filter(b => b.id === -1 || (b as any).cityId === cityId)
      ];

  // ==================== DATA PROCESSING ====================
  
  // Filter and sort experts
  const filteredExperts = staticExpertsData
    .filter(expert => {
      const matchesSearch = expert.name.toLowerCase().includes(searchExpert.toLowerCase()) ||
                           expert.department.includes(searchExpert);
      return matchesSearch;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      return direction * (Number(a[sortField]) - Number(b[sortField]));
    });

  // Pagination
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
  const paginatedExperts = filteredExperts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort
  const handleSort = (field: keyof ExpertPerformance) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle city change - reset branch when city changes
  const handleCityChange = (value: number) => {
    setValue('cityId', value);
    setValue('branchId', -1);
  };

  // Export to Excel
  const handleExport = () => {
    alert('خروجی Excel در حال آماده‌سازی است...');
  };

  // ==================== RENDER ====================
  return (
    <div dir="rtl" className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">گزارشات و تحلیل‌ها</h1>
            <p className="text-muted-foreground mt-1">داشبورد جامع سیستم تیکتینگ</p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 ml-2" />
            خروجی Excel
          </Button>
        </div>

        {/* Filters Card */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Date Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">بازه زمانی</label>
                <Controller
                  name="dateRange"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">امروز</SelectItem>
                        <SelectItem value="week">این هفته</SelectItem>
                        <SelectItem value="month">این ماه</SelectItem>
                        <SelectItem value="quarter">سه ماهه</SelectItem>
                        <SelectItem value="year">امسال</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* City */}
              <div>
                <label className="text-sm font-medium mb-2 block">شهر</label>
                <Controller
                  name="cityId"
                  control={control}
                  render={({ field }) => (
                    <ComboboxField
                      options={staticCities}
                      placeholder="انتخاب شهر"
                      idKey="id"
                      titleKey="title"
                      value={field.value}
                      onChange={(value) => handleCityChange(value ? parseInt(value) : -1)}
                    />
                  )}
                />
              </div>

              {/* Branch */}
              <div>
                <label className="text-sm font-medium mb-2 block">شعبه</label>
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field }) => (
                    <ComboboxField
                      options={filteredBranches}
                      placeholder="انتخاب شعبه"
                      idKey="id"
                      titleKey="title"
                      value={field.value}
                      onChange={(value) => field.onChange(value ? parseInt(value) : -1)}
                    />
                  )}
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-sm font-medium mb-2 block">واحد</label>
                <Controller
                  name="departmentId"
                  control={control}
                  render={({ field }) => (
                    <ComboboxField
                      options={staticDepartments}
                      placeholder="انتخاب واحد"
                      idKey="id"
                      titleKey="title"
                      value={field.value}
                      onChange={(value) => field.onChange(value ? parseInt(value) : -1)}
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="کل تیکت‌ها" 
          value={staticOverviewStats.totalTickets.toLocaleString('fa')} 
          icon={CheckCircle}
          color="blue"
        />
        <StatCard 
          title="تیکت‌های باز" 
          value={staticOverviewStats.openTickets.toLocaleString('fa')} 
          icon={AlertCircle}
          color="orange"
        />
        <StatCard 
          title="کل ارجاع‌ها" 
          value={staticOverviewStats.totalAssignments.toLocaleString('fa')} 
          icon={Users}
          color="purple"
        />
        <StatCard 
          title="میانگین پاسخ" 
          value={staticOverviewStats.avgResponseTime} 
          icon={Clock}
          color="green"
        />
        <StatCard 
          title="رضایت مشتری" 
          value={`${staticOverviewStats.satisfactionRate}/5`} 
          icon={Star}
          color="yellow"
        />
      </div>

      {/* Main Tabs */}
      <Tabs.Root defaultValue="overview" className="space-y-4">
        <Tabs.List className="grid w-full grid-cols-5">
          <Tabs.Tab className=" relative py-3 px-4 rounded-md text-sm font-medium
      transition-all duration-200
      text-gray-600 hover:text-gray-900
      data-[selected]:bg-white 
      data-[selected]:text-blue-600 
      data-[selected]:shadow-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 " value="overview">نمای کلی</Tabs.Tab>
          <Tabs.Tab className="relative py-3 px-4 rounded-md text-sm font-medium
      transition-all duration-200
      text-gray-600 hover:text-gray-900
      data-[selected]:bg-white 
      data-[selected]:text-blue-600 
      data-[selected]:shadow-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" value="experts">کارشناسان</Tabs.Tab>
          <Tabs.Tab className="relative py-3 px-4 rounded-md text-sm font-medium
      transition-all duration-200
      text-gray-600 hover:text-gray-900
      data-[selected]:bg-white 
      data-[selected]:text-blue-600 
      data-[selected]:shadow-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" value="locations">شهرها و شعب</Tabs.Tab>
          <Tabs.Tab className="relative py-3 px-4 rounded-md text-sm font-medium
      transition-all duration-200
      text-gray-600 hover:text-gray-900
      data-[selected]:bg-white 
      data-[selected]:text-blue-600 
      data-[selected]:shadow-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" value="reservations">رزروها</Tabs.Tab>
          <Tabs.Tab className="relative py-3 px-4 rounded-md text-sm font-medium
      transition-all duration-200
      text-gray-600 hover:text-gray-900
      data-[selected]:bg-white 
      data-[selected]:text-blue-600 
      data-[selected]:shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" value="satisfaction">رضایت</Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>روند تیکت‌ها و ارجاع‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={staticTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="created" name="ایجاد" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="assigned" name="ارجاع" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="closed" name="بسته" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>توزیع دسته‌بندی</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={staticCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {staticCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزیع شهرها</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={staticCityDistData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {staticCityDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </Tabs.Panel>

        {/* Experts Performance Tab */}
        <Tabs.Panel value="experts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle>
                  لیست عملکرد کارشناسان 
                  ({filteredExperts.length.toLocaleString('fa')} نفر)
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="جستجوی نام یا واحد..."
                      value={searchExpert}
                      onChange={(e) => {
                        setSearchExpert(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pr-9"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>نام کارشناس</TableHead>
                      <TableHead>واحد</TableHead>
                      <TableHead>شهر</TableHead>
                      <TableHead>شعبه</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('assignedCount')}
                      >
                        <div className="flex items-center gap-1">
                          ارجاع شده
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('answeredCount')}
                      >
                        <div className="flex items-center gap-1">
                          پاسخ داده
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('closedCount')}
                      >
                        <div className="flex items-center gap-1">
                          بسته شده
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead>فعال</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('avgResponseTime')}
                      >
                        <div className="flex items-center gap-1">
                          میانگین پاسخ
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('avgRating')}
                      >
                        <div className="flex items-center gap-1">
                          امتیاز
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedExperts.map((expert, idx) => (
                      <TableRow key={expert.id}>
                        <TableCell className="font-medium">
                          {((currentPage - 1) * itemsPerPage + idx + 1).toLocaleString('fa')}
                        </TableCell>
                        <TableCell className="font-medium">{expert.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expert.department}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{expert.city}</TableCell>
                        <TableCell className="text-sm">{expert.branch}</TableCell>
                        <TableCell>
                          <span className="font-bold text-purple-600">
                            {expert.assignedCount.toLocaleString('fa')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-blue-600">
                            {expert.answeredCount.toLocaleString('fa')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-600">
                            {expert.closedCount.toLocaleString('fa')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={expert.activeTickets > 10 ? 'destructive' : 'secondary'}>
                            {expert.activeTickets.toLocaleString('fa')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {expert.avgResponseTime.toLocaleString('fa')}س
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">
                              {expert.avgRating.toLocaleString('fa')}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paginatedExperts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center text-muted-foreground py-12">
                          موردی یافت نشد
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    نمایش {((currentPage - 1) * itemsPerPage + 1).toLocaleString('fa')} تا
{Math.min(currentPage * itemsPerPage, filteredExperts.length).toLocaleString('fa')} از{' '}
                    {filteredExperts.length.toLocaleString('fa')} مورد
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      قبلی
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum.toLocaleString('fa')}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      بعدی
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">بیشترین ارجاع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredExperts
                    .sort((a, b) => b.assignedCount - a.assignedCount)
                    .slice(0, 5)
                    .map((expert, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                            {(idx + 1).toLocaleString('fa')}
                          </div>
                          <span className="font-medium text-sm">{expert.name}</span>
                        </div>
                        <span className="font-bold text-purple-600">
                          {expert.assignedCount.toLocaleString('fa')}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">بیشترین بسته شده</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredExperts
                    .sort((a, b) => b.closedCount - a.closedCount)
                    .slice(0, 5)
                    .map((expert, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                            {(idx + 1).toLocaleString('fa')}
                          </div>
                          <span className="font-medium text-sm">{expert.name}</span>
                        </div>
                        <span className="font-bold text-green-600">
                          {expert.closedCount.toLocaleString('fa')}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">بالاترین امتیاز</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredExperts
                    .sort((a, b) => b.avgRating - a.avgRating)
                    .slice(0, 5)
                    .map((expert, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold text-sm">
                            {(idx + 1).toLocaleString('fa')}
                          </div>
                          <span className="font-medium text-sm">{expert.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-yellow-600">
                            {expert.avgRating.toLocaleString('fa')}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs.Panel>

        {/* Locations Tab */}
        <Tabs.Panel value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>آمار شهرها و شعب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {staticCityDistData.map((city, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">{city.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {city.branches?.toLocaleString('fa')} شعبه
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {city.value.toLocaleString('fa')} تیکت
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all" 
                        style={{ 
                          width: `${(city.value / Math.max(...staticCityDistData.map(c => c.value))) * 100}%`,
                          backgroundColor: city.color 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Tabs.Panel>

        {/* Reservations Tab */}
        <Tabs.Panel value="reservations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="رزروهای امروز" 
              value={staticOverviewStats.todayReservations.toLocaleString('fa')} 
              icon={CheckCircle}
              color="purple"
            />
            <StatCard 
              title="نرخ حضور" 
              value="87%" 
              icon={CheckCircle}
              color="green"
            />
            <StatCard 
              title="رزروهای لغو شده" 
              value="8" 
              icon={AlertCircle}
              color="red"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>توزیع رزروها در ساعات مختلف</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { time: '08-09', تعداد: 12 },
                  { time: '09-10', تعداد: 28 },
                  { time: '10-11', تعداد: 45 },
                  { time: '11-12', تعداد: 52 },
                  { time: '12-13', تعداد: 38 },
                  { time: '13-14', تعداد: 15 },
                  { time: '14-15', تعداد: 42 },
                  { time: '15-16', تعداد: 48 },
                  { time: '16-17', تعداد: 35 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="تعداد" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Tabs.Panel>

        {/* Satisfaction Tab */}
        <Tabs.Panel value="satisfaction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>روند رضایت مشتریان</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={staticSatisfactionData.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    name="امتیاز"
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تحلیل پرسشنامه (میانگین امتیازات)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={staticSatisfactionData.questionnaire}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="score" name="امتیاز" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                    {staticSatisfactionData.questionnaire.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.score >= 4.5 ? '#10b981' : entry.score >= 4 ? '#3b82f6' : '#f59e0b'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Card key={rating}>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-2">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-3xl font-bold">
                    {staticSatisfactionData.distribution[rating as keyof typeof staticSatisfactionData.distribution]?.toLocaleString('fa') || '0'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {rating.toLocaleString('fa')} ستاره
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
};

export default TicketReportsPage;
