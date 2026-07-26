import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import TicketListPage from './list'
import { Button } from '@/src/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function TicketUserList() {
    const navigate=useNavigate();
    return (
        <div className="">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>لیست تیکت ها</CardTitle>
                   
              <Button variant="outline" onClick={() => navigate('/tickets/new')}>ثبت تیکت </Button>
        
                </div>
                <CardDescription>لیست تیکت ها</CardDescription>
            </CardHeader>
            <CardContent>
                <TicketListPage />
            </CardContent>
        </Card>
        </div>
    )
}