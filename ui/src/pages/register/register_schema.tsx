import { z } from 'zod';
const persianRegex = /^[\u0600-\u06FF\u200C]+(\s[\u0600-\u06FF\u200C]+)?$/u;
const persianMultiNameRegex =
  /^[\u0600-\u06FF\u200C]+(\s+[\u0600-\u06FF\u200C]+)*$/u;
export const registerSchema = z.object({
  mobile: z.string()
    .min(10, 'شماره موبایل باید حداقل ۱۰ رقم باشد')
    .regex(/^[0-9]+$/, 'شماره موبایل باید فقط شامل اعداد باشد'),
  
  firstName: z.string()
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(50, 'نام باید کمتر از ۵۰ کاراکتر باشد')
    .refine((s) => persianRegex.test(s), {
    message: "فقط حروف فارسی و فاصله مجاز است.",
  })

    ,
  
  lastName: z.string()
    .min(3, 'نام خانوادگی باید حداقل 3 کاراکتر باشد')
    .max(50, 'نام خانوادگی باید کمتر از ۵۰ کاراکتر باشد')
    .refine((s) => persianMultiNameRegex.test(s), {
    message: "فقط حروف فارسی و فاصله مجاز است.",
  }),
  
  cityId: z.number()
    .min(1, 'لطفاً یک شهر را انتخاب کنید'),
  
  password: z.string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .regex(/[A-Z]/, 'رمز عبور باید حداقل یک حرف بزرگ انگلیسی داشته باشد')
    .regex(/[a-z]/, 'رمز عبور باید حداقل یک حرف کوچک انگلیسی داشته باشد')
    .regex(/[0-9]/, 'رمز عبور باید حداقل یک عدد داشته باشد'),
  
  nationalCode: z.string()
    .length(10, 'کد ملی باید دقیقاً ۱۰ رقم باشد')
    .regex(/^[0-9]+$/, 'کد ملی باید فقط شامل اعداد باشد'),

    captcha_answer: z.string()
        .min(1, 'جواب امنیتی  را وارد کنید')
        
});

export type RegisterFormData = z.infer<typeof registerSchema>;
