using Application;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Application.Users;
using KhzCeoTicketingApi.Infrastructure.Data;
using KhzCeoTicketingApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KhzCeoTicketingApi.Controllers;

[ApiController]
[Route("[controller]")]
public class DashboardController:ApiControllerBase
{     
    private readonly ICaptchaService _captchaService;
    private readonly IWebHostEnvironment _env;

    public DashboardController(ICaptchaService captchaService, IWebHostEnvironment env)
    {
        _captchaService = captchaService;
        _env = env;
        
    }

    [HttpGet]
    [Authorize]
    [Route("user")]
    public async Task<IActionResult> DashboardUser()
    {
        var command =await Mediator.Send(new GetDashboardUserCommand());
        return Success(command);


    }
  
}