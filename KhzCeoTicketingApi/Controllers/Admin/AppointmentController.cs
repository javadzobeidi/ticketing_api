using KhzCeoTicketingApi.Application.Branches;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.AspNetCore.Mvc;
using Application;
using Microsoft.AspNetCore.Authorization;


namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("admin/appointment")]
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
    
    [HttpPost]
    [Authorize]
    [Route("list")]
    public async Task<ActionResult<BranchDto>> List(GetAppointmentsByManager request)
    {
        var result = await Mediator.Send(request);
        return Success(result);
    }
    
    

    [HttpPost]
    [Authorize]
    [Route("detail/{code}")]
    public async Task<ActionResult<BranchDto>> List(Guid code)
    {
        var result = await Mediator.Send(new GetAppointmentDetailsByManage(code));
        return Success(result);
    }

    [HttpPost]
    [Authorize]
    [Route("complete")]
    public async Task<ActionResult<BranchDto>> List(CompleteAppointmentCommand command)
    {
        var result = await Mediator.Send(command);
        return Success(result);
    }
    
    [HttpPost]
    [Authorize]
    [Route("referral")]
    public async Task<ActionResult<BranchDto>> List(ReferralAppointmentCommand command)
    {
        var result = await Mediator.Send(command);
        return Success(result);
    }
    
}