using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using KhzCeoTicketingApi.Application.Users;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace KhzCeoTicketingApi;

public static class ApplicationService
{
    public static void AddApplicationAuthorization(this IServiceCollection services, IConfiguration configuration)
    {

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;

        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["JwtConfig:Issuer"],
                ValidAudience = configuration["JwtConfig:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtConfig:Key"]))
            };

            // Extract token from cookie
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["khzco"];
                    return Task.CompletedTask;
                },
                OnTokenValidated = async context =>
                {
                    try
                    {

                        var userId = context.Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                        var jti = context.Principal?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
                        if (string.IsNullOrEmpty(jti) == true)
                        {
                            await context.HttpContext.SignOutAsync();
                            return;
                        }

                        var jtiParse = Guid.Parse(jti);


                        if (string.IsNullOrEmpty(userId))
                        {
                            await context.HttpContext.SignOutAsync();
                            return;
                        }

                        var mediator = context.HttpContext.RequestServices.GetRequiredService<IMediator>();
                        var user = await mediator.Send(new GetUserByIdQuery(long.Parse(userId)));
                        if (!user.IsActive)
                        {
                            await context.HttpContext.SignOutAsync();
                            return;
                        }

                        if (jtiParse != user.Identity)
                        {
                            await context.HttpContext.SignOutAsync();
                            return;
                        }


                        var claims = new List<Claim>
                        {
                            new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                            new(JwtRegisteredClaimNames.Jti, user.Identity.ToString()),

                        };
                        foreach (var r in user.Permissions)
                        {
                            claims.Add(new Claim(ClaimTypes.Role, r));
                        }

                        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                        context.Principal = new ClaimsPrincipal(identity);
                    }
                    catch (Exception e)
                    {
                        context.Fail("cannot authorize ");
                    }


                    //   return Task.CompletedTask;

                }
            };
        });

    }
    
}