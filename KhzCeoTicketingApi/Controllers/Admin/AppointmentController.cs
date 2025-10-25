using KhzCeoTicketingApi.Application.Branches;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.AspNetCore.Mvc;
using Application;
using Microsoft.AspNetCore.Authorization;


namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("admin/[controller]")]
public class AdminAppointmentController : ApiControllerBase
{
    private readonly ILogger<AppointmentController> _logger;
    
    public AdminAppointmentController(ILogger<AppointmentController> logger)
    {
        _logger = logger;
    }
    
    [HttpPost]
    [Authorize(Roles = "CanManageAppointment")]
    public async Task<ActionResult<BranchDto>> Create(CreateAppointmentCommand command, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(command, cancellationToken);
        return Success();
    }
    
  
}