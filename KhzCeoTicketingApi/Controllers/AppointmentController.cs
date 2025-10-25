using KhzCeoTicketingApi.Application.Branches;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.AspNetCore.Mvc;
using Application;
using Microsoft.AspNetCore.Authorization;


namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("[controller]")]
public class AppointmentController : ApiControllerBase
{
    private readonly ILogger<AppointmentController> _logger;
    
    public AppointmentController(ILogger<AppointmentController> logger)
    {
        _logger = logger;
    }
    
 
    
    [HttpPost]
    [Authorize]
    [Route("FreeList")]
    public async Task<ActionResult<BranchDto>> FreeAppointmentList(GetFreeAppointmentsByBranch request)
    {
        var result = await Mediator.Send(request);
        return Success(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<BranchDto>> ReserveAppointment(ReserveAppointmentCommand request)
    {
        var result = await Mediator.Send(request);
        return Success(result);
    }
}