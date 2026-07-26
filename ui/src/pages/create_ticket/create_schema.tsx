
import { z } from 'zod';

export const createTicketSchema = z.object({
    cityId: z.number({ message: "انتخاب شهر الزامی است" }),
    branchDepartmentId: z.number({ message: "انتخاب شعبه الزامی است" }),
    message: z.string()
      .min(10, { message: "توضیحات باید حداقل 10 کاراکتر باشد" })
      .max(1000, { message: "توضیحات نباید بیشتر از 1000 کاراکتر باشد" }),
  });

    export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
  
