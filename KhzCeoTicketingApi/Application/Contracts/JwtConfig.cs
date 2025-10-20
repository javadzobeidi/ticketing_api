namespace KhzCeoTicketingApi.Application.Contract;

public class JwtConfig
{
   
    public string Key { get; set; }
    public string Issuer { get; set; }
    public string Audience { set; get; }
}
