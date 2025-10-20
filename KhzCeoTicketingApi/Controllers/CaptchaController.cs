using KhzCeoTicketingApi.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
namespace KhzCeoTicketingApi.Controllers;

[Route("[controller]")]
[ApiController]
public class CaptchaController : ApiControllerBase
{
    private readonly ICaptchaService _captchaService;

    public CaptchaController(ICaptchaService captchaService)
    {
        _captchaService = captchaService;
    }

    [HttpGet]
    [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true, Duration = 0)]

    public IActionResult GenerateCaptcha()
    {
        var result = _captchaService.GenerateCaptcha();
        return Ok(new
        {
            success = true,
            data = result.CaptchaImageBase64,
            captchaToken = result.Token
        });

    }
}
  
    public class CaptchaVerificationModel
    {
        public string CaptchaText { get; set; }
        public string CaptchaToken { get; set; }
    }
