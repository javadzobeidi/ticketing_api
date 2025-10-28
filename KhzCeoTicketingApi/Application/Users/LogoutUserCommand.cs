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
using KhzCeoTicketingApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace KhzCeoTicketingApi.Application.Users;

public sealed record LogoutUserCommand() : IQuery<bool>
{
  
}



public sealed class LogoutUserCommandHandler(
    IApplicationDbContext context,
    ILogger<RegisterUserCommand> _logger,
    IUser user,
    IOptions<JwtConfig> persistenceOptions,
    IWebHostEnvironment env) : IQueryHandler<LogoutUserCommand, bool>
{
    public async ValueTask<bool> Handle(LogoutUserCommand command, CancellationToken cancellationToken)
    {
        var entity =await context.Users.Where(d => d.UserId==user.UserId).FirstOrDefaultAsync();

        if (entity == null)
        {
            throw new NotFoundException("نام کاربری و رمز عبور اشتباه است");
        }
    var IdentityKey=  Guid.NewGuid();

       var claims = new List<Claim>
       {
           new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
           new Claim(JwtRegisteredClaimNames.Jti, IdentityKey.ToString()),

       };
       
       entity.IdentityKey = IdentityKey;

       await context.SaveChangesAsync(cancellationToken);

       return true;
    }
    
    

}
    
  



