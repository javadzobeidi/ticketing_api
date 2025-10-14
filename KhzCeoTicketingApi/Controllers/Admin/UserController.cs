using Microsoft.AspNetCore.Mvc;
using Application;
using KhzCeoTicketingApi.Application.Users;
using Microsoft.AspNetCore.Authorization;

namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("admin/[controller]")]

public class AdminUserController : ApiControllerBase
{
    private readonly ILogger<UserController> _logger;
    public AdminUserController(ILogger<UserController>  logger)
    {
        _logger = logger;
    }

    
    [HttpPut]
    [Authorize(Roles="Admin")]
    public async Task<IActionResult> GetUser(RegisterUserCommand command)
    {
        var result=await Mediator.Send(command);
        return Success(result);
    }
    
    
    [HttpPut]
    [Authorize(Roles="Admin")]
    public async Task<IActionResult> UpdateUser(RegisterUserCommand command)
    {
       var result=await Mediator.Send(command);
       return Success(result);
    }
   
   
}