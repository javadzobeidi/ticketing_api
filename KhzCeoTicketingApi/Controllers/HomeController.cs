using Microsoft.AspNetCore.Mvc;

namespace KhzCeoTicketingApi.Controllers;

[ApiController]
[Route("[controller]")]
public class HomeController : ControllerBase
{
    
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    
    [HttpGet]
    [Route("")]
    [Route("/")]
    public IActionResult Get()
    {
        return Ok(DateTime.Now.ToString());

    }
}