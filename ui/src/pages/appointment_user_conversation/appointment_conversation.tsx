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
import MessageItem from "@/src/components/message_item"

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

export function AppointmentUserConversationPage({ data }) {
 

const list=data.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">تیکت #</h1>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">فعال</Badge>
          </div>
          <p className="text-muted-foreground mt-2">مکالمه با مشتری</p>
        </div>
       
      </div>

    
      {/* Messages */}
      <Card className="p-6 min-h-[600px] bg-gradient-to-br from-muted/20 to-background">
        <div className="space-y-6">
        <MessageItem message={{ id: 0, sender: 'customer', user: list.user, time: list.time, date: list.date, message: list.description }} />

        {list.messages.map((message) => (
  <MessageItem
    message={{ ...message, sender: "user" }}
  />
))}



        </div>
      </Card>
    </div>
  )
}
