import { LayoutDashboard, Users, Plus, Menu, X, Bell, Settings, LogOut, Sparkles, MessageSquare, Archive, Building2, CalendarClock, ClipboardList } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Lock, Send, CheckCircle } from "lucide-react"
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { useMutation } from "@tanstack/react-query";
import { apiServices } from "@/src/apis";
import { toast } from "sonner";
import { useLogout } from "./useLogout";

export const Header=({setSidebarOpen})=>{
      const [settingsOpen, setSettingsOpen] = useState(false)
      const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
        const logout = useLogout();
      
    return (
  <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-xl border-b-2 border-border shadow-sm ">
        <ChangePasswordDialog isOpen={openPasswordDialog}  setIsOpen={setOpenPasswordDialog}/>

          <div className="flex items-center justify-between h-full px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center  gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              </Button>
             

                <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setSettingsOpen(!settingsOpen)}
              >
                <Settings className="w-5 h-5" />
              </Button>


              {settingsOpen && (
                <>
                  {/* Backdrop to close menu when clicking outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setSettingsOpen(false)}
                  />
                  
                  {/* Menu */}
                  <div className="absolute right-0 top-12 z-50 w-56 bg-card border border-border rounded-lg shadow-lg py-2">
                    <button 
                    onClick={()=>setOpenPasswordDialog(true)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-3">
                      <Settings className="w-4 h-4" />
                      تغییر رمز
                    </button>
                  
                    <div className="h-px bg-border my-2" />
                    <button 
                    onClick={()=>logout.mutate()}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-3 text-destructive">
                      <LogOut className="w-4 h-4" />
                    خروج
                    </button>
                  </div>
                </>
              )}


            </div>
          </div>
        </header>



    )
}
const ChangePasswordDialog = ({ isOpen, setIsOpen }) => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [smsCode, setSmsCode] = useState("")
  const [smsSent, setSmsSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [optId,setOtpId]=useState("");



   const sendOtpMutation = useMutation({
        mutationFn: async () => {
            return apiServices.auth.sendOtpChangePassword();
        },
        onSuccess: (data) => {
            toast.success('کد تایید با موفقیت ارسال شد');
            setOtpId(data.id);
        },
        onError: (err) => {
            toast.error(err?.message || 'خطا در ارسال کد تایید');
        }
    });

    // Verify OTP mutation
    const verifyOtpMutation = useMutation({
        mutationFn: async (data) => {
            return apiServices.auth.verifyChangePassword(data);
        },
        onSuccess: () => {
            toast.success('با موفقیت تغییر یافت');
            handleClose();

        },
        onError: (err) => {
            toast.error(err?.message || 'کد تایید نامعتبر است');
        }
    });

console.log(  verifyOtpMutation.isPending )

  const handleSendSms = async () => {
    setError("")

    if (newPassword.length < 8) {
      setError("رمز عبور جدید باید حداقل ۸ کاراکتر باشد")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("رمز عبور جدید و تکرار آن مطابقت ندارند")
      return
    }

    setLoading(true)
    
    try {
            
        sendOtpMutation.mutate();
      setSmsSent(true)
    } catch (err) {
      setError("خطا در ارسال پیامک. دوباره تلاش کنید")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!smsSent) {
      setError("ابتدا کد تایید را درخواست کنید")
      return
    }

    if (smsCode.length !== 4) {
      setError("کد تایید باید ۶ رقم باشد")
      return
    }

    setLoading(true)

    try {

      var data={id:optId,newPassword:newPassword}
      verifyOtpMutation.mutate(data);
    
    } catch (err) {
      setError("کد تایید نامعتبر است یا منقضی شده")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    // Reset form
    setTimeout(() => {
      setNewPassword("")
      setConfirmPassword("")
      setSmsCode("")
      setSmsSent(false)
      setError("")
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Lock className="w-6 h-6" />
            تغییر رمز عبور
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
         

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-base font-semibold">
              رمز عبور جدید
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="رمز عبور جدید (حداقل ۸ کاراکتر)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={smsSent}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-base font-semibold">
              تکرار رمز عبور جدید
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="رمز عبور جدید را دوباره وارد کنید"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={smsSent}
              required
            />
          </div>

          {!smsSent && (
            <Button 
              type="button"
               isLoading={sendOtpMutation.isPending} 
              onClick={handleSendSms}
              disabled={loading}
              className="w-full gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              {loading ? "در حال ارسال..." : "ارسال کد تایید پیامکی"}
            </Button>
          )}

          {smsSent && (
            <>
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="text-sm">
                  ✓ کد تایید به شماره موبایل شما ارسال شد
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsCode" className="text-base font-semibold">
                  کد تایید پیامکی
                </Label>
                <Input
                  id="smsCode"
                  type="text"
                  placeholder="کد 4 رقمی را وارد کنید"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                />
              </div>

              <Button
                type="button"
                  isLoading={sendOtpMutation.isPending} 
                variant="ghost"
                className="w-full text-sm"
                onClick={handleSendSms}
                disabled={loading}
              >
                ارسال مجدد کد
              </Button>
            </>
          )}

          {error && (
            <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {smsSent && (
              <Button 
                type="submit" 
                   isLoading={verifyOtpMutation.isPending} 
                className="flex-1 gap-2 shadow-lg"
                disabled={loading}
              >
                <CheckCircle className="w-4 h-4" />
                {loading ? "در حال تایید..." : "تایید و تغییر رمز"}
              </Button>
            )}
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className={smsSent ? "" : "flex-1"}
            >
              انصراف
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}