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

public sealed record RegisterUserCommand : ICommand<UserDto>
{
    public string FirstName { set; get; }
    public string LastName { set; get; }
    public string NationalCode { set; get; }
    public string Mobile { set; get; }
    public int CityId { set; get; }
    public string Password { set; get; }
}


public class RegisterUserCommandValidation : AbstractValidator<RegisterUserCommand>
{
    public RegisterUserCommandValidation()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("نام نمی‌تواند خالی باشد.")
            .MaximumLength(50).WithMessage("نام نباید بیشتر از ۵۰ کاراکتر باشد.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("نام خانوادگی نمی‌تواند خالی باشد.")
            .MaximumLength(50).WithMessage("نام خانوادگی نباید بیشتر از ۵۰ کاراکتر باشد.");

        RuleFor(x => x.NationalCode)
            .NotEmpty().WithMessage("کد ملی نمی‌تواند خالی باشد.")
            .Matches(@"^\d{10}$").WithMessage("کد ملی باید شامل ۱۰ رقم باشد.");

        RuleFor(x => x.Mobile)
            .NotEmpty().WithMessage("شماره موبایل نمی‌تواند خالی باشد.")
            .Matches(@"^09\d{9}$").WithMessage("شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد.");


        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("رمز عبور نمی‌تواند خالی باشد.")
            .MinimumLength(6).WithMessage("رمز عبور باید حداقل ۶ کاراکتر باشد.");
    }

}

public sealed class RegisterUserCommandHandler : ICommandHandler<RegisterUserCommand, UserDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<RegisterUserCommand> _logger;
    private readonly IWebHostEnvironment _env;

    public RegisterUserCommandHandler(IApplicationDbContext context,ILogger<RegisterUserCommand> logger,
          IWebHostEnvironment env)
    {
        _context = context;
        _logger = logger;
        _env = env;

    }

    public async ValueTask<UserDto> Handle(RegisterUserCommand command, CancellationToken cancellationToken)
    {
        if (_env.IsProduction())
        {
        }

       var city=await _context.Cities.Where(d => d.Id == command.CityId).FirstOrDefaultAsync();
       if (city == null)
           throw new Exception("شهر انتخاب شده یافت نشده است");

        
        var user = await _context.Users.Where(d => d.NationalCode.Equals(command.NationalCode)).FirstOrDefaultAsync();
        
        if (user != null) 
            throw new Exception("کد ملی قبلا ثبت شده است");

            user = new User();
            _context.Users.Add(user);

      user.FirstName = command.FirstName;
      user.LastName = command.LastName;
      user.NationalCode = command.NationalCode;
      user.CityId =command.CityId;
     user.Mobile = command.Mobile;
     user.City = city;
     user.PasswordSalt = PasswordHasher.GenerateSalt();
     user.Password = PasswordHasher.ComputeHash(command.Password, user.PasswordSalt, 3);
     await _context.SaveChangesAsync(cancellationToken);

        return UserDto.From(user);

    }

    }



