"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/src/components/ui/card"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Input, Badge } from "@/src/components/ui"


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { ComboboxField } from "@/src/components/ui/Combobox"
import { FileText,ChevronDown, Download, Clock, CheckCheck,Timer , ArrowRight, CheckCircle,Trash2, XCircle, Send, Paperclip,Phone,PhoneOff, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiServices } from "@/src/apis"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AlertModal } from "@/src/components/ui"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useCities, useBranchByCity, useUserDepartmentById, useUserDepartmentByCity } from "@/src/lib/useQueries"
import { triggerFileDownload } from "@/src/lib/downloadUtils"
import AlertDialog from "@/src/components/ui/alert-dialog"


export function TicketConversation({ data, onRefetch }: { data: any, onRefetch: any }) {

    
  const [isAnswerModal, setIsAnswerModal] = useState(false)
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false)
  const [closeTicketModal, setCloseTicketModal] = useState(false)
  const [isCallingOpen, setIsCallingOpen] = useState(false)


      const { data: templates = [], isLoading } = useQuery({
        queryKey: ['messageTemplates'],
        queryFn: apiServices.messageTemplate.list,
    });




  const closeTicketMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiServices.ticket.close(data);
    },
    onSuccess: () => {
      setCloseTicketModal(true)
      onRefetch();
      //setDescription("")
    },
    onError: () => {
      setCloseTicketModal(false);
      // Handle error
    }
  });

   const callMutation = useMutation({
    mutationFn: async (id: any) => {
      return apiServices.ticket.dial(id);
    },
    
    onSuccess: () => {
      onRefetch();
    },
    onError: () => {
      setCloseTicketModal(false);
    }
  });


  const handleAction = (action: string) => {
  
      // Handle other actions (عدم حضور)
      setCloseTicketModal(true);
   
  }

  const handleCloseTicker=()=>{
    setCloseTicketModal(true);
  }

  const sendReferral=()=>{
      setIsReferralModalOpen(true)

  }

  const sendMessage=()=>{
  setIsAnswerModal(true)
  }

  const handleCancelDialog = () => {
    setCloseTicketModal(false);
  }
  const handleConfirmCancel = () => {
    closeTicketMutation.mutate({ code: data.code, closeType: "admin" })
  }

const callUser = async (id) => {
  try
  {
  var result=await callMutation.mutateAsync(id);   
  }
  catch(e)
  {
 
   toast.error(e.message);
           return;

  }

};




  return (
    <div className="space-y-6">
      {/* Action Buttons */}

      {data.canProcess && <Card className="p-4">
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => sendReferral()}
            variant="outline"
            className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            <ArrowRight className="w-4 h-4" />
            ارجاع
          </Button>

          <Button
            onClick={() => sendMessage()}
            variant="outline"
            className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
          >
            <Send className="w-4 h-4" />
            ارسال پیام
          </Button>

          <Button
            onClick={() => callUser(data.id)}
            variant="outline"
            className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Phone className="w-4 h-4" />
            تماس با مشتری
          </Button>


          <Button
            onClick={() => handleCloseTicker()}
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <XCircle className="w-4 h-4" />
            بستن تیکت
          </Button>
        </div>
      </Card>}

      <Card className="p-6 min-h-[400px] bg-gradient-to-br from-muted/20 to-background">
        <div className="space-y-6">

         

          {
            data.messages.map((message: any) => {
              return <MessageItem 
              
              onRefetch={onRefetch}
              key={message.id} message={{ ...message, sender: message.isFromStuff ? "user" : "customer" }} />
            })


          }


        </div>
      </Card>

<CallingModal
  isModalOpen={callMutation.isPending}
  setIsModalOpen={setIsCallingOpen}
  customerName="علی احمدی"
  customerPhone="09123456789"
  onCallEnd={(duration) => {
    console.log(`تماس ${duration} ثانیه طول کشید`);
    // ذخیره لاگ تماس
  }}
