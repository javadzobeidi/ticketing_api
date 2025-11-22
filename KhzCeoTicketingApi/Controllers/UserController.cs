using Microsoft.AspNetCore.Mvc;
using Application;
using Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Users;
using KhzCeoTicketingApi.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("[controller]")]

public class UserController : ApiControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly IUser _user;
    private readonly ICaptchaService _captchaService;
    private readonly IWebHostEnvironment _env;

    public UserController(ILogger<UserController>  logger,IUser user,ICaptchaService captchaService,IWebHostEnvironment env)
    {
        _logger = logger;
        _user = user;
        _captchaService = captchaService;
        _env = env;
    }

    
    [HttpPost]
    public async Task<IActionResult> CreateUser(RegisterUserCommand command)
    {
        if (_env.IsDevelopment())
        {
            if (!_captchaService.VerifyCaptcha(command.captcha_answer,command.captcha_token))
            {
                return Failure("مقدار کپچا درست نیست", null);
            }
        }
   
        
       var result=await Mediator.Send(command);
       return Success(result);
    }

    [HttpGet]
    [Route("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
       var id= _user.UserId;
        var result = await Mediator.Send(new GetUserByIdQuery(id));
        return Success(result);
        
    }
   
   
}