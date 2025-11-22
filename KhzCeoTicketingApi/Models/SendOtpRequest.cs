namespace KhzCeoTicketingApi.Models;

public class SendOtpRequest
{
    public string Mobile { get; set; }
    public string captcha_answer { set; get; }
    public string captcha_token { set; get; }
    
}