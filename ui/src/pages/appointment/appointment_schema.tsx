
import { z } from 'zod';

  
  export interface AppointmentSchedule {
   
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    intervalMinutes: number;
    userDepartmentId: number;
  }
  
  
  // Zod validation schema
  export const appointmentSchema = z.object({
    startDate: z.string().min(1, 'لطفا تاریخ شروع را انتخاب کنید'),
    endDate: z.string().min(1, 'لطفا تاریخ پایان را انتخاب کنید'),
    startTime: z.string().min(1, 'لطفا ساعت شروع را انتخاب کنید'),
    endTime: z.string().min(1, 'لطفا ساعت پایان را انتخاب کنید'),
    intervalMinutes: z.string().min(1, 'لطفا فاصله زمانی را انتخاب کنید'),
    city: z.string().optional(),
    branch: z.string().optional(),
    userDepartmentId: z.number(),
  });
  
  export type AppointmentFormData = z.infer<typeof appointmentSchema>;
  