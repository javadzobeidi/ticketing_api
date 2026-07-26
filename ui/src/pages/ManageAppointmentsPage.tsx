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
import { useQuery, useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/src/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog';

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
    case 'تایید شده':
      return 'success';
    case 'لغو شده':
      return 'destructive';
    case 'در انتظار':
      return 'default';
    default:
      return 'secondary';
  }
};

const AppointmentListPage = () => {
  const navigate = useNavigate();
  const { serverNow } = useOutletContext();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | string | null>(null);

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
    queryFn: () => apiServices.appointment.listByUser({ startDate: startDate, endDate: endDate }),
    enabled: !!startDate && !!endDate,
  });

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: number | string) => apiServices.appointment.cancel(appointmentId),
    onSuccess: () => {
      refetch();
      setCancelDialogOpen(false);
      setSelectedAppointmentId(null);
    },
    onError: (error) => {
      console.error('Error canceling appointment:', error);
      // TODO: Show error toast/notification
    }
  });

  const handleCancelClick = (appointmentId: number | string) => {
    setSelectedAppointmentId(appointmentId);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedAppointmentId) {
      cancelMutation.mutate(selectedAppointmentId);
    }
  };

  const handleCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedAppointmentId(null);
  };



  return (
    <div dir="rtl" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <PersianDatePicker name="startDate" control={control as any} errors={{}} label="از تاریخ" />
        </div>
        <div>
          <PersianDatePicker name="endDate" control={control as any} errors={{}} label="تا تاریخ" />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-2 max-w-lg">
          <Button disabled={isLoading || isFetching} isLoading={isLoading || isFetching} onClick={() => refetch()}>فیلتر</Button>
          <Button variant="outline" onClick={() => { reset(); }}>پاک کردن</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
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
            const canCancel = app.status !== 'لغو شده';
            
            return (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{dateTime}</TableCell>
                <TableCell>{[app.city, app.branch].filter(Boolean).join(' - ')}</TableCell>
                <TableCell>{app.department}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(app.status)}>{app.status || '-'}</Badge>
                </TableCell>
                <TableCell>{app.responseLastUser || '-'}</TableCell>
                <TableCell className="text-left">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/appointments/conversation/${app.code}`)}>
                      جزئیات
                    </Button>
                    {canCancel && (
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleCancelClick(app.id)}
                        disabled={cancelMutation.isPending}
                      >
                        <X className="h-4 w-4 ml-1" />
                        لغو
                      </Button>
                    )}
                  </div>
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

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">لغو نوبت</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-base">
              آیا از لغو این نوبت اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </p>
          </div>
          <DialogFooter className="flex gap-3">
            <Button 
              type="button" 
              onClick={handleConfirmCancel} 
              disabled={cancelMutation.isPending}
              variant="destructive"
              className="flex-1"
            >
              {cancelMutation.isPending ? 'در حال لغو...' : 'بله، لغو شود'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancelDialog}
              disabled={cancelMutation.isPending}
            >
              خیر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>لغو نوبت</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از لغو این نوبت اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDialog} disabled={cancelMutation.isPending}>
              خیر
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? 'در حال لغو...' : 'بله، لغو شود'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentListPage;