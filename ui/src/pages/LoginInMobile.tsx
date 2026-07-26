import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// project imports
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Link } from '@/src/components/ui/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import nezamLogo from '@/src/assets/images/nezam_logo.jpg';
import useCaptcha from '../lib/useCaptcha';
import { useMutation } from '@tanstack/react-query';
import { apiServices } from '@/src/apis';
import { AlertModal, OtpInput } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Zod validation schema for mobile step
const mobileSchema = z.object({
    mobile: z
        .string()
        .min(1, 'شماره موبایل الزامی است')
        .regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
    captcha_answer: z.string()
        .min(1, 'جواب امنیتی را وارد کنید')
});

// Zod validation schema for OTP step
const otpSchema = z.object({
    
});

type MobileFormData = z.infer<typeof mobileSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

// ================================|| LOGIN WITH OTP ||================================ //

const LoginInMobile = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
    const [mobileNumber, setMobileNumber] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [otpValue, setOtpValue] = useState('');
    const [otpId,setOtpId]=useState('');
    const {
        register: registerMobile,
        handleSubmit: handleSubmitMobile,
        formState: { errors: mobileErrors, isSubmitting: isMobileSubmitting },
    } = useForm<MobileFormData>({
        resolver: zodResolver(mobileSchema),
    });

    const {
        register: registerOtp,
        handleSubmit: handleSubmitOtp,
        formState: { errors: otpErrors, isSubmitting: isOtpSubmitting },
    } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    });

    const {
        captcha,
        captchaLoading,
        userInput,
        setUserInput,
        isValid: isValidCaptcha,
        error,
        generateCaptcha,
        verifyCaptcha,
    } = useCaptcha();

    // Send OTP mutation
    const sendOtpMutation = useMutation({
        mutationFn: async (data) => {
            return apiServices.auth.sendOtp(data);
        },
        onSuccess: (data) => {
            toast.success('کد تایید با موفقیت ارسال شد');
            setStep('otp');
            setOtpId(data.id);
            setCountdown(120); // 2 minutes countdown
        },
        onError: (err) => {
            toast.error(err?.message || 'خطا در ارسال کد تایید');
        }
    });

    // Verify OTP mutation
    const verifyOtpMutation = useMutation({
        mutationFn: async (data) => {
            return apiServices.auth.verifyOtp(data);
        },
        onSuccess: () => {
            toast.success('با موفقیت وارد شدید');
            navigate('/');
        },
        onError: (err) => {
            toast.error(err?.message || 'کد تایید نامعتبر است');
        }
    });

    const onSubmitMobile = (data) => {
        data.captcha_token = captcha.captchaToken;
        setMobileNumber(data.mobile);
        sendOtpMutation.mutate(data);
    };

    const onSubmitOtp = (data) => {
           if (otpValue.length !== 4) {
            toast.error('لطفا کد 4 رقمی را کامل وارد کنید');
            return;
        }
      
        verifyOtpMutation.mutate({id:otpId,code:otpValue});
    };

    const handleResendOtp = () => {
        if (countdown === 0) {
            sendOtpMutation.mutate({
                mobile: mobileNumber,
                captcha_token: captcha.captchaToken
            });
        }
    };

    useEffect(() => {
        generateCaptcha();
    }, [generateCaptcha]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1 text-center">
                    <img src={nezamLogo} alt="Nezam Logo" className="w-24 h-24 mx-auto mb-4 object-contain" />
                    <CardTitle className="text-2xl">ورود به حساب کاربری</CardTitle>
                    <CardDescription>
                        {step === 'mobile' 
                            ? 'لطفا شماره موبایل خود را وارد کنید'
                            : `کد تایید به شماره ${mobileNumber} ارسال شد`
                        }
                    </CardDescription>
                            <div className="text-center mt-2">
    <Link to="/login" className="text-sm font-semibold text-primary">
        ورود با نام کاربری
    </Link>
</div>

                </CardHeader>
                <CardContent>
                    {step === 'mobile' ? (
                        <form onSubmit={handleSubmitMobile(onSubmitMobile)} noValidate>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="mobile">شماره موبایل</Label>
                                    <Input
                                        id="mobile"
                                        autoComplete="tel"
                                        autoFocus
                                        placeholder="09xxxxxxxxx"
                                        error={mobileErrors.mobile}
                                        {...registerMobile('mobile')}
                                    />
                                </div>

                                <div className="flex text-center gap-y-6 gap-x-3 items-center justify-center w-full">
                                    <Input
                                        id="captcha_answer"
                                        type="text"
                                        placeholder="کد امنیتی"
                                        error={mobileErrors.captcha_answer}
                                        {...registerMobile('captcha_answer')}
                                    />

                                    {isValidCaptcha !== null && (
                                        <p className={isValidCaptcha ? 'text-green-500' : 'text-red-500'}>
                                            {isValidCaptcha ? 'تایید شد!' : 'نادرست!'}
                                        </p>
                                    )}

                                    {captcha?.imageUrl ? (
                                        <img 
                                            onClick={() => generateCaptcha()} 
                                            src={captcha?.imageUrl} 
                                            alt="CAPTCHA" 
                                            className="hover:cursor-pointer w-32 h-auto" 
                                        />
                                    ) : (
                                        <p>بارگذاری کپچا...</p>
                                    )}
                                </div>

                                <AlertModal
                                    type={sendOtpMutation.isError ? "error" : undefined}
                                    message={
                                        sendOtpMutation.isError
                                            ? sendOtpMutation.error?.message : ""
                                    }
                                    show={sendOtpMutation.isError}
                                    onClose={() => {
                                        sendOtpMutation.reset();
                                    }}
                                    autoClose={true}
                                    autoCloseDelay={5000}
                                />

                                <Button 
                                    isLoading={sendOtpMutation.isPending} 
                                    type="submit" 
                                    className="w-full mt-2" 
                                    disabled={isMobileSubmitting}
                                >
                                    {isMobileSubmitting ? 'در حال ارسال...' : 'ارسال کد تایید'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmitOtp(onSubmitOtp)} noValidate>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="otp">کد تایید</Label>
                                   <OtpInput
                                    length={4}
                                    label="کد تایید 4 رقمی"
                                    onChange={(value) => setOtpValue(value)}
                                    error={otpErrors.otp?.message}
                                    autoFocus={true}
                                />

                                </div>

                                <div className="text-center text-sm">
                                    {countdown > 0 ? (
                                        <p className="text-muted-foreground">
                                            ارسال مجدد کد در {formatTime(countdown)}
                                        </p>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="link"
                                            onClick={handleResendOtp}
                                            disabled={sendOtpMutation.isPending}
                                        >
                                            ارسال مجدد کد تایید
                                        </Button>
                                    )}
                                </div>

                                <AlertModal
                                    type={verifyOtpMutation.isError ? "error" : undefined}
                                    message={
                                        verifyOtpMutation.isError
                                            ? verifyOtpMutation.error?.message : ""
                                    }
                                    show={verifyOtpMutation.isError}
                                    onClose={() => {
                                        verifyOtpMutation.reset();
                                    }}
                                    autoClose={true}
                                    autoCloseDelay={5000}
                                />

                                <Button 
                                    isLoading={verifyOtpMutation.isPending} 
                                    type="submit" 
                                    className="w-full mt-2" 
                                    disabled={isOtpSubmitting}
                                >
                                    {isOtpSubmitting ? 'در حال تایید...' : 'تایید و ورود'}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setStep('mobile');
                                        setCountdown(0);
                                    }}
                                    className="w-full"
                                >
                                    بازگشت
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    حساب کاربری ندارید؟&nbsp;
                    <Link to="/register" className="font-semibold">
                        ثبت نام کنید
                    </Link>
                </CardFooter>
                <div className="flex flex-col items-center text-sm text-muted-foreground pb-4">
                    <div>شماره پشتیبانی سامانه</div>
                    <a 
                        href="tel:06191010456" 
                        className="font-semibold text-primary hover:underline transition-colors"
                    >
                        061-91010456 داخلی 1021
                    </a>
                </div>
            </Card>
        </div>
    );
};

export default LoginInMobile;