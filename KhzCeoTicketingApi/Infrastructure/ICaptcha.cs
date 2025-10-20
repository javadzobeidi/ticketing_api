using Infrastructure.Services;

namespace KhzCeoTicketingApi.Infrastructure.Data;

public interface ICaptchaService
{
    CaptchaResultDto GenerateCaptcha();
    bool VerifyCaptcha(string answer, string token);
}