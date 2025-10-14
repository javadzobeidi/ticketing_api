using KhzCeoTicketingApi.Application.Branches;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.AspNetCore.Mvc;
using Application;


namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("[controller]")]
public class BranchDepartmentController : ApiControllerBase
{
    private readonly ILogger<BranchDepartmentController> _logger;
    
    public BranchDepartmentController(ILogger<BranchDepartmentController> logger)
    {
        _logger = logger;
    }


}