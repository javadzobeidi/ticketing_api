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
    [Authorize(Roles = "CanManageAppointments")]
    public async Task<ActionResult<BranchDto>> Create(CreateAppointmentCommand command, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(command, cancellationToken);
        return Success();
    }
    

}