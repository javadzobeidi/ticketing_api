using KhzCeoTicketingApi.Domains.Entities;

namespace KhzCeoTicketingApi.Application.Contract;

public class UserLoginTokenResponse
{
    public long UserId { set; get; }
    public string Token { set; get; }

}