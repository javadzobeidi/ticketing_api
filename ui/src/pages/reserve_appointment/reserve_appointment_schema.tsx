
import { Description } from '@radix-ui/react-dialog';
import { z } from 'zod';

  
  export interface IReserveAppointment {
    appointmentId: number;
    cityId:number;
    branchDepartmentId:number;
    description:string;
  }
  
  
  export const reserveAppointmentSchema= z.object({
    
    appointmentId: z.number(),
        cityId: z.number(),
    branchDepartmentId:z
    .number()
    .refine((val) => val > 0, { message: "واحد را انتخاب کنتد" }),
    description:z.string().min(1, "علت حضور را وارد کنید"),

  });
  
  export type ReserveAppointmentForm = z.infer<typeof reserveAppointmentSchema>;
  