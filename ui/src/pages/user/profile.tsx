import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import { apiServices } from '@/src/apis';
import { ComboboxField } from '@/src/components/ui/Combobox';
import { Plus } from 'lucide-react';

import { AlertModal, TreeViewField } from '@/src/components/ui'
import { Badge } from '@/src/components/ui/badge';

import { updateUserSchema, UpdateUserFormData } from './update_userschema';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Utils from '@/src/lib/utils';

interface UserProfileProps {
    profile: any | null;
    cities?: any[];
    roles?: any[];
    localNumber:'',
    branchDepartment?: any[];
    branchDepartmentLoading: boolean,
    selectedCity: number | null;
    onCityChange: (cityId: number) => void;

}

const UserProfile: React.FC<UserProfileProps> = ({ profile, cities, roles,
    branchHierarchy,branchesHierarchyLoading,
  
    selectedCity, onCityChange }) => {
    const queryClient = useQueryClient();
    const params = useParams();
    const userId = params.id ? Number(params.id) : null;

        const [selectDepartmentId, setSelectDepartmentId] = useState();
        const [branches,setBranches]=useState([]);
        const [branchDepartmentId,setBranchDepartmentId]=useState();





    const { register, watch, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            ...profile
        }
    });



    const watchCity = watch("cityId");
    const watchDepartments=watch("branchDepartments")

    const handleAddDepartment = () => {
        const currentDepartments = selectDepartmentId || [];
        const nodeItem = Utils.findNode(branchHierarchy, selectDepartmentId, "id");

        setValue("branchDepartments", [...watchDepartments, {title:nodeItem.title,id:branchDepartmentId}]);
    };


    const updateMutation = useMutation({
        mutationFn: (model: UpdateUserFormData) => apiServices.user.update(model!.userId, model),
        onSuccess: () => {
        },
    });

    useEffect(() => {
        if (watchCity) {
            onCityChange(watchCity)
        }
    }, [watchCity]);


    
	 useEffect(()=>{
     if (selectDepartmentId===undefined)
      return;
    const parent = Utils.findNode(branchHierarchy, selectDepartmentId, "id");
    
    if (parent)
    {
        if (parent.branches.length>0)
        {
setBranchDepartmentId(parent.branches[0].id)
        }
        else
        {
            setBranchDepartmentId(null)
          setBranches([]);
        }
        
        setBranches(parent.branches)
    }
    else
    {
        setBranches([])
                setBranchDepartmentId(null)

    }

 },[selectDepartmentId])





    const onSubmit = (data) => {
        updateMutation.mutate(data);

    }

    console.log(errors)


    return (
        <div dir="rtl" className="space-y-8">


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 space-x-4 grid grid-cols-1 md:grid-cols-2 gaps-4">

            <div className="grid gap-2">
                    <Label htmlFor="title">نام کاربری  </Label>
                    <Input
                        id="userName"
                        {...register('userName')}
                        error={errors.userName}
                        placeholder="مثال:  175"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="title">نام </Label>
                    <Input
                        id="title"
                        {...register('firstName')}
                        error={errors.firstName}
                        placeholder="مثال:  علی"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="title">نام خانوادگی </Label>
                    <Input
                        id="title"
                        {...register('lastName')}
                        error={errors.lastName}
                        placeholder="مثال:  محمدی"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="title">کد ملی</Label>
                    <Input
                        id="nationalCode"
                        {...register('nationalCode')}
                        error={errors.nationalCode}
                        placeholder="مثال:  175"
                    />
                </div>


                <div className="grid gap-2">
                    <Label htmlFor="title">شماره موبایل </Label>
                    <Input
                        id="mobile"
                        {...register('mobile')}
                        error={errors.firstName}
                        placeholder="مثال:  0916"
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
                                value={value}
                                onChange={onChange}
                            />)}
                    />

                </div>

                <div className="grid gap-2 ">
                    <Label htmlFor="city">نقش کاربر</Label>
                    <Controller
                        name="roleId"
                        control={control}
                        rules={{ required: 'لطفاً نقش را انتخاب کنید' }}
                        render={({ field: { value, onChange } }) => (
                            <ComboboxField
                                options={roles || []}
                                placeholder="انتخاب شهر"
                                idKey="id"
                                titleKey="title"
                                value={value}
                                onChange={onChange}
                            />)}
                    />
                </div>
               
                 <div className="grid gap-2">
                    <Label htmlFor="title">شماره تلفن داخلی </Label>
                    <Input
                        id="localNumber"
                        {...register('localNumber')}
                        error={errors.nationalCode}
                        placeholder="مثال:  1015"
                    />
                </div>
                      <div className="flex items-center gap-2 pt-5 px-10">
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                id="isActive"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <Label htmlFor="isActive">فعال</Label>
                </div>

                

                <div className="grid gap-2 max-w-md md:col-span-2 ">
                <Label htmlFor="departmentId">واحد</Label>
                  <TreeViewField
              data={branchHierarchy??[]}
                placeholder="یک مورد را انتخاب کنید..."
               value={selectDepartmentId}
               onChange={setSelectDepartmentId}
               idKey="id"
                titleKey="title"
               />

              </div>

              
   <div className="grid gap-2 md:col-span-2 max-w-md   ">
                <Label htmlFor="branch">ساختمان</Label>

              
                    <ComboboxField
                      options={branches || []}
                      placeholder="انتخاب شعبه"
                      idKey="id"
                      titleKey="title"
                      value={branchDepartmentId}
                      isLoading={branchesHierarchyLoading}
                      onChange={setBranchDepartmentId}
                    />
                
                    <Plus className="h-4 w-4 text-red-500 cursor-pointer" onClick={() => handleAddDepartment()} />
                        <div>

                        {watchDepartments?.map(d => (
                            <Badge key={d.id} variant="secondary">{d.title}</Badge>
                        ))}


                    </div>


              </div>







                <div className="grid gap-2 md:col-span-2 max-w-md">
                    <Label htmlFor="city">شعبه و واحد </Label>

                
                </div>





          

                




                <AlertModal
                    type={updateMutation.isError ? "error" : updateMutation.isSuccess ? "success" : undefined}
                    message={
                        updateMutation.isError
                            ? updateMutation.error?.message
                            : updateMutation.isSuccess
                                ? "اطلاعات شما با موفقیت ثبت شد"
                                : ""
                    }
                    show={updateMutation.isError || updateMutation.isSuccess}
                    onClose={() => {
                        if (updateMutation.isSuccess) {

                        }
                        updateMutation.reset();
                    }}
                    autoClose={true}
                    autoCloseDelay={5000}
                />

                <Button type="submit" isLoading={updateMutation.isPending}>
                    به روز رسانی
                </Button>



            </form>

        </div>
    );
};

export default UserProfile;
