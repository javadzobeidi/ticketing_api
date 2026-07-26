"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { ComboboxField } from "@/src/components/ui/Combobox"
import { Upload, X, FileText, Send } from "lucide-react"
import { useCities } from "@/src/lib/useQueries"
import { useQuery } from "@tanstack/react-query"
import { apiServices } from "@/src/apis"
import { useForm, Controller } from 'react-hook-form'

export function NewTicketForm() {
  const [files, setFiles] = useState<File[]>([])
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      cityId: null,
      description: "",
    }
  })

  const { data: cities, isLoading: citiesLoading } = useCities()
  
  // departments removed: this form no longer collects department/unit

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const onSubmitForm = (data: any) => {
    // handle the form data together with files
    console.log('submitted data', data)
    console.log('files', files)
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            ایجاد تیکت جدید
          </CardTitle>
          <p className="text-base text-gray-600 mt-2">لطفا اطلاعات تیکت خود را با دقت وارد کنید</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="city" className="text-base font-semibold text-foreground flex items-center gap-2">
                  شهر <span className="text-destructive text-lg">*</span>
                </Label>
                <Controller
                  control={control}
                  name="cityId"
                  render={({ field: { value, onChange } }) => (
                    <ComboboxField
                      options={cities || []}
                      placeholder="انتخاب شهر"
                      value={value}
                      onChange={onChange}
                      idKey="id"
                      titleKey="name"
                      inputClass="py-3"
                    />
                  )}
                />
              </div>
              {/* department/unit removed per request */}

              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="description" className="text-base font-semibold text-foreground flex items-center gap-2">
                  توضیحات <span className="text-destructive text-lg">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="توضیحات کامل مشکل یا درخواست خود را بنویسید..."
                  className="min-h-40 resize-none border-2 hover:border-primary/50 focus:border-primary transition-colors text-base leading-relaxed"
                  {...register('description', { required: 'لطفا توضیحات را وارد کنید' })}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  💡 لطفا جزئیات کامل را برای حل سریع‌تر مشکل ارائه دهید
                </p>
              </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="attachment" className="text-base font-semibold text-foreground">
                پیوست‌ها
              </Label>
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

            <div className="flex justify-end pt-4">
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
