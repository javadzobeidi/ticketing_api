using Microsoft.AspNetCore.Mvc;
using Application;
using KhzCeoTicketingApi.Application.Departments;
using KhzCeoTicketingApi.Application.Users;
using Microsoft.AspNetCore.Authorization;

namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("admin/role")]
public class AdminRoleController : ApiControllerBase
{
    private readonly ILogger<AdminRoleController> _logger;
    public AdminRoleController(ILogger<AdminRoleController>  logger)
    {
        _logger = logger;
    }

    
    [HttpGet]
    public async Task<IActionResult> GetUser()
    {
        var result=await Mediator.Send(new GetRolesQuery());
        return Success(result);
    }
    
    
   
   
}