using Microsoft.AspNetCore.Mvc;
using Application;
using Application.Common.Interfaces;
using KhzCeoTicketingApi.Application.Users;

namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("[controller]")]

public class UserController : ApiControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly IUser _user;
    public UserController(ILogger<UserController>  logger,IUser user)
    {
        _logger = logger;
        _user = user;
    }

    
    [HttpPost]
    public async Task<IActionResult> CreateUser(RegisterUserCommand command)
    {
       var result=await Mediator.Send(command);
       return Success(result);
    }

    public async Task<IActionResult> Me()
    {
       var id= _user.UserId;
        
        
        var result = await Mediator.Send(new GetUserByIdQuery(id));
        return Success(result);
        
    }
   
   
}