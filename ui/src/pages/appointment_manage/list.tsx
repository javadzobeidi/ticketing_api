import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui';
import { PersianDatePicker } from '@/src/components/ui';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { apiServices } from '@/src/apis';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

type AppointmentItem = {
  id: number | string;
  dateTime?: string;
  date?: string;
  time?: string;
  city?: string;
  branch?: string;
  unit?: string;
  status?: string;
  response?: string;
};

const statusVariant = (status?: string) => {
  switch (status) {
    case 'رزرو شده':
      return 'success';
    case 'لغو شده':
      return 'destructive';
    case 'پایان مراجعه':
      return 'default';
    default:
      return 'secondary';
  }
};




const AppointmentManageListPage = () => {
  const navigate = useNavigate();

  const { serverNow } = useOutletContext();

  const { control, watch, reset } = useForm<{ startDate: string; endDate: string }>({
    defaultValues: { startDate: serverNow, endDate: serverNow }
  });
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const {
    data: appointments,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appointments", startDate, endDate],
    queryFn: () => apiServices.appointment.listByManage( {startDate:startDate,endDate:endDate}),
    enabled: !!startDate && !!endDate, 
  });


  
  console.log("appointments:",appointments)
  
  return (
    <div dir="rtl" className="space-y-6">
     
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <PersianDatePicker name="startDate" control={control as any} errors={{}} label="از تاریخ" />
            </div>
            <div>
              <PersianDatePicker name="endDate" control={control as any} errors={{}} label="تا تاریخ" />
            </div>
            <div className="md:col-span-2 grid grid-cols-3 gap-2 max-w-lg">
              <Button disabled={isLoading || isFetching} isLoading={isLoading || isFetching} onClick={()=> refetch()}>فیلتر</Button>
              <Button variant="outline" onClick={() => { reset(); }}>پاک کردن</Button>
              <Button variant="outline" onClick={() => navigate('/appointments/reserve')}>رزرو نوبت</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                 <TableHead> کاربر </TableHead>

                <TableHead>تاریخ و ساعت</TableHead>

                <TableHead>شعبه</TableHead>
                <TableHead>واحد</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>پاسخ دهنده</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments?.data.map((app) => {
                const dateTime = app.dateTime || `${app.date || ''} ${app.time || ''}`;
                return (
                  <TableRow key={app.code}>
                    <TableCell className="font-medium">{app.user}</TableCell>

                    <TableCell className="font-medium">{dateTime}</TableCell>
                    <TableCell>{[app.city, app.branch].filter(Boolean).join(' - ')}</TableCell>
                    <TableCell>{app.department}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(app.status)}>{app.status || '-'}</Badge>
                    </TableCell>
                    <TableCell>{app.responseLastUser || '-'}</TableCell>
                    <TableCell className="text-left">
                      
                    {app.statusId!==1 &&  <Button size="sm" variant="outline" onClick={() => navigate(`/appointments/manager/${app.code}`)}>جزئیات</Button> }
                    </TableCell>
                  </TableRow>
                );
              })}
              {appointments?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">موردی یافت نشد</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
   
    </div>
  );
};

export default AppointmentManageListPage;


