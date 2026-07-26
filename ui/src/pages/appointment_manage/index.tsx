import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import ReserveAppointmentPage from './ReserveAppointmentPage';
import AppointmentManageListPage from './list';

export default function AppointmentManageList() {
    
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
                <AppointmentManageListPage />
            </CardContent>
        </Card>
        </div>
    )
}