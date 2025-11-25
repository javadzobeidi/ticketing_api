using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Application.Users;
using KhzCeoTicketingApi.Infrastructure.Data;
using KhzCeoTicketingApi.Infrastructure.Data.Interfaces;
using KhzCeoTicketingApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KhzCeoTicketingApi.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController:ApiControllerBase
{     
    private readonly ICaptchaService _captchaService;
    private readonly IWebHostEnvironment _env;
    private readonly ISmsService _smsService;
    public AuthController(ICaptchaService captchaService, IWebHostEnvironment env,ISmsService smsService)
    {
        _captchaService = captchaService;
        _env = env;
        _smsService = smsService;
        
    }
    
    [HttpPost]
    [Route("login")]
    public async Task<ActionResult> Login( UserLoginRequest model )
    {
        if (_env.IsDevelopment() == true)
        {
        }
        else
        {
            if (!_captchaService.VerifyCaptcha(model.captcha_answer,model.captcha_token))
            {
                return Failure("مقدار کپچا درست نیست", null);
            }
        }
        
        var user = await Mediator.Send(new LoginUserCommand(model.Username, model.Password));
        
        GenerateCookie(user);
        
        
        return Success();
    }
    
    [HttpGet]
    [Route("logout")]
    [Authorize]
    public async Task<ActionResult> Logout( )
    {
        if (_env.IsDevelopment() == true)
        {
        }
        else
        {
          
        }

        var user = await Mediator.Send(new LogoutUserCommand());
        
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            Path = "/",                                  // must match original
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(-1), // expired yesterday
        };
        if (_env.IsProduction())
        {
            cookieOptions.Domain = ".khzceo.ir";
        }
     
        Response.Cookies.Append("khzco", "", cookieOptions);

        return Success();
    }
    

    public void GenerateCookie(UserLoginTokenResponse user)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.Now.AddDays(10),
            Path = "/"
        };
        
        if (_env.IsProduction())
        {
            cookieOptions.Domain = ".khzceo.ir";
        }
        Response.Cookies.Append("khzco", user.Token, cookieOptions);

        
    }

    
    [HttpPost]
    [Route("sendotp")]
    public async Task<IActionResult> SendOtp(SendOtpCommand model)
    {   if (_env.IsDevelopment() == true)
        {
        }
        else
        {
            if (!_captchaService.VerifyCaptcha(model.captcha_answer,model.captcha_token))
            {
                return Failure("مقدار کپچا درست نیست", null);
            }
        }

     var result=  await Mediator.Send(model);
     return Success(result);
        
    }
    [HttpPost]
    [Route("verifyotp")]
    public async Task<IActionResult> VerifyOtp(VerifyOtpCommand model)
    { 
        var result=  await Mediator.Send(model);
        GenerateCookie(result);
        return Success();
        
    }
    
    [HttpPost]
    [Authorize]
    [Route("sendotp_changepassword")]
    public async Task<IActionResult> SendOtpChangePassword()
    {  

        var result=  await Mediator.Send(new SendOtpChangePasswordCommand());
        return Success(result);
        
    }
    
    [HttpPost]
    [Authorize]
    [Route("verify_changepassword")]
    public async Task<IActionResult> VerifyChangePassword(VerifyChangePasswordCommand command)
    {  

        var result=  await Mediator.Send(command);
        return Success(result);
        
    }
    
}