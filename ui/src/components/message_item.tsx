import { FileText, Download, Clock, CheckCheck, ArrowRight, CheckCircle, XCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"

const MessageItem = ({ message }: { message: any }) => {
    return (
      <div
        key={message.id}
        className={cn("flex gap-4", {
          "flex-row-reverse": message.sender === "user",
        })}
      >
        <Avatar
          className={cn("w-10 h-10 ring-2 ring-offset-2", {
            "ring-primary": message.sender === "user",
            "ring-accent": message.sender === "customer",
          })}
        >
          <AvatarFallback
            className={cn("font-bold", {
              "bg-gradient-to-br from-primary to-blue-600 text-white": message.sender === "user",
              "bg-gradient-to-br from-accent to-purple-600 text-white": message.sender === "customer",
            })}
          >
            {message.user.charAt(0)}
          </AvatarFallback>
        </Avatar>
  
        <div
          className={cn("flex-1 max-w-[70%] space-y-2", {
            "items-end": message.sender === "user",
          })}
        >
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-foreground">{message.user}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {message.date}  <span className="font-bold">{message.time}</span>
            </div>
          </div>
  
          <Card
            className={cn("p-4 shadow-sm", {
              "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-primary":
                message.sender === "user",
              "bg-card border-2": message.sender === "customer",
            })}
          >
            <p className="text-sm leading-relaxed">{message.message}</p>
  
            {message.attachment && (
              <div className="mt-4 pt-4 border-t border-current/20">
                <div
                  className={cn("flex items-center gap-3 p-3 rounded-lg", {
                    "bg-white/10": message.sender === "user",
                    "bg-muted": message.sender === "customer",
                  })}
                >
                  <FileText className="w-5 h-5" />
                  <span className="flex-1 text-sm font-medium">{message.attachment.name}</span>
                  <Button size="sm" variant={message.sender === "user" ? "secondary" : "outline"} className="gap-2">
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
  
    )
  }
  export default MessageItem;