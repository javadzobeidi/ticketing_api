using Microsoft.AspNetCore.Mvc;
using Application;
namespace KhzCeoTicketingApi.Controllers;


[ApiController]
[Route("[controller]")]

public class CityController : ApiControllerBase
{
    private readonly ILogger<CityController> _logger;
    public CityController(ILogger<CityController>  logger)
    {
        _logger = logger;
    }

    
    [HttpGet]
    public async Task<IActionResult> List()
    {
       var result=await Mediator.Send(new GetCitiesQuery());
       return Success(result);
    }
   
   
}