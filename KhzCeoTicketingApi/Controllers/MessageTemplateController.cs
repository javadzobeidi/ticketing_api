using KhzCeoTicketingApi.Application.Branches;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.AspNetCore.Mvc;
using Application;
using KhzCeoTicketingApi.Application.Departments;
using Microsoft.AspNetCore.Authorization;


namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("[controller]")]
[Authorize]
public class MessageTemplateController : ApiControllerBase
{
    private readonly ILogger<MessageTemplateController> _logger;
    
    public MessageTemplateController(ILogger<MessageTemplateController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<BranchDto>> Create(CreateMessageTemplateCommand command, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(command, cancellationToken);
        return Success(result);
    }
    

    [HttpGet]
    public async Task<ActionResult<List<MessageTemplateListItem>>> GetAll(CancellationToken cancellationToken)
    {
        var query = new GetMessageTemplatesListQuery();
        var result = await Mediator.Send(query, cancellationToken);
        return Success(result);
    }
    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult<BranchDto>> Remove( int id, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(new DeleteMessageTemplateCommand(id), cancellationToken);
        return Success(result);
    }

    
        
}