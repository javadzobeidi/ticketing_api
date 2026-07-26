import { StatsCards } from "@/src/components/stats-cards"
import { RecentTickets } from "@/src/components/recent-tickets"
import { OnlineUsers } from "@/src/components/online-users"
import { useQuery } from "@tanstack/react-query";
import { apiServices } from "@/src/apis";
import { LoadingScreen } from "../components/loading_screen";
import { Ticket, Users, CheckCircle, Clock } from "lucide-react"



export default function HomePage() {
 
  const { data, isLoading, error } = useQuery({
    queryKey: ["roles"],
    queryFn: () => apiServices.dashboard.user(),
  });
  
  if (isLoading)
  {
    return <LoadingScreen />
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">خطا در بارگذاری اطلاعات</div>
          <div className="text-gray-600">{error.message}</div>
        </div>
      </div>
    )
  }
  const stats = [
  {
    name: "مجموع تیکت‌ها",
    value:data.ticketCount,
    icon: Ticket,
        change: "+10%",

    changeType: "positive",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "کاربران فعال",
    value: data.activeUsers,
    icon: Users,
    change: "+10%",
    changeType: "positive",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
  },
  {
    name: "تعداد نوبت ها",
    value: data.appointmentCount,
    icon: CheckCircle,
    change: "+0%",
    changeType: "positive",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-500/10",
  },
  
]



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">داشبورد</h1>
        <p className="text-muted-foreground mt-2">به سیستم مدیریت تیکت خوش آمدید</p>
      </div>

      <StatsCards stats={stats}/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <RecentTickets tickets={data.recentTickets}/>
        </div>
        {/* <div>
          <OnlineUsers />
        </div> */}
      </div>
    </div>
  )
}
