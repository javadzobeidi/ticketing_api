import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { ComboboxField, Input } from '@/src/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { apiServices } from '@/src/apis';
import { Controller, useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketStatusList } from '@/src/enums';
import { Loader2, Star } from 'lucide-react';
import RatingModal from '../components/rating_modal';
type AppointmentItem = {
  id: number | string;
  code: string;
  dateTime?: string;
  date?: string;
  time?: string;
  city?: string;
  branch?: string;
  department?: string;
  unit?: string;
  status?: string;
  response?: string;
  user?: string;
  lastAssignmentUser?: string;
  responseLastUser?: string;
  score?: number;
  hasRating?: boolean; // Whether user has submitted rating
};


const statusVariant = (status?: string) => {
  switch (status) {
    case 'رزرو شده':
      return 'success';
    case 'لغو شده':
      return 'destructive';
    case 'بسته':
      return 'success';
    default:
      return 'secondary';
  }
};

// Star Rating Component

// Questionnaire Questions


// Rating Modal Component


const TicketListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  const { control, watch, reset } = useForm<{ status: number }>({
    defaultValues: { status: -1 }
  });

  const status = watch("status");

  const {
    data: tickets,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tickets", status],
    queryFn: () => apiServices.ticket.listbyUser({ status: status }),
    enabled: !!status,
  });

  // Mutation for submitting rating
  const ratingMutation = useMutation({
    mutationFn: (data: QuestionnaireData) =>
      apiServices.ticket.submitRating(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      setSelectedTicket(null);
      // Show success message (you can use toast here)
      alert('ارزیابی شما با موفقیت ثبت شد');
    },
    onError: (error) => {
      alert('خطا در ثبت ارزیابی');
    },
  });

  const handleOpenRatingModal = (ticketCode: any) => {
    setSelectedTicket(ticketCode);
  };

  const handleSubmitRating = (data: QuestionnaireData) => {
    ratingMutation.mutate(data);
  };

  
  return (
    <div dir="rtl" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <ComboboxField
                options={ticketStatusList || []}
                placeholder="انتخاب وضعیت"
                idKey="id"
                titleKey="title"
                value={field.value}
                isLoading={false}
                onChange={(value) => field.onChange(value ? parseInt(value) : null)}
              />
            )}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
             <TableHead>شماره تیکت</TableHead>
            <TableHead>کاربر</TableHead>
            <TableHead>تاریخ و ساعت</TableHead>
            <TableHead>شعبه</TableHead>
            <TableHead>واحد</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>کارشناس</TableHead>
            <TableHead>پاسخ دهنده</TableHead>
            {/* <TableHead>ارزیابی</TableHead> */}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9}>
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="mr-2 text-muted-foreground">در حال بارگذاری...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={9}>
                <div className="text-center p-12">
                  <div className="text-destructive text-lg font-semibold">خطا در بارگذاری داده‌ها</div>
                  <p className="text-muted-foreground mt-2">{error?.message || "خطای نامشخص رخ داده است"}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {tickets?.data.map((app) => {
                console.log("A",app)
                const dateTime = app.dateTime || `${app.date || ''} ${app.time || ''}`;
                return (
                  <TableRow key={app.code}>
                    <TableCell className="font-medium">{app.id}</TableCell>
                    <TableCell className="font-medium">{app.user}</TableCell>
                    <TableCell className="font-medium">{dateTime}</TableCell>
                    <TableCell>{[app.city, app.branch].filter(Boolean).join(' - ')}</TableCell>
                    <TableCell>{app.department}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(app.status)} >{app.status || '-'}</Badge>
                    </TableCell>
                    <TableCell>{app.lastAssignmentUser || '-'}</TableCell>
                    <TableCell>{app.responseLastUser || '-'}</TableCell>
                    {/* <TableCell>
                    
                      {app.hasRating &&
                        <div className="flex items-center gap-2">
                          <StarRating value={app.score || 0} readonly size="small" />
                          <Badge variant="secondary" className="text-xs">ثبت شده</Badge>
                        </div>}

                        {app.statusId===4 && 
                      
               
                         <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOpenRatingModal({code:app.code,id:app.id})}
                          className="text-xs"
                        >
                          ثبت ارزیابی
                        </Button> 

                        }
                    </TableCell> */}
                    <TableCell className="text-left">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/tickets/${app.code}`)}>
                        جزئیات
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {tickets?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    موردی یافت نشد
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>

      {/* Rating Modal */}
      <RatingModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticketCode={selectedTicket || ''}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

export default TicketListPage;