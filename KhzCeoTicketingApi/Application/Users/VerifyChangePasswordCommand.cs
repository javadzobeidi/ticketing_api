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
using KhzCeoTicketingApi.Application.Services;
using KhzCeoTicketingApi.Domains.Entities;
using KhzCeoTicketingApi.Infrastructure.Data.Interfaces;
using KhzCeoTicketingApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace KhzCeoTicketingApi.Application.Users;

public sealed record VerifyChangePasswordCommand : IQuery<bool>
{
    public Guid Id { set; get; }
    public string NewPassword { set; get; }
    

}




public sealed class VerifyChangePasswordCommandHandler(
    IApplicationDbContext context,
    ILogger<RegisterUserCommand> _logger,
    ISmsService smsService,
    IOptions<JwtConfig> persistenceOptions,
    
    IWebHostEnvironment env) : IQueryHandler<VerifyChangePasswordCommand, bool>
{

   
    public async ValueTask<bool> Handle(VerifyChangePasswordCommand command, CancellationToken cancellationToken)
    {

      var result= await context.OtpSms.Where(d => d.OtpId == command.Id).FirstOrDefaultAsync();
      if (result == null)
          throw new NotFoundException("اطلاعات ارسالی یافت نشد");
      
      
     if (DateTime.Now> result.OptDateExpire)
         throw new NotFoundException("کد دوباره دریافت کنید");

     var user = await context.Users.Where(d => d.Mobile == result.Mobile).FirstOrDefaultAsync(cancellationToken);
     
     if (user == null)
         throw new NotFoundException("کاربر یافت نشد");
     
     if (!user.IsActive)
         throw new Exception("  کاربر غیر فعال می باشد");


     user.PasswordSalt = PasswordHasher.GenerateSalt();
     user.Password = PasswordHasher.ComputeHash(command.NewPassword, user.PasswordSalt, 3);
     
     
    

     await context.SaveChangesAsync(cancellationToken);
     return true;
    }
    
  
    

}
    
  



