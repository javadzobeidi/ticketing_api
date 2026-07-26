import { z } from 'zod';

export const updateUserSchema = z.object({
  userId:z.number(),

  userName: z.string()
    .min(1, 'نام کاربری اجباری است '),

  mobile: z.string()
    .min(10, 'شماره موبایل باید حداقل ۱۰ رقم باشد')
    .regex(/^[0-9]+$/, 'شماره موبایل باید فقط شامل اعداد باشد'),
  
  firstName: z.string()
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(50, 'نام باید کمتر از ۵۰ کاراکتر باشد'),
  
  lastName: z.string()
    .min(3, 'نام خانوادگی باید حداقل 3 کاراکتر باشد')
    .max(50, 'نام خانوادگی باید کمتر از ۵۰ کاراکتر باشد'),
  
  cityId: z.number()
    .min(1, 'لطفاً یک شهر را انتخاب کنید'),
  
  
  nationalCode: z.string()
    .length(10, 'کد ملی باید دقیقاً ۱۰ رقم باشد')
    .regex(/^[0-9]+$/, 'کد ملی باید فقط شامل اعداد باشد'),

    isActive: z.boolean(),
    roleId:z.number(),
    localNumber:z.string().optional(),
   
    branchDepartments: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
      })
    )
    .transform(items => items.map(i => i.id))
    

});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
