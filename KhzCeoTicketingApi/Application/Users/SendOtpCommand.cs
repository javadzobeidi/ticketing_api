using Application.Common.Exceptions;
using Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using MrSmsApi.Application.Common.Interfaces;
using System;
using System.CodeDom;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using KhzCeoTicketingApi.Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Domains.Entities;
using KhzCeoTicketingApi.Infrastructure.Data.Interfaces;
using KhzCeoTicketingApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace KhzCeoTicketingApi.Application.Users;

public sealed record SendOtpCommand : IQuery<OtpResult>
{
    public string Mobile { get; set; }
    public string captcha_answer { set; get; }
    public string captcha_token { set; get; }
  
}

public record OtpResult(Guid id);

public class SendOtpCommandValidator : AbstractValidator<SendOtpCommand>
{
    private readonly IApplicationDbContext _context;
    
    public SendOtpCommandValidator(IApplicationDbContext context)
    {
        _context = context;
        
        RuleFor(v => v.Mobile)
            .NotEmpty().WithMessage("موبایل  اجباری است");
       
        RuleFor(v => v.captcha_token)
            .NotEmpty().WithMessage(" توکن  اجباری است");
    }

}


public sealed class SendOtpCommandHandler(
    IApplicationDbContext context,
    ILogger<RegisterUserCommand> _logger,
    ISmsService smsService,
    IOptions<JwtConfig> persistenceOptions,
    
    IWebHostEnvironment env) : IQueryHandler<SendOtpCommand, OtpResult>
{

    public string GenerateOtp(int length = 4)
    {
        if (length <= 0)
            throw new ArgumentException("Length must be greater than zero");

        Random random = new Random();
        string otp = "";
        for (int i = 0; i < length; i++)
        {
            otp += random.Next(0, 10); // عدد بین 0 تا 9
        }
        return otp;
    }
    
    public async ValueTask<OtpResult> Handle(SendOtpCommand command, CancellationToken cancellationToken)
    {
       var otp= GenerateOtp(4);

     var user= await context.Users.Where(d => d.Mobile == command.Mobile).FirstOrDefaultAsync(cancellationToken);
     if (user == null)
         throw new NotFoundException("کاربر یافت نشده است لطفا ثبت نام کنید");

     var id = Guid.NewGuid();
     var date = DateTime.Now;
     context.OtpSms.Add(new OtpSms
     {
         OtpId = id,
         Mobile = command.Mobile,
         OptDate = date,
         OptDateExpire = date.AddMinutes(3),
         OtpCode = otp

     });

    await context.SaveChangesAsync(cancellationToken);
    string message = $"کد ارسالی: {otp} \nسازمان نظام مهندسی خوزستان \nلغو=11";

   await smsService.SendSMSAsync(command.Mobile, message, user.UserId.ToString());
    

    return new OtpResult(id);
    
    }
    
  
    

}
    
  



