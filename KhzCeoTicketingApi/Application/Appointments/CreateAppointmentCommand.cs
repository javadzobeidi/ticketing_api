using Application.Common.Interfaces;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using Microsoft.EntityFrameworkCore;
using KhzCeoTicketingApi.Application.Extensions;
using KhzCeoTicketingApi.Application.Users;
using KhzCeoTicketingApi.Domains.Enums;

namespace KhzCeoTicketingApi.Application.Branches;

public sealed record CreateAppointmentCommand : ICommand<bool>
{
    public string StartDate { get; set; }
    public string EndDate { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public int IntervalMinutes { get; set; }
    public int UserDepartmentId { set; get; }
    
}


public sealed class CreateAppointmentCommandValidation : AbstractValidator<CreateBranchCommand>
{
    public CreateAppointmentCommandValidation()
    {
     }
}


public sealed class CreateAppointmentCommandHandler(IApplicationDbContext context,IUser user,IMediator mediator) 
    : ICommandHandler<CreateAppointmentCommand, bool>
{
    public async ValueTask<bool> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
    {
       var currentUser=await mediator.Send(new GetUserByIdQuery(user.UserId));
      var currentDepartment= currentUser.UserDepartments.Where(d => d.Id == request.UserDepartmentId).FirstOrDefault();
      if (currentDepartment == null)
          throw new Exception("متاسفانه اطلاعات دریافتی اشتباه است");
       
        
        DateTime? startDateEn = request.StartDate.ToDateTime();
        DateTime? endDateTime = request.EndDate.ToDateTime();
        TimeSpan tStart = TimeSpan.Parse(request.StartTime);
        TimeSpan tEnd = TimeSpan.Parse(request.EndTime);

          var appointments = new List<Appointment>();
                                      
                if (startDateEn > endDateTime)
                {
                    throw new Exception("تاریخ شروع از تاریخ پایان بزرگتر است");
                }

                if (tStart >= tEnd)
                {
                    throw new Exception("ساعت شروع از ساعت پایان بزرگتر است");

                }

                if (request.IntervalMinutes <= 0)
                {
                    throw new Exception("فاصله زمانی انتخاب کنید");
                }

                for (var date = startDateEn; date <= endDateTime; date = date.Value.AddDays(1))
                {
                    var currentDateTime = date.Value.Add(tStart);
                    var dayEndDateTime = date.Value.Add(tEnd);
                    
                    while (currentDateTime.Add(TimeSpan.FromMinutes(request.IntervalMinutes)) <= dayEndDateTime)
                    {
                        var appointment = new Appointment
                        {
                            AppointmentDate = currentDateTime,
                            DepartmentId = currentDepartment.DepartmentId,
                            BranchId = currentDepartment.BranchId,
                            CityId = currentUser.CityId,
                            TimeFa = currentDateTime.ToTime(),
                            DateFa = currentDateTime.ToPersianDate(),
                            AppointmentStatus = AppointmentStatus.NoReserver
                            
                        };
                        
                        
                        appointments.Add(appointment);
                        currentDateTime = currentDateTime.Add(TimeSpan.FromMinutes(request.IntervalMinutes));
                    }
                }

                foreach (var app in appointments)
                {
                    
                    
                }

               await context.Appoinments.AddRangeAsync(appointments);
              await context.SaveChangesAsync(cancellationToken);
              return true;
              
    }
}