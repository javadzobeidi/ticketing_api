using KhzCeoTicketingApi.Infrastructure.Data.Interfaces;

namespace KhzCeoTicketingApi.Infrastructure.Services;

public class SmsTokenStorage :ISmsTokenStorage
{
    private string _accessToken;
    private string _refreshToken;
    private DateTime _tokenExpiryTime;
    private readonly SemaphoreSlim _lock = new SemaphoreSlim(1, 1);

    public string GetAccessToken() => _accessToken;
    public string GetRefreshToken() => _refreshToken;
    public DateTime GetTokenExpiry() => _tokenExpiryTime;

    public void UpdateTokens(string accessToken, string refreshToken, int expiresIn)
    {
        _lock.Wait();
        try
        {
            _accessToken = accessToken;
            _refreshToken = refreshToken;
            _tokenExpiryTime = DateTime.UtcNow.AddSeconds(expiresIn);
        }
        finally
        {
            _lock.Release();
        }
    }

    public bool IsTokenExpired()
    {
        // 5 minute buffer before actual expiry
        return string.IsNullOrEmpty(_accessToken) || 
               DateTime.UtcNow.AddMinutes(5) >= _tokenExpiryTime;
    }
}