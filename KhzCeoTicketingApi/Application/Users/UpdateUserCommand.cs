﻿using Application.Common.Exceptions;
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
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Identity;

namespace KhzCeoTicketingApi.Application.Users;

public sealed record UpdateUserCommand : ICommand<UserDto>
{
    public int UserId { set; get; }
    public string FirstName { set; get; }
    public string LastName { set; get; }
    public int  RoleId { set; get; }
    public List<int> UserDepartments { set; get; } = new();

}

public record UserDepartment
{
    public int DepartmentId { set; get; }

    public int BranchId { set; get; }
    
}

public class UpdateUserCommandValidation : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserCommandValidation()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("نام نمی‌تواند خالی باشد.")
            .MaximumLength(50).WithMessage("نام نباید بیشتر از ۵۰ کاراکتر باشد.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("نام خانوادگی نمی‌تواند خالی باشد.")
            .MaximumLength(50).WithMessage("نام خانوادگی نباید بیشتر از ۵۰ کاراکتر باشد.");

       
    }

}

public sealed class UpdateUserCommandHandler : ICommandHandler<UpdateUserCommand, UserDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<UpdateUserCommand> _logger;
    private readonly IWebHostEnvironment _env;

    public UpdateUserCommandHandler(IApplicationDbContext context,ILogger<UpdateUserCommand> logger,
          IWebHostEnvironment env)
    {
        _context = context;
        _logger = logger;
        _env = env;

    }

    public async ValueTask<UserDto> Handle(UpdateUserCommand command, CancellationToken cancellationToken)
    {
        if (_env.IsProduction())
        {
        }

      var currentRole= await _context.Roles.Where(r => r.Id == command.RoleId).FirstOrDefaultAsync();
      if (currentRole == null)
          throw new NotFoundException("رول کاربر یافت نشد");
      
        
        var user = await _context.Users.Where(d => d.UserId==command.UserId).FirstOrDefaultAsync(cancellationToken);
        if (user == null) 
            throw new Exception("کاربر یافت نشد");
        
        user.Roles.Clear();
        user.AddRole(currentRole);
        
        user.UserDepartments.Clear();


       var branchDepartments=await _context.BranchDepartments.Where(d => command.UserDepartments.Contains(d.Id)).AsNoTracking().ToListAsync();
       if (branchDepartments.Count() != command.UserDepartments.Count)
           throw new NotFoundException("کد واحد سازمان درست نیست");
       
        foreach (var d in branchDepartments)
        {
            user.UserDepartments.Add(new Domains.Entities.UserDepartment
                {
                    BranchId =d.BranchId,
                    DepartmentId = d.DepartmentId
                    
                }
                
                );
            

        }
        
         await _context.SaveChangesAsync(cancellationToken);

        return UserDto.From(user);

    }

    }



