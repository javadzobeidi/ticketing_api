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
          FirstName  = u.FirstName,
          LastName  = u.LastName,
          NationalCode  = u.NationalCode,
          CityId = u.CityId,
        Mobile    = u.Mobile,
        RoleId = u.Roles.Select(r=>r.Id).FirstOrDefault(),
        Role= u.Roles.Select(r=>r.Title).FirstOrDefault(),
        UserDepartments=u.UserDepartments.Select(d=>new ItemValue
        {
            Id = d.Id,
            Title =" شعبه " + d.Department.Title+" واحد "+d.Branch.Title
        }).ToList()
        }).FirstOrDefaultAsync(cancellationToken);
        return user;
    }

  }



