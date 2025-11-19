namespace KhzCeoTicketingApi.Infrastructure.Data.Interfaces;

public interface ISmsTokenStorage
{
    string GetAccessToken();
    string GetRefreshToken();
    DateTime GetTokenExpiry();
    void UpdateTokens(string accessToken, string refreshToken, int expiresIn);
    bool IsTokenExpired();
}

