"use client"

import { useRef, useState } from "react"
import { Card } from "@/src/components/ui/card"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Input ,Badge} from "@/src/components/ui"


import { Dialog, DialogContent, DialogHeader, DialogTitle,DialogTrigger } from "@/src/components/ui/dialog"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { ComboboxField } from "@/src/components/ui/Combobox"
import { FileText, Download, Clock, CheckCheck, ArrowRight, CheckCircle, XCircle ,Send,Paperclip,Phone} from "lucide-react"
import { cn } from "@/lib/utils"
import { apiServices } from "@/src/apis"
import { useMutation } from "@tanstack/react-query"
import { AlertModal } from "@/src/components/ui"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useCities, useBranchByCity, useUserDepartmentById, useUserDepartmentByCity } from "@/src/lib/useQueries"
import { triggerFileDownload } from "@/src/lib/downloadUtils"


export function TicketUserConversation({ data,onRefetch }: { data: any,onRefetch:any }) {

  const [isAnswerModal, setIsAnswerModal] = useState(false)
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false)
  

  const handleAction = (action: string) => {
    if (action === "پایان مراجعه") {
      setIsAnswerModal(true)
    } else if (action === "ارجاع") {
      setIsReferralModalOpen(true)
    } else {
      console.log(`Action: ${action}`)
    }
  }



  return (
    <div className="space-y-6">
      {/* Action Buttons */}

      {data.canProcess &&  <Card className="p-4">
        <div className="flex gap-3 justify-center">

          <Button
            onClick={() => handleAction("پایان مراجعه")}
            variant="outline"
            className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
          >
            <Send className="w-4 h-4" />
            ارسال پیام
          </Button>

       
        </div>
      </Card>}

      <Card className="p-6 min-h-[400px] bg-gradient-to-br from-muted/20 to-background">
        <div className="space-y-6">

          {
            data.messages.map((message: any) => {
              return <MessageItem sender={data.user} key={message.id} message= {{ ...message, sender: message.isFromStuff?"user":"customer"}} />
            })


          }


        </div>
      </Card>

      <AnswerModal
        isModalOpen={isAnswerModal}
        setIsModalOpen={setIsAnswerModal}
        onRefetch={onRefetch}
        appointmentId={data.code}
      />

      <ReferralModal
        isModalOpen={isReferralModalOpen}
        setIsModalOpen={setIsReferralModalOpen}
       
        appointmentId={data.id}
      />

    </div>
  )
}

