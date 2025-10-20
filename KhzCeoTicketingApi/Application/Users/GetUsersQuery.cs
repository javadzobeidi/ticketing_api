using Application.Common.Exceptions;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using MrSmsApi.Application.Common.Interfaces;
using System;
using System.CodeDom;
using System.Net;
using KhzCeoTicketingApi.Application.Common;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using Microsoft.AspNetCore.Identity;

namespace KhzCeoTicketingApi.Application.Users;

public sealed record GetUsersQuery() : IQuery<PaginatedList<UserProfileDto>>
{ 
    public string Filter { set; get; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 50;
    
  
}

public sealed class GetUsersQueryHandler(IApplicationDbContext context,
    ILogger<RegisterUserCommand> _logger,IWebHostEnvironment env) : IQueryHandler<GetUsersQuery, PaginatedList<UserProfileDto>>
{

    public async ValueTask<PaginatedList<UserProfileDto>> Handle(GetUsersQuery command, CancellationToken cancellationToken)
    {
        var query = context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(command.Filter))
        {
            query = query.Where(d => d.City.Title.Contains(command.Filter) ||
                                     (d.FirstName + " " + d.LastName).Contains(command.Filter)
                                     || d.Mobile.Contains(command.Filter));

        }

        var user = await query.Select(u => new UserProfileDto
            {
                UserId = u.UserId,
                
                FirstName = u.FirstName,
                LastName = u.LastName,
                NationalCode = u.NationalCode,
                CityId = u.CityId,
                Mobile = u.Mobile,
                RoleId = u.Roles.Select(r => r.Id).FirstOrDefault(),
                Role = u.Roles.Select(r => r.Title).FirstOrDefault(),
                City = u.City.Title,
                UserDepartments = u.UserDepartments.Select(d => new ItemValue
                    {
                        Id = d.Id,
                        Title = " شعبه " + d.Department.Title + " واحد " + d.Branch.Title
                    })
                    .ToList()
            })
            .PaginatedListAsync(command.PageNumber, command.PageSize);

        return user;
    }

  }



