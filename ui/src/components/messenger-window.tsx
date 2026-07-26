import { useState } from "react";
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import React from 'react';
import ReactDOM from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  customerName: string;
  title: string;
  avatar: string;
  color: string;
}

interface Message {
  sender: "user" | "customer";
  text: string;
}

interface MessengerWindowProps {
  user: User;
  onClose: () => void;
}

export function MessengerWindow({ user, onClose }: MessengerWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "customer", text: `سلام، من در مورد "${user.title}" سوالی داشتم.` },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user's message
    setMessages((prev) => [...prev, { sender: "user", text: inputValue }]);
    setInputValue("");

    // Simulate customer response after a short delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "customer", text: "ممنون از پاسخ شما." }]);
    }, 1500);
  };

  return (
     <Draggable
        axis="x"
        handle=".handle"
        defaultPosition={{x: 0, y: 0}}
      
        grid={[25, 25]}
        scale={1}
       >

    
      <Card className="fixed bottom-4 right-4 w-96 bg-card shadow-2xl border-2 z-50 flex flex-col">
        <CardHeader className="drag-handle cursor-move flex flex-row items-center justify-between p-3 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={`text-white font-bold ${user.color}`}>{user.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-bold text-foreground">{user.customerName}</CardTitle>
              <p className="text-xs text-muted-foreground">{user.title}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-3 flex-1 h-80 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="p-3 border-t">
          <div className="flex items-center gap-2">
            <Input
              placeholder="پیام خود را تایپ کنید..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
            </Draggable>

  );
}