const MessageItem = ({ message,sender }: { message: any,sender:any }) => {
 const isCallMessage = message.messageType !== 1;
  if (isCallMessage) {
    return (
      <div key={message.id} className="flex justify-center my-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-400/50 text-muted-foreground text-sm">
          <Phone className="w-4 h-4" />
          <span>تماس با {sender}</span>
          <span className="text-xs">• {message.time}</span>
        </div>
      </div>
    );
  }


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
            {message.attachment.map((att=>{
            return (
                <div className="pt-2  border-current/20">
              <div
                className={cn("flex items-center gap-3 p-3 rounded-lg", {
                  "bg-white/10": message.sender === "user",
                  "bg-muted": message.sender === "customer",
                })}
              >
                <FileText className="w-5 h-5" />
                <span className="flex-1 text-sm font-medium">{att.fileName}</span>
                <Button
                  onClick={() => triggerFileDownload(att.url)}
                  size="sm" variant={message.sender === "user" ? "secondary" : "outline"} className="gap-2">
                  <Download className="w-4 h-4" />
                  دانلود
                </Button>
              </div>
            </div>

            )
          }))}


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

function AnswerModal({
  isModalOpen,
  setIsModalOpen,
  appointmentId,
  onRefetch
}: {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  appointmentId: string,
  onRefetch:any
}) {


  const navigate=useNavigate();
  const [description, setDescription] = useState('');
  const [attachment,setAttachment]=useState()
    const fileInputRef = useRef<HTMLInputElement>(null);


  const completeMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiServices.ticket.sendMessage(data);
    },
    onSuccess: () => {
      setIsModalOpen(false)
      //navigate("/tickets");
      toast.success("با موفقیت ثبت شد");
      onRefetch();
    },
    onError: () => {
     // Handle error
    }
  });

  const handleSubmitActions = () => {

    const formData = new FormData();
    // Append form fields
    formData.append('code', appointmentId);
    formData.append('message', description);
    
    if (attachment) {
      formData.append('attachment', attachment);
    }

    // Submit the form
    completeMutation.mutate(formData);


  }

   const handleButtonClick = () => {
    fileInputRef.current?.click(); // open file picker
  };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachment(e.target.files?.[0] || null);
  };


  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-right pl-4 pr-4">اقدامات انجام شده</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="actions">توضیحات اقدامات انجام شده:</Label>
            <Textarea
              id="actions"
              placeholder="لطفاً اقدامات انجام شده را شرح دهید..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-[120px]"
            />
          </div>
          
                <div className="space-y-2">
                  <Label htmlFor="attachment" className="text-base font-semibold">
                    پیوست (اختیاری)
                  </Label>
                  <div className="flex items-center gap-3 grid">
                    <Input
                     ref={fileInputRef}
                      id="attachment"
                      type="file"
                onChange={handleFileChange}
                      className="flex-1 hidden"
                    />
                       <Button type="button" variant="outline" onClick={handleButtonClick}>
          انتخاب فایل
        </Button>

                    {attachment && (
                      <Badge variant="secondary" className="gap-2">
                        <Paperclip className="w-3 h-3" />
                        {attachment.name}
                      </Badge>
                    )}
                  </div>
                </div>

          <AlertModal
            type={completeMutation.isError ? "error" : completeMutation.isSuccess ? "success" : undefined}
            message={
              completeMutation.isError
                ? completeMutation.error?.message
                : completeMutation.isSuccess
                  ? "با موفقیت انجام شد ✅"
                  : ""
            }
            show={completeMutation.isError }
            onClose={() => {
           completeMutation.reset();
            }}
            autoClose={true}
            autoCloseDelay={5000}
          />

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={completeMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              onClick={handleSubmitActions}
              className="bg-green-600 hover:bg-green-700"
              disabled={completeMutation.isPending}
            >
              {completeMutation.isPending ? "در حال ثبت..." : "تایید و ثبت"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}



function ReferralModal({
  isModalOpen,
  setIsModalOpen,
  appointmentId
}: {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  appointmentId: number
}) {

  const [selectedCity,setSelectedCity]=useState();
  const [selectedUser,setSelectedUser]=useState();
  const [description,setDescription]=useState('');
  const [selectedBranch,setSelectedBranch]=useState('');

  const navigate=useNavigate();

  const { data: cities, isLoading: citiesLoading } = useCities()
  const { data: userDepartments, isLoading: departmentsLoading } = useUserDepartmentByCity(selectedCity ? Number(selectedCity) : 0)

  const referralMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiServices.appointment.referralAppointment(data);
    },
    onSuccess: () => {
      setIsModalOpen(false)
      setSelectedCity(null)
      setSelectedUser(null)
      setDescription('')
      navigate("/manage-appointments");
    },
    onError: (err) => {
   
    }
  });

  const handleSubmitReferral = () => {
    if ( !selectedUser) return

    referralMutation.mutate({
      appointmentId,
      description,
      userId: selectedUser
    })
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-right pl-4 pr-4">ارجاع نوبت</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="city">انتخاب شهر:</Label>
            <ComboboxField
              options={cities || []}
              placeholder="شهر مورد نظر را انتخاب کنید..."
              value={selectedCity}
              onChange={setSelectedCity}
              idKey="id"
              titleKey="name"
              isLoading={citiesLoading}
            />
          </div>
          <div>
            <Label htmlFor="user">انتخاب کاربر:</Label>
            <ComboboxField
              options={userDepartments??[]}
              placeholder="کاربر مورد نظر را انتخاب کنید..."
              value={selectedUser}
              onChange={setSelectedUser}
              idKey="id"
              titleKey="fullName"
              isLoading={false}
            />
          </div>
          <div>
            <Label htmlFor="description">توضیحات:</Label>
            <Textarea
              id="description"
              placeholder="توضیحات ارجاع را وارد کنید..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <AlertModal
            type={referralMutation.isError ? "error" : referralMutation.isSuccess ? "success" : undefined}
            message={
              referralMutation.isError
                ? referralMutation.error?.message
                : referralMutation.isSuccess
                  ? "با موفقیت انجام شد ✅"
                  : ""
            }
            show={referralMutation.isError }
            onClose={() => {
           
            }}
            autoClose={true}
            autoCloseDelay={5000}
          />

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={referralMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              onClick={handleSubmitReferral}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={referralMutation.isPending || !selectedCity || !selectedBranch  || !selectedUser || !description.trim()}
            >
              {referralMutation.isPending ? "در حال ارجاع..." : "ارجاع"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