/>

      <AnswerModal
      templates={templates}
        isModalOpen={isAnswerModal}
        setIsModalOpen={setIsAnswerModal}
        onRefetch={onRefetch}
        appointmentId={data.code}
      />

      <ReferralModal
        isModalOpen={isReferralModalOpen}
        setIsModalOpen={setIsReferralModalOpen}
        onRefetch={onRefetch}

        appointmentId={data.code}
      />

      <AlertDialog
        open={closeTicketModal}
        onOpenChange={setCloseTicketModal}
        title="بستن تیکت"
        description=""
        isLoading={false}
        buttons={[
          {
            text: 'آیا از بستن تیکت اطمینان دارید ؟',
            onClick: handleConfirmCancel,
            variant: 'destructive',
            className: 'flex-1',
          },
          {
            text: 'خیر',
            onClick: handleCancelDialog,
            variant: 'outline',
            className: "flex-1"
          },
        ]}
      />

      <AlertModal
        type={closeTicketMutation.isError ? "error" : undefined}
        message={
          closeTicketMutation.isError
            ? closeTicketMutation.error?.message : ""

        }
        show={closeTicketMutation.isError}
        onClose={() => {
          closeTicketMutation.reset();
        }}
        autoClose={true}
        autoCloseDelay={5000}
      />




    </div>
  )
}

