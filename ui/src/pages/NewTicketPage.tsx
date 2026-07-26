import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { ComboboxField } from '@/src/components/ui/Combobox';
import { Upload, X, FileText, Send } from "lucide-react";
import { useBranchByCity, useCities } from '@/src/lib/useQueries';
import { useQuery } from '@tanstack/react-query';
import { apiServices } from '@/src/apis';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const newTicketSchema = z.object({
  cityId: z.number({message: "انتخاب شهر الزامی است" }),
  branchId: z.number({ message: "انتخاب شعبه الزامی است" }),
  description: z.string()
    .min(10, { message: "توضیحات باید حداقل 10 کاراکتر باشد" })
    .max(1000, { message: "توضیحات نباید بیشتر از 1000 کاراکتر باشد" }),
});

export default function NewTicketPage() {
  const [files, setFiles] = useState<File[]>([])
  
  const form = useForm<z.infer<typeof newTicketSchema>>({
    resolver: zodResolver(newTicketSchema),
    defaultValues: {
      cityId: undefined,
      branchId: undefined,
      description: "",
    },
  });

  const { handleSubmit, control, watch, setValue } = form;

  const { data: cities, isLoading: citiesLoading } = useCities()

  const cityId = watch('cityId');
  const { data: branches, isLoading: branchesLoading } = useBranchByCity(
    cityId ? parseInt(cityId) : null
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const onSubmit = (data: z.infer<typeof newTicketSchema>) => {
    console.log("Form submitted:", data);
    console.log("Files:", files);
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
                  render={({ field, fieldState }) => (
                    <ComboboxField
                      options={cities || []}
                      placeholder="انتخاب شهر"
                      idKey="id"
                      titleKey="name"
                      value={field.value?.toString() || null}
                      isLoading={citiesLoading}
                      onChange={(value) => field.onChange(value ? parseInt(value) : null)}
                    />
                  )}
                />
                {form.formState.errors.cityId && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.cityId.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="branch">شعبه</Label>
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <ComboboxField
                      options={branches || []}
                      placeholder="انتخاب شعبه"
                      idKey="id"
                      titleKey="title"
                      value={field.value?.toString() || null}
                      isLoading={branchesLoading}
                      onChange={(value) => field.onChange(value ? parseInt(value) : null)}
                    />
                  )}
                />
                {form.formState.errors.branchId && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.branchId.message}</p>
                )}
              </div>

            
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="description">توضیحات</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="توضیحات کامل مشکل یا درخواست خود را بنویسید..."
                      className="min-h-40 resize-none"
                    />
                  )}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="attachment">پیوست‌ها</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
                  <input
                    type="file"
                    id="attachment"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <label htmlFor="attachment" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground mb-1">
                        برای آپلود کلیک کنید یا فایل را بکشید
                      </p>
                      <p className="text-sm text-muted-foreground">PNG, JPG, PDF, DOC (حداکثر 10MB)</p>
                    </div>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl border-2 border-border bg-card hover:bg-muted/50 transition-colors group"
                      >
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
              <Button type="submit" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                ایجاد تیکت
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
