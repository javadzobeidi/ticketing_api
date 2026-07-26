import { useParams } from 'react-router-dom';
import { AppointmentConversation } from '@/src/pages/appointment_manage/appointment-conversation';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from "@/src/components/ui/badge"
import { useQuery } from '@tanstack/react-query';
import { apiServices } from '@/src/apis';
import { useEffect } from 'react';
import { LoadingScreen } from '@/src/components/loading_screen';

const AppointmentManagerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  
const {
  data: appointment,
isLoading,
    isError,
    isFetching,
    error,
}= useQuery({
  queryKey: ["appointment", id],
  queryFn: () => apiServices.appointment.details(id), // Use non-null assertion if confident
  enabled: !!id && id !== '', // More explicit check
});

  if (isLoading || isFetching) {
    return <LoadingScreen />
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>جزئیات نوبت </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">مشاهده مکالمه و جزئیات مرتبط با این نوبت.</p>
          <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-foreground">مکالمه نوبت</h2>
        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">{appointment.data.status}</Badge>
      </div>
        </CardContent>
      </Card>

      {id && <AppointmentConversation data={appointment.data}   />}
    </div>
  );
};

export default AppointmentManagerDetailsPage;


