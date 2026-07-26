import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import TicketManageListPage from './list';

export default function TicketManageList() {
    
    return (
        <div className="">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>لیست تیکت ها</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <TicketManageListPage />
            </CardContent>
        </Card>
        </div>
    )
}