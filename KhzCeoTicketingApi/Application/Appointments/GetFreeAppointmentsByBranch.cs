using Application.Common.Exceptions;
using FluentValidation;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Application.Extensions;
using KhzCeoTicketingApi.Domains.Enums;
using Microsoft.EntityFrameworkCore;

namespace KhzCeoTicketingApi.Application.Branches;


public sealed record GetFreeAppointmentsByBranch(long BranchDepartmentId,string ReserveDate) : IQuery<List<FreeAppointmentsByBranchResultList>>
{
    
    
}

public record FreeAppointmentsByBranchResultList
{
    public long Id { set; get; }

    public string Time { set; get; }

}

public sealed class GetFreeAppointmentsByBranchValidation : AbstractValidator<GetFreeAppointmentsByBranch>
{
    public GetFreeAppointmentsByBranchValidation()
    {
       
    }
}

public sealed class GetFreeAppointmentsByBranchHandler(IApplicationDbContext context) 
    : IQueryHandler<GetFreeAppointmentsByBranch, List<FreeAppointmentsByBranchResultList>>
{
    
    public async ValueTask<List<FreeAppointmentsByBranchResultList>> Handle(GetFreeAppointmentsByBranch query, CancellationToken cancellationToken)
    {
        DateTime currentDate = query.ReserveDate.ToDateTime();

        
        var branchDepartment =await context.BranchDepartments
            .Where(d => 
                d.Id == query.BranchDepartmentId)
            .Select(d => new
            {
                d.Branch.CityId,
                d.DepartmentId,
                d.BranchId
            })
            .FirstOrDefaultAsync();

        if (branchDepartment is null)
            throw new NotFoundException("اطلاعات ارسالی اشتباه است");

        var appotinetms=context.Appoinments.Where(d =>
                d.AppointmentStatusId == (int)AppointmentStatusEnum.NoReserver &&
                d.AppointmentDate.Date==currentDate.Date &&
                d.BranchId == branchDepartment.BranchId && d.CityId == branchDepartment.CityId &&
                d.DepartmentId == branchDepartment.DepartmentId)
            .Select(d => new FreeAppointmentsByBranchResultList
            {
                Id=d.Id,
                Time   = d.TimeFa
            })
            .ToList();
        
        
        
        return appotinetms;

    }
}

