using KhzCeoTicketingApi.Application.Branches;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.AspNetCore.Mvc;
using Application;
using Microsoft.AspNetCore.Authorization;


namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("[controller]")]
public class TicketController : ApiControllerBase
{
    private readonly ILogger<TicketController> _logger;
    
    public TicketController(ILogger<TicketController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateTicketCommand request)
    {
        var result = await Mediator.Send(request);
        return Success(result);
    }
    [HttpPost]
    [Authorize]
    [Route("list")]
    public async Task<ActionResult<BranchDto>> List(GetTicketsListbyUser request)
    {
        var result = await Mediator.Send(request);
        return Success(result);
    }
    
    [HttpGet]
    [Authorize]
    [Route("conversations/{code}")]
    public async Task<ActionResult<BranchDto>> GetConversations(Guid code)
    {
        var result = await Mediator.Send(new GetAppointmentConversations(code));
        return Success(result);
    }
    
    [HttpPost]
    [Authorize]
    [Route("sendmessage")]
    public async Task<IActionResult> List(SendTicketUserMessageCommand command)
    {
        var result = await Mediator.Send(command);
        return Success(result);
        
    }
    
    [HttpPost]
    [Authorize]
    [Route("detail/{code}")]
    public async Task<IActionResult> List(Guid code)
    {
        var result = await Mediator.Send(new GetTicketDetailsByUser(code));
        return Success(result);
    }
    [HttpPost]
    [Authorize]
    [Route("close")]
    public async Task<IActionResult> List(CloseTicketCommand command)
    {
        var result = await Mediator.Send(command);
        return Success(result);
    }

    
}