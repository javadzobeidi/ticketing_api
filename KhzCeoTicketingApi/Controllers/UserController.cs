using Microsoft.AspNetCore.Mvc;
using Application;
using KhzCeoTicketingApi.Application.Users;

namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("[controller]")]

public class UserController : ApiControllerBase
{
    private readonly ILogger<UserController> _logger;
    public UserController(ILogger<UserController>  logger)
    {
        _logger = logger;
    }

    
    [HttpPost]
    public async Task<IActionResult> CreateUser(RegisterUserCommand command)
    {
       var result=await Mediator.Send(command);
       return Success(result);
    }
   
   
}