const MessageItem = ({ message,onRefetch }: { message: any,onRefetch:any }) => {
  
    const [timeRemaining, setTimeRemaining] = useState(  Math.floor(message.expireInSecounds));

    
  const removeTicketMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiServices.ticket.remove(data);
    },
    onSuccess: () => {
    onRefetch();
      //setDescription("")
    },
    onError: () => {
      // Handle error
    }
  });

    useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDeleteMessage=()=>{
    console.log("Delete is :")
    removeTicketMutation.mutate(message.id)

  }


  const isCallMessage = message.messageType !== 1;
  if (isCallMessage) {
    return (
      <div key={message.id} className="flex justify-center my-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-400/50 text-muted-foreground text-sm">
          <Phone className="w-4 h-4" />
          <span>تماس با {message.user}</span>
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

   {timeRemaining > 0 && (
          <div className="flex items-center gap-1 text-xs font-mono bg-background/20 px-2 py-1 rounded">
            <Timer className="w-3 h-3" />
            {formatTime(timeRemaining)}
          </div>
        )}

             {message.expireInSecounds > 0  && timeRemaining>0 && (
              
                    <Button
                      onClick={()=>handleDeleteMessage()}
                      size="sm"
                      variant="destructive"
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </Button>
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


const MESSAGE_TEMPLATES = [
  {
    id: '1',
    title: 'تایید دریافت درخواست',
    content: 'درخواست شما با موفقیت دریافت شد و در حال بررسی می‌باشد. به زودی نتیجه به اطلاع شما خواهد رسید.'
  },
  {
    id: '2',
    title: 'درخواست اطلاعات تکمیلی',
    content: 'لطفاً برای بررسی بهتر درخواست، اطلاعات تکمیلی زیر را ارسال فرمایید:\n- \n- '
  },
  {
    id: '3',
    title: 'اتمام کار',
    content: 'کار مورد نظر با موفقیت انجام شد. در صورت نیاز به راهنمایی بیشتر، در خدمت هستیم.'
  },
  {
    id: '4',
    title: 'نیاز به بررسی بیشتر',
    content: 'درخواست شما نیازمند بررسی تخصصی‌تر است. زمان تقریبی پاسخگویی: 24-48 ساعت'
  }
];

function AnswerModal({
  isModalOpen,
  setIsModalOpen,
  appointmentId,
  onRefetch,
  templates
}: {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  appointmentId: string,
  onRefetch: any,
  templates:any
}) {


  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([])
  

  const fileInputRef = useRef<HTMLInputElement>(null);
const [showTemplates, setShowTemplates] = useState(false);

const handleTemplateSelect = (template) => {
    setDescription(template.description);
    setShowTemplates(false);
  };



  const completeMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiServices.ticket.adminSendMessage(data);
    },
    onSuccess: () => {
      setIsModalOpen(false)
      //navigate("/manage-appointments");
      toast.success("با موفقیت ثبت شد");
      onRefetch();

      //setDescription("")
    },
    onError: () => {
      // Handle error
    }
  });

  const handleSubmitActions = () => {

    const formData = new FormData();
    console.log("appointmentId:", appointmentId)
    // Append form fields
    formData.append('code', appointmentId);
    formData.append('message', description);


        attachments.forEach((file) => {
      formData.append('attachments', file);
    });


    // Submit the form
    completeMutation.mutate(formData);
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // open file picker
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setAttachments([...attachments,e.target.files?.[0] || null])
    
  };


  const removeFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-right pl-4 pr-4">اقدامات انجام شده</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">

           <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              انتخاب از قالب پیام (اختیاری)
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">انتخاب قالب پیام</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {showTemplates && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full text-right px-4 py-3 hover:bg-blue-50 transition-colors border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900 mb-1">{template.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">{template.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

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
            
            {attachments.map((attach,index)=>{
              return (

     <Badge variant="secondary" className="gap-2">
                  <Paperclip className="w-3 h-3" />
                  {attach.name} 

                
                  <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>

                </Badge>

                
              )
            })}

              
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
            show={completeMutation.isError}
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
  appointmentId,
  onRefetch
}: {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  appointmentId: string,
  onRefetch: any
}) {

  const [selectedCity, setSelectedCity] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [description, setDescription] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  const navigate = useNavigate();

  const { data: cities, isLoading: citiesLoading } = useCities()
  const { data: userDepartments, isLoading: departmentsLoading } = useUserDepartmentByCity(selectedCity ? Number(selectedCity) : 0)

  const referralMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiServices.ticket.referral(data);
    },
    onSuccess: () => {
      setIsModalOpen(false)
      setSelectedCity(null)
      setSelectedUser(null)
      setDescription('')
      onRefetch();
    },
    onError: (err) => {

    }
  });

  const handleSubmitReferral = () => {
    if (!selectedUser) return

    referralMutation.mutate({
      code: appointmentId,
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
            isSearchable={true}
            descriptionKey="description"
              options={userDepartments ?? []}
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
            show={referralMutation.isError}
            onClose={() => {
              referralMutation.reset();
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
              disabled={referralMutation.isPending || !selectedCity ||  !selectedUser || !description.trim()}
            >
              {referralMutation.isPending ? "در حال ارجاع..." : "ارجاع"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


function CallingModal({
  isModalOpen,
  setIsModalOpen,
  customerName,
  customerPhone,
  onCallEnd
}: {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  customerName?: string
  customerPhone?: string
  onCallEnd?: (duration: number) => void
}) {
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      // Simulate connection after 2 seconds
      const connectTimer = setTimeout(() => {
        setIsConnected(true);
      }, 2000);

      return () => clearTimeout(connectTimer);
    } else {
      setIsConnected(false);
      setCallDuration(0);
    }
  }, [isModalOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected && isModalOpen) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected, isModalOpen]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (onCallEnd) {
      onCallEnd(callDuration);
    }
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">تماس تلفنی</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          {/* Avatar with Animation */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Pulsing rings animation */}
              {!isConnected && (
                <>
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-50"></div>
                </>
              )}
              
              {/* Avatar */}
              <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white transition-all duration-500 ${
                isConnected ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'
              }`}>
                {customerName?.charAt(0) || 'م'}
              </div>

              {/* Phone icon overlay */}
              <div className={`absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                isConnected ? 'bg-green-600' : 'bg-blue-600 animate-bounce'
              }`}>
                <Phone className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {customerName || 'مشتری'}
            </h2>
            {customerPhone && (
              <p className="text-gray-500 text-sm">
                {customerPhone}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="text-center">
            {isConnected ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                  <span className="text-sm font-medium">متصل شده</span>
                </div>
                <div className="text-3xl font-mono font-bold text-gray-700">
                  {formatDuration(callDuration)}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-blue-600 font-medium animate-pulse">
                  در حال برقراری تماس...
                </p>
                <div className="flex justify-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center pt-4">
            <Button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            پایان تماس
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
