using Microsoft.AspNetCore.Mvc;
using Application;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Application.Departments;
using Microsoft.AspNetCore.Authorization;

namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("[controller]")]
[Authorize]
public class DepartmentController : ApiControllerBase
{
    private readonly ILogger<DepartmentController> _logger;
    public DepartmentController(ILogger<DepartmentController>  logger)
    {
        _logger = logger;
    }

    
    [HttpPost]
    public async Task<ActionResult<DepartmentDto>> Create(CreateDepartmentCommand command, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DepartmentDto>> Update(int id, UpdateDepartmentCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id)
            return BadRequest();

        var result = await Mediator.Send(command, cancellationToken);
        return Success(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> Delete(Guid id, CancellationToken cancellationToken)
    {
        var command = new DeleteDepartmentCommand { Id = id };
        var result = await Mediator.Send(command, cancellationToken);
        return Success(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DepartmentDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetDepartmentByIdQuery { Id = id };
        var result = await Mediator.Send(query, cancellationToken);
        return Success(result);
    }

    [HttpGet]
    public async Task<ActionResult<List<DepartmentDto>>> GetAll(CancellationToken cancellationToken)
    {
        var query = new GetDepartmentsQuery() ;
        var result = await Mediator.Send(query, cancellationToken);
        return Success(result);
    }
    
   
   
}