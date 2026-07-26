import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { MessageSquare } from "lucide-react";
import { MessengerWindow } from "./messenger-window";

const onlineUsers = [
  {
    customerName: "مریم رضایی",
    title: "مشکل در پرداخت",
    time: "2 دقیقه پیش",
    status: "در انتظار پاسخ",
    avatar: "م",
    color: "bg-pink-500",
  },
  {
    customerName: "احمد کریمی",
    title: "سوال در مورد محصول",
    time: "5 دقیقه پیش",
    status: "در انتظار پاسخ",
    avatar: "ا",
    color: "bg-indigo-500",
  },
  {
    customerName: "زهرا حسینی",
    title: "نیاز به راهنمایی",
    time: "10 دقیقه پیش",
    status: "در انتظار پاسخ",
    avatar: "ز",
    color: "bg-teal-500",
  },
];

interface User {
  customerName: string;
  title: string;
  avatar: string;
  color: string;
}

export function OnlineUsers() {
  const [openChats, setOpenChats] = useState<User[]>([]);

  const handleOpenChat = (user: User) => {
    if (!openChats.find((chat: User) => chat.customerName === user.customerName)) {
      setOpenChats((prev: User[]) => [...prev, user]);
    }
  };

  const handleCloseChat = (customerName: string) => {
    setOpenChats((prev: User[]) => prev.filter((chat: User) => chat.customerName !== customerName));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">کاربران آنلاین در انتظار پاسخ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {onlineUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className={`h-12 w-12`}>
                    <AvatarFallback className={`text-white font-bold text-lg ${user.color}`}>{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{user.customerName}</p>
                    <p className="text-sm text-muted-foreground">{user.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                      <p className="text-sm text-muted-foreground">{user.time}</p>
                      <Badge variant="outline" className="mt-1 border-yellow-500 text-yellow-500">{user.status}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10" onClick={() => handleOpenChat(user)}>
                      <MessageSquare className="w-5 h-5 text-primary" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="fixed bottom-0 right-0 p-4 space-x-4 flex items-end">
        {openChats.map((user: User) => (
          <MessengerWindow
            key={user.customerName}
            user={user}
            onClose={() => handleCloseChat(user.customerName)}
          />
        ))}
      </div>
    </>
  );
}
