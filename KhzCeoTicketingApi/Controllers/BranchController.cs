using KhzCeoTicketingApi.Application.Branches;
using KhzCeoTicketingApi.Application.Contract;
using Microsoft.AspNetCore.Mvc;
using Application;


namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("[controller]")]
public class BranchController : ApiControllerBase
{
    private readonly ILogger<BranchController> _logger;
    
    public BranchController(ILogger<BranchController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<BranchDto>> Create(CreateBranchCommand command, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BranchDto>> Update(int id, UpdateBranchCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id)
            return BadRequest();

        var result = await Mediator.Send(command, cancellationToken);
        return Success(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> Delete(int id, CancellationToken cancellationToken)
    {
        var command = new DeleteBranchCommand { Id = id };
        var result = await Mediator.Send(command, cancellationToken);
        return Success(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BranchDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var query = new GetBranchByIdQuery { Id = id };
        var result = await Mediator.Send(query, cancellationToken);
        return Success(result);
    }

    [HttpGet]
    public async Task<ActionResult<List<BranchDto>>> GetAll(CancellationToken cancellationToken)
    {
        var query = new GetBranchListQuery();
        var result = await Mediator.Send(query, cancellationToken);
        return Success(result);
    }
}