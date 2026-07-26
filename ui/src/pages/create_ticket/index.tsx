import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { ComboboxField } from '@/src/components/ui/Combobox';
import { Upload, X, FileText, Send } from "lucide-react";
import { useBranchByCity, useBranchHierarchyByCity, useCities } from '@/src/lib/useQueries';
import { useMutation } from '@tanstack/react-query';
import { apiServices } from '@/src/apis';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {CreateTicketFormData, createTicketSchema} from './create_schema'
import { toast } from 'sonner';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { TreeViewField } from '@/src/components/ui';
import Utils from '@/src/lib/utils';

export default function CreateTicket() {
  const [files, setFiles] = useState<File[]>([])
  const navigate = useNavigate();

  const { userInfo } = useOutletContext();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      cityId: undefined,
      branchDepartmentId: undefined,
      message: "",
    }
  });

  const { data: cities, isLoading: citiesLoading } = useCities()
  const cityId = watch('cityId');
    const [selectDepartmentId, setSelectDepartmentId] = useState();


const [branches,setBranches]=useState([]);

  const { data: branchHierarchy, isLoading: branchesHierarchyLoading } = useBranchHierarchyByCity(
    cityId ? parseInt(cityId) : null
  )



 useEffect(()=>{
     if (selectDepartmentId===undefined)
      return;
    const parent = Utils.findParent(branchHierarchy, selectDepartmentId, "id");

    if (parent)
      setBranches(parent.branches)
 },[selectDepartmentId])
  



  // Mutation for creating ticket
  const createTicketMutation = useMutation({
    mutationFn: (formData: FormData) => apiServices.ticket.create(formData),
    onSuccess: (data) => {
      reset();
      toast("با موفقیت ثبت شد");
      setFiles([]);
      if (userInfo.roleId == 2)
        navigate("/tickets")
      else
        navigate("/manage-tickets");
    },
    onError: (error) => {
      console.error("Error creating ticket:", error);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  }

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }

  const onSubmit = (data: z.infer<typeof createTicketSchema>) => {
    const formData = new FormData();
    
    // Append form fields
    formData.append('cityId', data.cityId);
    formData.append('branchDepartmentId', data.branchDepartmentId);
    formData.append('message', data.message);
    formData.append("departmentId",selectDepartmentId);
    // Append all files
    files.forEach((file) => {
      formData.append('attachments', file);
    });

    // Submit the form
    createTicketMutation.mutate(formData);
  }


  return (
    <div dir="rtl" className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>ایجاد تیکت جدید</CardTitle>
          </div>
          <CardDescription>لطفا اطلاعات تیکت خود را با دقت وارد کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {errors.cityId && (
                  <p className="text-sm text-destructive mt-1">{errors.cityId.message}</p>
                )}
              </div>

             
              <div className="grid gap-2    ">
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
                      isLoading={branchesHierarchyLoading}
                      onChange={onChange}
                    />)}
                />

        {errors.branchDepartmentId && <span className="text-red-500">شعبه را انتخاب کنید</span>}



              </div>


              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="message">توضیحات</Label>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="message"
                      placeholder="توضیحات کامل مشکل یا درخواست خود را بنویسید..."
                      className="min-h-40 resize-none"
                    />
                  )}
                />
                {errors.message && (
                  <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                )}
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="attachment">پیوست‌ها</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
                  <input
                    type="file"
                    id="attachment"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    multiple
                  />
                  <label htmlFor="attachment" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground mb-1">
                        برای آپلود کلیک کنید یا فایل‌ها را بکشید
                      </p>
                      <p className="text-sm text-muted-foreground">PNG, JPG, PDF, DOC (حداکثر 10MB هر فایل)</p>
                    </div>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl border-2 border-border bg-card hover:bg-muted/50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                className="flex items-center gap-2"
                disabled={createTicketMutation.isPending}
              >
                <Send className="w-4 h-4" />
                {createTicketMutation.isPending ? 'در حال ارسال...' : 'ایجاد تیکت'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

