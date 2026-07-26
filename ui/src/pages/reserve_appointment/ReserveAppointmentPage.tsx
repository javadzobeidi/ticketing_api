import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { AlertModal, Input, PersianDatePicker, TreeViewField } from '@/src/components/ui';
import { ComboboxField } from '@/src/components/ui/Combobox';
import { apiServices } from '@/src/apis';
import { Button as UIButton } from '@/src/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ReserveAppointmentForm, reserveAppointmentSchema } from './reserve_appointment_schema';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBranchByCity, useBranchHierarchyByCity, useCities } from '@/src/lib/useQueries';
import { useMutation, useQuery } from '@tanstack/react-query';
import Utils from '@/src/lib/utils';


const ReserveAppointmentPage = () => {

  const navigate = useNavigate();
  const { register, watch, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<ReserveAppointmentForm>({
    resolver: zodResolver(reserveAppointmentSchema),
    defaultValues: {

    }
  });

  const selectedCityId = watch("cityId");
  const watchReserveDate = watch("reserveDate");
  const watchBranchDepartmentId = watch("branchDepartmentId");
const [selectDepartmentId,setSelectDepartmentId]=useState();

const [branches,setBranches]=useState([]);


  const { data: cities, isLoading: citiesLoading } = useCities();

  const { data: branchDepartment, isLoading: branchDepartmentLoading } = useBranchHierarchyByCity(
    selectedCityId ? parseInt(selectedCityId) : null
  )

  

  
    useEffect(()=>{
        if (selectDepartmentId===undefined)
         return;
       const parent = Utils.findNode(branchDepartment, selectDepartmentId, "id");
       
       if (parent)
       {
           if (parent.branches.length>0)
           {
            setValue("branchDepartmentId",parent.branches[0].id)
           }
           else
           {
               setValue("branchDepartmentId",null)

             setBranches([]);
           }
           
           setBranches(parent.branches)
       }
       else
       {
           setBranches([])
           setValue("branchDepartmentId",null)
               
   
       }
   
    },[selectDepartmentId])

    


  const {
    data: freeAppointments,
    isLoading: freeAppointmentsLoading,
    refetch,
  } = useQuery({
    queryKey: ['freeList', watchReserveDate, watchBranchDepartmentId],
    queryFn: () =>
      apiServices.appointment.freeAppointmentList(watchBranchDepartmentId, watchReserveDate),
    enabled: false, // disable auto-fetch
  });

  const reserveMutation = useMutation({
    mutationFn: async (data) => {
      return apiServices.appointment.reserve(data);
    },
    onSuccess: () => {
    },
    onError: (err) => {

    }
  });


  useEffect(() => {

    setValue("appointmentId",null);
    console.log("WatchReserver changes",watchBranchDepartmentId)
    if (watchReserveDate && watchBranchDepartmentId) {
     refetch(); 
    }

  }, [watchReserveDate, watchBranchDepartmentId])


  const onSubmit = (data) => {
    reserveMutation.mutate(data)
  }



  return (
    <div dir="rtl" className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>رزرو وقت حضوری</CardTitle>
            <UIButton variant="outline" onClick={() => navigate('/appointments')}>مشاهده لیست</UIButton>
          </div>
          <CardDescription>برای دریافت خدمات، لطفا فرم زیر را تکمیل و ارسال نمایید.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2 ">
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
                      value={value}
                      onChange={onChange}
                    />)}
                />


              </div>
              <div className="grid gap-2 w-full">
                <Label className="pb-4" htmlFor="city">تاریخ</Label>

                <PersianDatePicker
                  name="reserveDate"
                  control={control}
                  errors={errors}
                  label=""
                />

              </div>

                  <div className="grid gap-2    ">
                <Label htmlFor="departmentId">واحد</Label>

          <TreeViewField
              data={branchDepartment??[]}
                placeholder="یک مورد را انتخاب کنید..."
               value={selectDepartmentId}
               onChange={setSelectDepartmentId}
               idKey="id"
                titleKey="title"
               />

              </div>

              <div className="grid gap-2   ">
                <Label htmlFor="branch">ساختمان</Label>

              <Controller
                  name="branchDepartmentId"
                  control={control}
                  rules={{ required: 'لطفاً ساختمان را انتخاب کنید' }}
                  render={({ field: { value, onChange } }) => (
                    <ComboboxField
                      options={branches || []}
                      placeholder="انتخاب شعبه"
                      idKey="id"
                      titleKey="title"
                      value={value}
                      isLoading={branchDepartmentLoading}
                      onChange={onChange}
                    />)}
                />


        {errors.branchDepartmentId && <span className="text-red-500">ساختمان را انتخاب کنید</span>}



              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="time">ساعت مراجعه</Label>

                <Controller
                  name="appointmentId"
                  control={control}
                  rules={{ required: 'لطفاً شعبه را انتخاب کنید' }}
                  render={({ field: { value, onChange } }) => (
                    <ComboboxField
                      options={freeAppointments?.data || []}
                      placeholder="انتخاب ساعت مراجعه"
                      idKey="id"
                      titleKey="time"
                      value={value}
                      isLoading={freeAppointmentsLoading}
                      onChange={onChange}
                    />)}
                />

        {errors.appointmentId && <span className="text-red-500">ساعت مراجعه را انتخاب کنید</span>}

              </div>
              <div className="grid gap-2  md:col-span-2 " >
                <Label htmlFor="subject">علت حضور</Label>
                <Input id="description"
                  error={errors.description}
                  {...register('description')}
                  placeholder="مثال: پیگیری پرونده"
                />
              </div>
            </div>
            <AlertModal
              type={reserveMutation.isError ? "error" : reserveMutation.isSuccess ? "success" : undefined}
              message={
                reserveMutation.isError
                  ? reserveMutation.error?.message
                  : reserveMutation.isSuccess
                    ? "با موفقیت ثبت شد. در لیست رزروها نتیجه را ببینید."
                    : ""
              }
              show={reserveMutation.isError || reserveMutation.isSuccess}
              onClose={() => {
                if (reserveMutation.isSuccess) {
                  navigate("/appointments"); // مسیر لیست رزروها
                }
                reserveMutation.reset();

              }}
              autoClose={true}
              autoCloseDelay={5000}
            />

            <div className="flex justify-end pt-2">
              <Button isLoading={reserveMutation.isPending} type="submit">ثبت درخواست</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReserveAppointmentPage;


