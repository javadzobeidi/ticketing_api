import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { AlertModal, Input } from '@/src/components/ui';
import { PersianDatePicker } from '@/src/components/ui';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { apiServices } from '@/src/apis';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { AlertDialog } from '@/src/components/ui/alert-dialog';
import RatingModal from '../components/rating_modal';

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


  const {
    data: appointments,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appointments", "",""],
    queryFn: () => apiServices.appointment.listByUser({ startDate: "", endDate: ""}),
    enabled: true,
  });

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: number | string) => apiServices.appointment.cancel(appointmentId),
    onSuccess: () => {
      refetch();
      setCancelDialogOpen(false);
      setSelectedAppointmentId(null);
    },
    onError: (error) => {
    setCancelDialogOpen(false);
          setSelectedAppointmentId(null);

    }
  });

  const handleCancelClick = (code: number | string) => {
   setSelectedAppointmentId(code)
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
  const handleSubmitRating = (data: any) => {
  };

  
  const handleOpenRatingModal = (code: any) => {
    setSelectedAppointmentId(code);
  };



  
  return (
    <div dir="rtl" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      </div>

 <RatingModal
        isOpen={!!selectedAppointmentId}
        onClose={() => setSelectedAppointmentId(null)}
        ticketCode={selectedAppointmentId || ''}
        onSubmit={handleSubmitRating}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>تاریخ و ساعت</TableHead>
            <TableHead>شعبه</TableHead>
            <TableHead>واحد</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>پاسخ دهنده</TableHead>
            {/* <TableHead>ارزیابی</TableHead> */}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments?.data.map((app) => {
            const dateTime = app.dateTime || `${app.date || ''} ${app.time || ''}`;
            const canCancel = app.statusId === 1;
            
            return (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{dateTime}</TableCell>
                <TableCell>{[app.city, app.branch].filter(Boolean).join(' - ')}</TableCell>
                <TableCell>{app.department}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(app.status)}>{app.status || '-'}</Badge>
                </TableCell>
                <TableCell>{app.responseLastUser || '-'}</TableCell>
                {/* <TableCell>
                  
                         <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOpenRatingModal({code:app.code,id:app.id})}
                          className="text-xs"
                        >
                          ثبت ارزیابی
                        </Button> 


                </TableCell> */}
                <TableCell className="text-left">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/appointments/conversation/${app.code}`)}>
                      جزئیات
                    </Button>
                    {canCancel && (
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleCancelClick(app.code)}
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

        <AlertModal
                                type={cancelMutation.isError ? "error" : undefined}
                                message={
                                    cancelMutation.isError
                                        ? cancelMutation.error?.message : ""

                                }
                                show={cancelMutation.isError}
                                onClose={() => {
                                    cancelMutation.reset();
                                }}
                                autoClose={true}
                                autoCloseDelay={5000}
                            />


     <AlertDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="لغو نوبت"
        description="آیا از لغو این نوبت اطمینان دارید؟ این عملیات قابل بازگشت نیست."
        isLoading={cancelMutation.isPending}
        buttons={[
          {
            text: cancelMutation.isPending ? 'در حال لغو...' : 'بله، لغو شود',
            onClick: handleConfirmCancel,
            variant: 'destructive',
            className: 'flex-1',
          },
          {
            text: 'خیر',
            onClick: handleCancelDialog,
            variant: 'outline',
            className:"flex-1"
          },
        ]}
      />
    </div>
  );
};

export default AppointmentListPage;