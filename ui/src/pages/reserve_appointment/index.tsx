import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import ReserveAppointmentPage from './ReserveAppointmentPage';

export default function ReserveAppointment() {
    
    return (
        <div className="max-w-3xl">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>رزرو وقت حضوری</CardTitle>
                </div>
                <CardDescription>برای دریافت خدمات، لطفا فرم زیر را تکمیل و ارسال نمایید.</CardDescription>
            </CardHeader>
            <CardContent>
                <ReserveAppointmentPage />
            </CardContent>
        </Card>
        </div>
    )
}