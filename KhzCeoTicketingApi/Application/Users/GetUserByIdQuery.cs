using Application.Common.Exceptions;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using MrSmsApi.Application.Common.Interfaces;
using System;
using System.CodeDom;
using System.Net;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using LinqKit;
using Microsoft.AspNetCore.Identity;

namespace KhzCeoTicketingApi.Application.Users;

public sealed record GetUserByIdQuery(long userId) : IQuery<UserProfileDto>
{
  
}

public sealed class GetUserByIdQueryHandler(IApplicationDbContext context,
    ILogger<RegisterUserCommand> _logger,IWebHostEnvironment env) : IQueryHandler<GetUserByIdQuery, UserProfileDto>
{

    public async ValueTask<UserProfileDto> Handle(GetUserByIdQuery command, CancellationToken cancellationToken)
    {
     var user= await  context.Users.Where(d=>d.UserId==command.userId).Select(u=>new UserProfileDto
        {
            UserId=u.UserId,
          FirstName  = u.FirstName,
          LastName  = u.LastName,
          NationalCode  = u.NationalCode,
          CityId = u.CityId,
          IsActive = u.IsActive,
        Mobile    = u.Mobile,
        Identity = u.IdentityKey,
        LocalNumber = u.LocalNumber,
        RoleId = u.Roles.Select(r=>r.Id).FirstOrDefault(),
        Role= u.Roles.Select(r=>r.Title).FirstOrDefault(),
        Permissions =u.Roles.SelectMany(r=>r.RolePermissions).Select(p=>p.Permission.Code).ToList(),
        UserDepartments=u.UserDepartments.Select(d=>new UserDepartmentDto
        {
            Id = d.Id,
            Title =" واحد " + d.Department.Title+" شعبه "+d.Branch.Title,
            DepartmentId = d.DepartmentId,
            City = d.Branch.City.Title,
            CityId = d.Branch.CityId,
            BranchId = d.BranchId
        }).ToList()
        }).FirstOrDefaultAsync(cancellationToken);

        var predicate = PredicateBuilder.New<BranchDepartment>(false);
       
        var branches= user.UserDepartments.Select(d => new
        {
            d.BranchId,
            d.CityId,
            d.DepartmentId
        }).ToList();
        foreach (var filter in branches)
        {
            var localFilter = filter; 
    
            predicate = predicate.Or(appt => 
                appt.Branch.CityId == localFilter.CityId &&
                appt.DepartmentId == localFilter.DepartmentId &&
                appt.BranchId == localFilter.BranchId
            );
        }

        if (branches.Count() > 0)
        {


            user.BranchDepartments = await context.BranchDepartments.AsExpandable()
                .Where(predicate)
                .Select(d => new BranchDepartmentDto
                {
                    Id = d.Id,
                    Title = " شهر" + d.Branch.City.Title + " واحد " + d.Department.Title + " شعبه " + d.Branch.Title,
                    DepartmentId = d.DepartmentId,
                    City = d.Branch.City.Title,
                    CityId = d.Branch.CityId,
                    BranchId = d.BranchId

                })
                .AsNoTracking()
                .ToListAsync();
        }
        


        return user;
    }

  }



