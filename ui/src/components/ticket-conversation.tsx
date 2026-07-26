"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { Paperclip, Send, FileText, Download, Clock, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender: "user" | "customer"
  senderName: string
  content: string
  attachment?: {
    name: string
    url: string
  }
  timestamp: string
  read: boolean
}

export function TicketConversation({ ticketId, readOnly = false }: { ticketId: string; readOnly?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "customer",
      senderName: "رضا احمدی",
      content: "سلام، من مشکلی با سیستم دارم. نمی‌توانم وارد حساب کاربری خود شوم.",
      timestamp: "۱۴۰۳/۱۲/۱۵ - ۱۰:۳۰",
      read: true,
    },
    {
      id: "2",
      sender: "user",
      senderName: "پشتیبانی - علی محمدی",
      content: "سلام رضا عزیز، ممنون که با ما تماس گرفتید. لطفاً نام کاربری خود را برای ما ارسال کنید تا بررسی کنیم.",
      timestamp: "۱۴۰۳/۱۲/۱۵ - ۱۰:۳۵",
      read: true,
    },
    {
      id: "3",
      sender: "customer",
      senderName: "رضا احمدی",
      content: "نام کاربری من reza.ahmadi است. همچنین یک اسکرین‌شات از خطا را ضمیمه کردم.",
      attachment: {
        name: "error-screenshot.png",
        url: "#",
      },
      timestamp: "۱۴۰۳/۱۲/۱۵ - ۱۰:۴۰",
      read: true,
    },
    {
      id: "4",
      sender: "user",
      senderName: "پشتیبانی - علی محمدی",
      content: "متشکرم. مشکل را بررسی کردیم و حساب شما را بازیابی کردیم. لطفاً دوباره تلاش کنید.",
      timestamp: "۱۴۰۳/۱۲/۱۵ - ۱۱:۰۰",
      read: false,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [attachment, setAttachment] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: "user",
      senderName: "پشتیبانی - علی محمدی",
      content: newMessage,
      timestamp: new Date().toLocaleString("fa-IR"),
      read: false,
      ...(attachment && {
        attachment: {
          name: attachment.name,
          url: "#",
        },
      }),
    }

    setMessages([...messages, message])
    setNewMessage("")
    setAttachment(null)
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">تیکت #{ticketId}</h1>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">فعال</Badge>
          </div>
          <p className="text-muted-foreground mt-2">مکالمه با مشتری</p>
        </div>
        {!readOnly && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
                <Send className="w-4 h-4" />
                پاسخ جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">افزودن پاسخ جدید</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">
                    توضیحات
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="پاسخ خود را اینجا بنویسید..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[150px] resize-none text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment" className="text-base font-semibold">
                    پیوست (اختیاری)
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="attachment"
                      type="file"
                      onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {attachment && (
                      <Badge variant="secondary" className="gap-2">
                        <Paperclip className="w-3 h-3" />
                        {attachment.name}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 gap-2 shadow-lg">
                    <Send className="w-4 h-4" />
                    ارسال پاسخ
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    انصراف
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Ticket Info Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">شهر</p>
            <p className="font-semibold text-foreground">تهران</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">واحد</p>
            <p className="font-semibold text-foreground">پشتیبانی فنی</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">شعبه</p>
            <p className="font-semibold text-foreground">شعبه مرکزی</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">تاریخ ایجاد</p>
            <p className="font-semibold text-foreground">۱۴۰۳/۱۲/۱۵</p>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <Card className="p-6 min-h-[600px] bg-gradient-to-br from-muted/20 to-background">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500", {
                "flex-row-reverse": message.sender === "user",
              })}
            >
              <Avatar
                className={cn("w-12 h-12 shadow-lg ring-2 ring-offset-2", {
                  "ring-primary": message.sender === "user",
                  "ring-accent": message.sender === "customer",
                })}
              >
                <AvatarFallback
                  className={cn("font-bold text-lg", {
                    "bg-gradient-to-br from-primary to-blue-600 text-white": message.sender === "user",
                    "bg-gradient-to-br from-accent to-purple-600 text-white": message.sender === "customer",
                  })}
                >
                  {message.senderName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div
                className={cn("flex-1 max-w-[70%] space-y-2", {
                  "items-end": message.sender === "user",
                })}
              >
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground">{message.senderName}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {message.timestamp}
                  </div>
                </div>

                <Card
                  className={cn("p-4 shadow-md transition-all hover:shadow-lg", {
                    "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-primary":
                      message.sender === "user",
                    "bg-card border-2": message.sender === "customer",
                  })}
                >
                  <p className="text-base leading-relaxed">{message.content}</p>

                  {message.attachment && (
                    <div className="mt-4 pt-4 border-t border-current/20">
                      <div
                        className={cn("flex items-center gap-3 p-3 rounded-lg transition-colors", {
                          "bg-white/10 hover:bg-white/20": message.sender === "user",
                          "bg-muted hover:bg-muted/80": message.sender === "customer",
                        })}
                      >
                        <FileText className="w-5 h-5" />
                        <span className="flex-1 text-sm font-medium">{message.attachment.name}</span>
                        <Button
                          size="sm"
                          variant={message.sender === "user" ? "secondary" : "outline"}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          دانلود
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {message.sender === "user" && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                    <CheckCheck className={cn("w-4 h-4", message.read ? "text-primary" : "")} />
                    {message.read ? "خوانده شده" : "ارسال شده"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
