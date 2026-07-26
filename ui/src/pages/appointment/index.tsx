import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { Calendar as CalenderIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiServices } from '@/src/apis';
import { PersianDatePicker, ComboboxField, AlertModal } from '@/src/components/ui'
import { AppointmentSchedule, AppointmentFormData, appointmentSchema } from './appointment_schema'

import { TimePicker } from '@/src/components/ui';
import { useUserInfo } from '@/src/lib/useQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
const intervalOptions = [
  { value: '5', label: '5 دقیقه' },
  { value: '10', label: '10 دقیقه' },
  { value: '15', label: '15 دقیقه' },
  { value: '20', label: '20 دقیقه' },
  { value: '25', label: '25 دقیقه' },
  { value: '30', label: '30 دقیقه' },
];



const CreateAppointmentPage = () => {

  const { data: userInfo } = useUserInfo();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      fromTime: '',
      toTime: '',
      intervalMinutes: '30',

    }
  });
  const watchDepartmentId = watch("userDepartmentId");


  const createMutation = useMutation({
    mutationFn: (model: AppointmentFormData) => apiServices.appointment.create(model),
    onSuccess: () => {
      reset();
    },
  });


  useEffect(() => {
    if (createMutation.isSuccess) {
      toast.success("با موفقیت ایجاد شد حهت مشاهده به مدیریت وقت ها مراجعه کنید");
    }
  }, [createMutation.isSuccess]);



  useEffect(() => {

    if (userInfo?.userDepartments) {
      if (userInfo.userDepartments.length>0)
      setValue("userDepartmentId", userInfo.userDepartments[0].id);
    }
  }, [userInfo])


  const onSubmit = async (data: AppointmentFormData) => {
    createMutation.mutate(data);

  };



  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Main Content */}


      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalenderIcon className="w-6 h-6 text-blue-600" />
            </div>
            تنظیمات برنامه وقت‌دهی
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            برای ایجاد برنامه وقت‌دهی، فرم زیر را تکمیل کنید. سیستم به صورت خودکار بازه‌های زمانی را بر اساس تنظیمات شما ایجاد می‌کند.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="mt-2  rounded-xl p-6 ">
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 max-w-md">

                <Label htmlFor="userDepartmentId">واحد  *</Label>
                <Controller
                  name="userDepartmentId"
                  control={control}
                  render={({ field }) => {

                    const departmentOptions = userInfo?.userDepartments?.map(dep => ({
                      value: dep.id,
                      label: dep.title
                    })) || [];

                    // setValue("userDepartmentId",departmentOptions[0].id)

                    return (

                      <ComboboxField
                        options={departmentOptions}
                        placeholder="انتخاب شهر"
                        value={field.value}
                        inputClass="py-3"
                        onChange={field.onChange}
                        idKey="value"
                        titleKey="label"

                      />

                    )
                  }}
                />

              </div>
              <div className="grid gap-2">

                <PersianDatePicker
                  name="startDate"
                  control={control}
                  errors={errors}
                  label="تاریخ شروع"
                />

              </div>
              <div className="grid gap-2 ">
                <PersianDatePicker
                  name="endDate"
                  control={control}
                  errors={errors}
                  label="تاریخ شروع"
                />

              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="toTime">ساعت شروع *</Label>

                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      inputClass="py-2 "
                      value={field.value}
                      onChange={field.onChange}
                      label="Start Time"
                    />
                  )}
                />



                {errors.fromTime && (
                  <p className="text-sm text-red-500">{errors.fromTime.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="toTime">ساعت پایان *</Label>

                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      inputClass="py-2 "
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                {errors.toTime && (
                  <p className="text-sm text-red-500">{errors.toTime.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interval">فاصله زمانی *</Label>
                <Controller
                  name="intervalMinutes"
                  control={control}
                  render={({ field }) => (

                    <ComboboxField
                      options={intervalOptions}
                      placeholder="انتخاب فاصله زمانی "
                      value={field.value}
                      inputClass="py-3"
                      onChange={field.onChange}
                      idKey="value"
                      titleKey="label"

                    />

                  )}
                />
                {errors.intervalMinutes && (
                  <p className="text-sm text-red-500">{errors.intervalMinutes.message}</p>
                )}
              </div>
            </div>

            <AlertModal
              type={createMutation.isError ? "error" : undefined}
              message={
                createMutation.isError
                  ? createMutation.error?.message : ""

              }
              show={createMutation.isError}
              onClose={() => {
                createMutation.reset();
              }}
              autoClose={true}
              autoCloseDelay={5000}
            />


            <div className="flex justify-end pt-4">
              <Button isLoading={createMutation.isPending} type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {isSubmitting ? 'در حال ایجاد...' : 'ایجاد برنامه وقت‌دهی'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

    </div>
  );
};

export default CreateAppointmentPage;
