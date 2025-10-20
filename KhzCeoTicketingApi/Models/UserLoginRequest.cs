namespace KhzCeoTicketingApi.Models;

public class UserLoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string captcha_answer { set; get; }
    public string captcha_token { set; get; }
    
}