using Application;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Application.Reports;
using KhzCeoTicketingApi.Application.Users;
using KhzCeoTicketingApi.Infrastructure.Data;
using KhzCeoTicketingApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KhzCeoTicketingApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportController:ApiControllerBase
{     
    private readonly ICaptchaService _captchaService;
    private readonly IWebHostEnvironment _env;

    public ReportController(ICaptchaService captchaService, IWebHostEnvironment env)
    {
        _captchaService = captchaService;
        _env = env;
        
    }

    [HttpPost]
    [Authorize]
    [Route("expertperformance")]
    public async Task<IActionResult> ListExperts(GetExpertPerformanceQuery request)
    {
        var command =await Mediator.Send(request);
        return Success(command);


    }
    
    [HttpPost]
    [Authorize]
    [Route("departments")]
    public async Task<IActionResult> Departments(GetDepartmentPerformanceQuery request)
    {
        var command =await Mediator.Send(request);
        return Success(command);
    }
    
  
}