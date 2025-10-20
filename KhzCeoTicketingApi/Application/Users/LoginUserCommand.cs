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

public sealed record LoginUserCommand(string userName,string password) : IQuery<UserLoginTokenResponse>
{
  
}

public class LoginUserCommandValidator : AbstractValidator<LoginUserCommand>
{
    private readonly IApplicationDbContext _context;

    public LoginUserCommandValidator(IApplicationDbContext context)
    {
        _context = context;
        
        RuleFor(v => v.userName)
            .NotEmpty().WithMessage("نام کاربری  اجباری است");
        //.MustAsync(BeUniqueTitle).WithMessage("The specified title already exists.");
        RuleFor(v => v.password)
            .NotEmpty().WithMessage("رمز عبور  اجباری است");

    }

   
}


public sealed class LoginUserCommandHandler(
    IApplicationDbContext context,
    ILogger<RegisterUserCommand> _logger,
    IOptions<JwtConfig> persistenceOptions,
    IWebHostEnvironment env) : IQueryHandler<LoginUserCommand, UserLoginTokenResponse>
{

    public async ValueTask<UserLoginTokenResponse> Handle(LoginUserCommand command, CancellationToken cancellationToken)
    {
       var user= context.Users.Where(d => d.NationalCode == command.userName).FirstOrDefault();
       if (user == null)
       {
           throw new NotFoundException("نام کاربری و رمز عبور اشتباه است");
       }
        
         
       if (PasswordHasher.ComputeHash(command.password, user.PasswordSalt, 3).CompareTo(user.Password) != 0)
       {
           throw new NotFoundException("نام کاربری و رمز عبور اشتباه است");
       }
       
       var IdentityKey=  Guid.NewGuid();

       var claims = new List<Claim>
       {
           new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
           new Claim(JwtRegisteredClaimNames.Jti, IdentityKey.ToString()),

       };
       var claimsIdentity = new ClaimsIdentity(claims, "Cookies");
       var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

       UserLoginTokenResponse userToken = new UserLoginTokenResponse();
       
       var jwt = GenerateJwtToken(claims);
       userToken.UserId=user.UserId;
       userToken.Token=jwt;
       
       
       user.IdentityKey = IdentityKey;

       await context.SaveChangesAsync(cancellationToken);
       return userToken;
       
    }
    
    private string GenerateJwtToken(List<Claim> claims)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(persistenceOptions.Value.Key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: persistenceOptions.Value.Issuer,
            audience: persistenceOptions.Value.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(3),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    

}
    
  



