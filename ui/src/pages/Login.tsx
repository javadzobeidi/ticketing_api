import { useEffect } from 'react'
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
import { apiServices } from '@/src/apis'
import { AlertModal } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Zod validation schema
const loginSchema = z.object({
    userName: z
        .string()
        .min(1, 'نام کاربری الزامی است'),
    password: z
        .string()
        .min(1, 'رمز عبور الزامی است')
        .min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد'),
    captcha_answer: z.string()
        .min(1, 'جواب امنیتی  را وارد کنید')

});

type LoginFormData = z.infer<typeof loginSchema>;

// ================================|| LOGIN ||================================ //

const Login = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
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


    const mutation = useMutation({
        mutationFn: async (data) => {
            return apiServices.auth.login(data);
        },
        onSuccess: () => {
        },
        onError: (err) => {

        }
    });

    const onSubmit = (data) => {

        data.captcha_token = captcha.captchaToken;
        mutation.mutate(data);
    }



    useEffect(() => {
        generateCaptcha();
    }, [generateCaptcha]);


    useEffect(() => {
        if (mutation.isSuccess) {
            toast.success("با موفقیت وارد شدید");
            navigate("/");
        }
    }, [mutation.isSuccess]);



    return (
        <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1 text-center">
                    <img src={nezamLogo} alt="Nezam Logo" className="w-24 h-24 mx-auto mb-4 object-contain" />
                    <CardTitle className="text-2xl">ورود به حساب کاربری</CardTitle>
                    <CardDescription>
                        لطفا کد ملی و رمز عبور خود را وارد کنید
                    </CardDescription>
                    <div className="text-center mt-2">
    <Link to="/login-mobile" className="text-sm font-semibold text-primary">
        ورود با شماره موبایل
    </Link>
</div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nationalCode">کد ملی</Label>
                                <Input
                                    id="userName"
                                    autoComplete="userName"
                                    autoFocus
                                    error={errors.userName}
                                    {...register('userName')}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">رمز عبور</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    error={errors.password}
                                    {...register('password')}
                                />
                            </div>


                            <div className="flex text-center gap-y-6 gap-x-3 items-center justify-center w-full">
                                <Input
                                    id="captcha_answer"
                                    type="text"
                                    error={errors.captcha_answer}
                                    {...register('captcha_answer')}

                                />



                                {isValidCaptcha !== null && (
                                    <p className={isValidCaptcha ? 'text-green-500' : 'text-red-500'}>
                                        {isValidCaptcha ? 'CAPTCHA verified!' : 'Incorrect sum!'}
                                    </p>
                                )}



                                {captcha?.imageUrl ? (
                                    <img onClick={() => generateCaptcha()} src={captcha?.imageUrl} alt="CAPTCHA" className="hover:cursor-pointer w-32 h-auto" />
                                ) : (
                                    <p> لود کردن کپجا...</p>
                                )}
                            </div>

                            <AlertModal
                                type={mutation.isError ? "error" : undefined}
                                message={
                                    mutation.isError
                                        ? mutation.error?.message : ""

                                }
                                show={mutation.isError}
                                onClose={() => {
                                    mutation.reset();
                                    generateCaptcha();
                                }}
                                autoClose={true}
                                autoCloseDelay={5000}
                            />


                            <Button isLoading={mutation.isPending} type="submit" className="w-full mt-2" disabled={isSubmitting}>
                                {isSubmitting ? 'در حال ورود...' : 'ورود'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    حساب کاربری ندارید؟&nbsp;
                    <Link to="/register" className="font-semibold">
                        ثبت نام کنید
                    </Link>

                    
         

                </CardFooter>
                   <div className="flex flex-col items-center  text-sm text-muted-foreground">
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

export default Login;
