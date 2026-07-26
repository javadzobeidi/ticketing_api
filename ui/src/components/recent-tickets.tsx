import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { MessageSquare } from "lucide-react"

const tickets = [
  {
    id: "T-001",
    title: "عدم ورود به سیستم نظام مهندسی",
    city: "اهواز",
    branch: "شعبه مرکزی",
    status: "در حال بررسی",
    priority: "بسته",
    date: "1404/08/01",
  },
  {
    id: "T-002",
    title: "بررسی دوباره امیتاز",
    city: "اهواز",
    branch: "شعبه مرکزی",
    status: "بسته",
    priority: "متوسط",
    date: "1404/08/14",
  },
  {
    id: "T-003",
    title: "عدم ثبت اطلاعات نظارت",
    city: "اهواز",
    branch: "شعبه مرکزی",
    status: "تکمیل شده",
    priority: "پایین",
    date: "1404/08/30",
  },
]

export function RecentTickets({tickets}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">تیکت‌های اخیر</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Link key={ticket.id} to={ticket.isAdminRoute?`/tickets/manage/${ticket.code}`:`/tickets/${ticket.code}`}>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer hover:shadow-md hover:border-primary/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-muted-foreground">{ticket.id}</span>
                    <h3 className="font-semibold text-foreground">{ticket.message}</h3>
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  
                    <span>{ticket.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      ticket.status === "باز"
                        ? "default"
                        : ticket.status === "پاسخ کارشناس" ||  ticket.status === "ارجاع"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {ticket.status}
                  </Badge>
                 
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
