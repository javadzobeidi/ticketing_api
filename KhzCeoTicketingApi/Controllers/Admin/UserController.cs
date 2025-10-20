using Microsoft.AspNetCore.Mvc;
using Application;
using KhzCeoTicketingApi.Application.Users;
using Microsoft.AspNetCore.Authorization;

namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("admin/user")]

public class AdminUserController : ApiControllerBase
{
    private readonly ILogger<UserController> _logger;
    public AdminUserController(ILogger<UserController>  logger)
    {
        _logger = logger;
    }

    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(long id)
    {
        var result=await Mediator.Send(new GetUserByIdQuery (id));
        return Success(result);
    }
    [HttpGet]
    public async Task<IActionResult> UserList([FromQuery] string? filter, [FromQuery] int pageNumber = 1,int pageSize=50)
    {
        var result=await Mediator.Send(new GetUsersQuery
        {
            Filter = filter,
            PageNumber = pageNumber,
            PageSize = pageSize
        });
        return Success(result);
    }

    
    [HttpPut]
    public async Task<IActionResult> UpdateUser(RegisterUserCommand command)
    {
       var result=await Mediator.Send(command);
       return Success(result);
    }
   
   
}