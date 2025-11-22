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
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Identity;

namespace KhzCeoTicketingApi.Application.Users;

public sealed record UpdateUserCommand : ICommand<UserDto>
{
    public int UserId { set; get; }
    public string UserName { set; get; }
    public string FirstName { set; get; }
    public string LastName { set; get; }
    public bool IsActive { set; get; }
    public string Mobile { set; get; }
    public int  RoleId { set; get; }
    public string? LocalNumber { set; get; }
    public List<int> BranchDepartments { set; get; } = new();

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

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("نام کاربری نمی‌تواند خالی باشد.")
            .MaximumLength(50).WithMessage("نام کاربری نباید بیشتر از ۵۰ کاراکتر باشد.");
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

    var countUserExis= await _context.Users.Where(d => d.UserName == command.UserName && d.UserId != command.UserId).CountAsync();
    if (countUserExis > 0)
        throw new Exception("نام کاربری تکراری است");
    
        
        var user = await _context.Users.Where(d => d.UserId==command.UserId)
            .Include(d=>d.Roles)
            .Include(d=>d.UserDepartments)
            .Include(d=>d.City)
            .FirstOrDefaultAsync(cancellationToken);
        if (user == null) 
            throw new Exception("کاربر یافت نشد");
        
        user.Roles.Clear();
        user.AddRole(currentRole);
        
        user.UserDepartments.Clear();

       var branchDepartments=await _context.BranchDepartments.Where(d => command.BranchDepartments.Contains(d.Id)).AsNoTracking().ToListAsync();
       if (branchDepartments.Count() != command.BranchDepartments.Count)
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
        
        user.FirstName=command.FirstName;
        user.LastName=command.LastName;
        user.IsActive = command.IsActive;
        user.Mobile = command.Mobile;
        user.LocalNumber = command.LocalNumber;
        user.UserName=command.UserName;
        
         await _context.SaveChangesAsync(cancellationToken);

        return UserDto.From(user);

    }

    }



