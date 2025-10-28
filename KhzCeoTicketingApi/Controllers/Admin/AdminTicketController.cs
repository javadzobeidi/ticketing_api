using KhzCeoTicketingApi.Application.Branches;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.AspNetCore.Mvc;
using Application;
using Microsoft.AspNetCore.Authorization;


namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("admin/ticket")]
public class AdminTicketController : ApiControllerBase
{
    private readonly ILogger<AdminTicketController> _logger;
    
    public AdminTicketController(ILogger<AdminTicketController> logger)
    {
        _logger = logger;
    }
    
    
    
    [HttpPost]
    [Authorize]
    [Route("list")]
    public async Task<IActionResult> List(GetTicketsListForManager request)
    {
        var result = await Mediator.Send(request);
        return Success(result);
    }
    
    [HttpPost]
    [Authorize]
    [Route("detail/{code}")]
    public async Task<IActionResult> List(Guid code)
    {
        var result = await Mediator.Send(new GetTicketDetailsByManage(code));
        return Success(result);
    }
    
    
    [HttpPost]
    [Authorize]
    [Route("sendmessage")]
    public async Task<IActionResult> List(SendTicketMessageCommand command)
    {
        var result = await Mediator.Send(command);
        return Success(result);
        
    }
    
    [HttpPost]
    [Authorize]
    [Route("referral")]
    public async Task<ActionResult<BranchDto>> List(ReferralTicketCommand command)
    {
        var result = await Mediator.Send(command);
        return Success(result);
    }
    
}