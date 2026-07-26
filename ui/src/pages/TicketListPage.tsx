import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";

const tickets = [
  {
    id: "T-001",
    customer: "علی محمدی",
    title: "مشکل در ورود به سیستم",
    dateTime: "1403/02/18 - 10:30",
    status: "در حال بررسی",
  },
  {
    id: "T-002",
    customer: "فاطمه احمدی",
    title: "خطا در هنگام ثبت سفارش جدید",
    dateTime: "1403/02/18 - 09:15",
    status: "جدید",
  },
  {
    id: "T-003",
    customer: "محمد رضایی",
    title: "درخواست گزارش فروش ماهانه",
    dateTime: "1403/02/17 - 14:00",
    status: "تکمیل شده",
  },
  {
    id: "T-004",
    customer: "سارا کریمی",
    title: "عدم کارکرد صحیح بخش جستجو",
    dateTime: "1403/02/17 - 11:45",
    status: "در حال بررسی",
  },
  {
    id: "T-005",
    customer: "حسین نوری",
    title: "سوال در مورد نحوه استفاده از API",
    dateTime: "1403/02/16 - 16:20",
    status: "پاسخ داده شده",
  },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "تکمیل شده":
    case "پاسخ داده شده":
      return "default";
    case "در حال بررسی":
      return "secondary";
    case "جدید":
      return "outline";
    default:
      return "secondary";
  }
};

export default function TicketListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">لیست تیکت‌ها</h1>
        <p className="text-muted-foreground mt-2">مدیریت و پیگیری تمام تیکت‌های پشتیبانی</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>همه تیکت‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-muted-foreground">
                <tr className="border-b">
                  <th className="px-4 py-3 font-medium">شناسه</th>
                  <th className="px-4 py-3 font-medium">مشتری</th>
                  <th className="px-4 py-3 font-medium">عنوان</th>
                  <th className="px-4 py-3 font-medium">تاریخ و ساعت</th>
                  <th className="px-4 py-3 font-medium">وضعیت</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      <Link to={`/tickets/${ticket.id}`} className="hover:underline">{ticket.id}</Link>
                    </td>
                    <td className="px-4 py-3">{ticket.customer}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      <Link to={`/tickets/${ticket.id}`} className="hover:text-primary">{ticket.title}</Link>
                    </td>
                    <td className="px-4 py-3">{ticket.dateTime}</td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/tickets/${ticket.id}`}>مشاهده مکالمه</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>تغییر وضعیت</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
