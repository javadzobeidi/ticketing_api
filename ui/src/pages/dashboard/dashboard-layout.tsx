"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Plus, Menu, X,Phone, Bell, Settings, LogOut, Sparkles, MessageSquare, Archive, Building2, CalendarClock, ClipboardList } from "lucide-react"
import logo from '@/src/assets/images/nezam_logo.jpg'
import { useUserInfo } from "@/src/lib/useQueries"
import { Header } from "./header"
import { apiServices } from "@/src/apis"
import { useQuery } from "@tanstack/react-query"
import { LoadingScreen } from "@/src/components/loading_screen"
import { Role } from "@/src/enums/roles"
import { useLogout } from "./useLogout"
import Cookies from "js-cookie";

const navigation = [
  { name: "داشبورد", href: "/", icon: LayoutDashboard,roles:[Role.User,Role.Admin,Role.UnitExpert,Role.UnitManager],permissions:"" },
   { name: "گزارشات کارشناسان ", href: "/reports/experts", icon: LayoutDashboard,roles:[Role.Admin] },
   { name: "گزارشات واحد ها", href: "/reports/departments", icon: LayoutDashboard,roles:[Role.Admin] },
   
  { name: "لیست کاربران", href: "/users", icon: Users ,roles:[Role.Admin],permissions:""},
  { name: "لیست واحد ها", href: "/units", icon: Archive ,roles:[Role.Admin],permissions:""},
  { name: "شعبه ها", href: "/branches", icon: Building2 ,roles:[Role.Admin],permissions:""},
    { name: "رزرو وقت حضوری", href: "/appointments/reserve", icon: CalendarClock ,roles:[Role.User],permissions:""},
  { name: "لیست وقت های حضوری", href: "/appointments", icon: CalendarClock ,roles:[Role.User],permissions:""},
  { name: "ایجاد وقت‌دهی", href: "/create-appointment", icon: Plus ,roles:[Role.Admin,Role.UnitManager],permissions:""},
  { name: "مدیریت وقت‌ها", href: "/manage-appointments", icon: ClipboardList ,roles:[Role.Admin,Role.UnitExpert,Role.UnitManager],permissions:""},
  { name: "تیکت جدید", href: "/tickets/new", icon: Plus ,roles:[Role.User,Role.Admin,Role.UnitExpert,Role.UnitManager],permissions:""},
  { name: "مدیریت تیکت ها", href: "/manage-tickets", icon: ClipboardList ,roles:[Role.Admin,Role.UnitExpert,Role.UnitManager],permissions:""},
  { name: "لیست تیکت‌ها", href: "/tickets", icon: MessageSquare ,roles:[Role.User],permissions:""},
    { name: "مدیریت الگو ", href: "/messagetemplates", icon: MessageSquare ,roles:[],permissions:"CanManageTemplate"},

]


export function DashboardLayout() {
    

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate();
  const logout = useLogout();


  const { data: userInfo, isLoading: userInfoLoading, error, isError } = useUserInfo();

  const { data: serverNow, isLoading } = useQuery({
    queryKey: ["persianDate"],
    queryFn: async () => {
      return apiServices.home.persianDate();
    },
    refetchInterval: 60 * 15000, // optional: refresh every minute
  });



  if (userInfoLoading) {
    return <LoadingScreen />
  }
  

  if (isError) {
    navigate("/login")
    return;
  }


if (!userInfo)
{
  return;

}


console.log("roles:",userInfo.permissions);


const filteredNavigation = navigation.filter(item => {
  const roleMatch = item.roles.includes(userInfo.roleId);

  const permissionMatch =userInfo.permissions.includes(item.permissions);

  


  return roleMatch || permissionMatch;
});




  return (
    <div className="min-h-screen bg-background">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-card border-l-2 border-border shadow-2xl transform transition-transform duration-300 ease-out lg:translate-x-0 ",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b-2 border-border bg-gradient-to-l from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl   shadow-lg shadow-primary/30 flex items-center justify-center">
                <img src={logo} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div>
                <span className="font-bold text-lg text-foreground block leading-tight">سیستم تیکتینگ</span>
                <span className="text-xs text-muted-foreground">مدیریت هوشمند</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-12 text-base transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "hover:bg-muted hover:translate-x-[-4px]",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t-2 border-border bg-gradient-to-l from-muted/30 to-transparent">
            <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-card hover:bg-muted/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ع</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{userInfo?.firstName} {userInfo?.lastName}</p>
                <p className="text-xs text-muted-foreground">{userInfo?.role}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-transparent hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all"
              size="sm"
              onClick={()=>logout.mutate()}
            >
              <LogOut className="w-4 h-4" />
              خروج از حساب
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:mr-72">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="p-6 lg:p-8">

          <Outlet context={{ serverNow ,userInfo}}/>

        </main>

            <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span> {new Date().getFullYear()} © تمامی حقوق مادی و معنوی این سامانه نزد سامانه نظام مهندسی خوزستان محفوظ است</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>در صورت بروز مشکل در سامانه تیکتینگ با شماره</span>
                <a 
                  href="tel:06191010456" 
                  className="font-semibold text-primary hover:underline transition-colors"
                >
                  061-91010456
                </a>
                <span>داخلی</span>
                <span className="font-semibold text-primary">1021</span>
                <span>تماس بگیرید.</span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}

