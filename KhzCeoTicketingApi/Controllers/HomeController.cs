using KhzCeoTicketingApi.Application.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace KhzCeoTicketingApi.Controllers;

[ApiController]
[Route("[controller]")]
public class HomeController : ApiControllerBase
{
    
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    [HttpGet("server-time")]
    public IActionResult GetServerTime()
    {
        return Ok(DateTime.UtcNow);
    }
    [HttpGet("persiandate")]
    public IActionResult GetPersianDate()
    {
        return Success(DateTime.Now.ToPersianDate());
    }
    
    [HttpGet]
    [Route("")]
    [Route("/")]
    public IActionResult Get()
    {
        return Ok(DateTime.Now.ToString());

    }
}