import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import ReserveAppointmentPage from './ReserveAppointmentPage';
import AppointmentListPage from './AppointmentListPage';

export default function AppointmentList() {
    
    return (
        <div className="">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>رزرو وقت حضوری</CardTitle>
                </div>
                <CardDescription>لیست وضعیت وقت های گرفته شده</CardDescription>
            </CardHeader>
            <CardContent>
                <AppointmentListPage />
            </CardContent>
        </Card>
        </div>
    )
}