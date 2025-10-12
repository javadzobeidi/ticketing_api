

using Microsoft.AspNetCore.Mvc;
using KhzCeoTicketingApi.Filters;
using KhzCeoTicketingApi.Models;
using Mediator;

namespace KhzCeoTicketingApi.Controllers;

[ApiController]
[ApiExceptionFilter]
[Route("api/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    private ISender? _mediator;
    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();

    protected ActionResult Success()
    {
        return Ok(new ApiSuccessResult(""));
    }

    protected ActionResult Success(object result)
    {
        return Ok(new ApiSuccessResult(result));
    }

    protected ActionResult Failure(string message)
    {
        return BadRequest(new ApiErrorResult(message));
    }

    protected ActionResult Failure(string message, object data)
    {
        return BadRequest(new ApiErrorResult(message, data));
    }

}
