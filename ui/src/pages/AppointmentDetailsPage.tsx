import { useParams } from 'react-router-dom';
import { AppointmentConversation } from '@/src/pages/appointment_manage/appointment-conversation';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from "@/src/components/ui/badge"

const AppointmentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div dir="rtl" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>جزئیات نوبت #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">مشاهده مکالمه و جزئیات مرتبط با این نوبت.</p>


          <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-foreground">مکالمه نوبت </h2>
        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">فقط خواندنی</Badge>
      </div>


        </CardContent>
      </Card>

      {id && <AppointmentConversation appointmentId={id} />}
    </div>
  );
};

export default AppointmentDetailsPage;


