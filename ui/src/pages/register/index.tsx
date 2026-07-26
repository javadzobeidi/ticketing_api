import React, { useState } from 'react';

// project imports
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Link } from '@/src/components/ui/link';

import { AlertModal } from '@/src/components/ui';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import nezamLogo from '@/src/assets/images/nezam_logo.jpg';
import { RegisterFormData, registerSchema } from './register_schema'
import { useForm, Controller } from 'react-hook-form';
import { apiServices } from '@/src/apis'
import { useQuery, useMutation } from '@tanstack/react-query';

import { zodResolver } from '@hookform/resolvers/zod';
import { ComboboxField } from '@/src/components/ui/Combobox';
import { useNavigate } from 'react-router-dom';
import useCaptcha from '@/src/lib/useCaptcha';

const Register = () => {
    const navigate = useNavigate();
    const {
        control,
        register,
        handleSubmit,

        formState: { errors },
        reset,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            mobile: '',
            firstName: '',
            lastName: '',
            cityId: 1,
            password: '',
            nationalCode: '',
            captcha_answer:''
        },
    });


    const mutation = useMutation({
        mutationFn: async (data) => {
            return apiServices.user.register(data);
        },
        onSuccess: () => {
        },
        onError: (err) => {
            generateCaptcha();
        }
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


    const { data: cities, isLoading: citiesLoading } = useQuery({
        queryKey: ['cities'],
        queryFn: apiServices.city.list,
    });


    const onSubmit = (data) => {
       data.captcha_token = captcha.captchaToken;
        mutation.mutate(data);
    }

    console.log("Mutation", mutation);

    return (
        <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <img src={nezamLogo} alt="Nezam Logo" className="w-24 h-24 mx-auto mb-4 object-contain" />
                    <CardTitle className="text-2xl">ایجاد حساب کاربری جدید</CardTitle>
                    <CardDescription>
                        برای ثبت نام، لطفا اطلاعات زیر را تکمیل کنید
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">نام</Label>
                                    <Input
                                        id="firstName"
                                        error={errors.firstName}
                                        {...register("firstName")}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">نام خانوادگی</Label>
                                    <Input
                                        id="lastName"
                                        error={errors.lastName}
                                        {...register("lastName")}

                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nationalCode">کد ملی</Label>
                                <Input
                                    id="nationalCode"
                                    error={errors.nationalCode}
                                    {...register("nationalCode")}

                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="mobile">شماره موبایل</Label>
                                <Input
                                    id="mobile"
                                    error={errors.mobile}
                                    {...register("mobile")}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city">شهر</Label>

                                <Controller
                                    name="cityId"
                                    control={control}
                                    rules={{ required: 'لطفاً شهر را انتخاب کنید' }}
                                    render={({ field: { value, onChange } }) => (
                                        <ComboboxField
                                            options={cities || []}
                                            placeholder="انتخاب شهر"
                                            idKey="id"
                                            titleKey="name"
                                            value={value}          // ← from RHF
                                            onChange={onChange}    // ← updates RHF
                                        />)}
                                />

                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">رمز عبور</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    error={errors.password}
                                    {...register("password")}

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
                                type={mutation.isError ? "error" : mutation.isSuccess ? "success" : undefined}
                                message={
                                    mutation.isError
                                        ? mutation.error?.message
                                        : mutation.isSuccess
                                            ? "اطلاعات شما با موفقیت ثبت شد"
                                            : ""
                                }
                                show={mutation.isError || mutation.isSuccess}
                                onClose={() => {
                                    if (mutation.isSuccess) {
                                        navigate("/login");
                                    }
                                    mutation.reset();
                                }}
                                autoClose={true}
                                autoCloseDelay={5000}
                            />

                            <Button isLoading={mutation.isPending} type="submit" className="w-full mt-2">
                                ثبت نام
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    قبلا ثبت نام کرده‌اید؟&nbsp;
                    <Link to="/login" className="font-semibold">
                        وارد شوید
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

export default Register;
