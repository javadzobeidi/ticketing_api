namespace KhzCeoTicketingApi.Infrastructure.Data.Interfaces;

public interface ISmsService
{
    Task<bool> SendSMSAsync(string phoneNumber, string message,string customerId);
}
