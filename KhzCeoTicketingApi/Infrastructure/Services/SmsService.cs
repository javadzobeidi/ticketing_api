using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using KhzCeoTicketingApi.Application.Contract;
using KhzCeoTicketingApi.Infrastructure.Data.Contracts;
using KhzCeoTicketingApi.Infrastructure.Data.Interfaces;
using Microsoft.Extensions.Options;

namespace KhzCeoTicketingApi.Infrastructure.Services;

public class SmsService : ISmsService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<SmsService> _logger;
    private readonly SmsConfig _config;
    private readonly ISmsTokenStorage _tokenStorage;
    private readonly SemaphoreSlim _refreshLock = new SemaphoreSlim(1, 1);

    public SmsService(
        IHttpClientFactory httpClientFactory,
        ILogger<SmsService> logger,
        IOptions<SmsConfig> config,
        ISmsTokenStorage tokenStorage)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
        _config = config.Value;
        _tokenStorage = tokenStorage;
    }

    public async Task<bool> SendSMSAsync(string phoneNumber, string message,string customerId)
    {
        try
        {
            await EnsureValidTokenAsync();

            var client = _httpClientFactory.CreateClient("SMSClient");
            
            var request = new HttpRequestMessage(HttpMethod.Post, "/send")
            {
                Headers = { 
                    Authorization = new AuthenticationHeaderValue("Bearer", _tokenStorage.GetAccessToken()) 
                },
                Content = new StringContent(
                    JsonSerializer.Serialize(new
                    {
                        sender="",
                        recipient = phoneNumber,
                        body = message,
                        customerId=customerId
                    }),
                    Encoding.UTF8,
                    "application/json")
            };

            var response = await client.SendAsync(request);

            // Handle 401 - token expired
            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                _logger.LogWarning("Token expired, refreshing and retrying...");
                
                if (await RefreshTokenAsync())
                {
                    // Retry with new token
                    request.Headers.Authorization = new AuthenticationHeaderValue(
                        "Bearer", _tokenStorage.GetAccessToken());
                    response = await client.SendAsync(request);
                }
                else
                {
                    _logger.LogError("Failed to refresh token");
                    return false;
                }
            }

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("SMS sent successfully to {PhoneNumber}", phoneNumber);
                return true;
            }

            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogWarning("SMS send failed: {StatusCode} - {Error}", 
                response.StatusCode, errorContent);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending SMS to {PhoneNumber}", phoneNumber);
            return false;
        }
    }

    private async Task EnsureValidTokenAsync()
    {
        if (_tokenStorage.IsTokenExpired())
        {
            if (string.IsNullOrEmpty(_tokenStorage.GetRefreshToken()))
            {
                await AuthenticateAsync();
            }
            else
            {
                await RefreshTokenAsync();
            }
        }
    }

    private async Task<bool> RefreshTokenAsync()
    {
        await _refreshLock.WaitAsync();
        
        try
        {
            // Double-check after acquiring lock
            if (!_tokenStorage.IsTokenExpired())
            {
                return true;
            }

            _logger.LogInformation("Refreshing SMS service token");

            var client = _httpClientFactory.CreateClient("SMSClient");
            
            var request = new HttpRequestMessage(HttpMethod.Post, "/auth/refresh")
            {
                Content = new StringContent(
                    JsonSerializer.Serialize(new { refreshToken = _tokenStorage.GetRefreshToken() }),
                    Encoding.UTF8,
                    "application/json")
            };

            var response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Token refresh failed: {StatusCode}", response.StatusCode);
                
                // If refresh token expired, re-authenticate
                if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    return await AuthenticateAsync();
                }
                
                return false;
            }

            var content = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonSerializer.Deserialize<SmsTokenResponse>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            _tokenStorage.UpdateTokens(
                tokenResponse.AccessToken, 
                tokenResponse.RefreshToken, 
                tokenResponse.ExpiresIn);

            _logger.LogInformation("Token refreshed successfully");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return false;
        }
        finally
        {
            _refreshLock.Release();
        }
    }

    private async Task<bool> AuthenticateAsync()
    {
        try
        {
            _logger.LogInformation("Authenticating with SMS service");

            var client = _httpClientFactory.CreateClient("SMSClient");
            
            var formData = new Dictionary<string, string>
            {
                { "systemName", "sazman" },
                { "username", "sazman" },
                { "password", "Sazman@9874" },
                { "scope", "webservice" },
                { "grant_type", "password" }
            };
            var request = new HttpRequestMessage(HttpMethod.Post, "/auth/oauth/token")
            {
                Content = new FormUrlEncodedContent(formData)
            };

            var response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Authentication failed: {StatusCode}", response.StatusCode);
                return false;
            }

            var content = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonSerializer.Deserialize<SmsTokenResponse>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            _tokenStorage.UpdateTokens(
                tokenResponse.AccessToken,
                tokenResponse.RefreshToken,
                tokenResponse.ExpiresIn);

            _logger.LogInformation("Authentication successful");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during authentication");
            return false;
        }
    }

   
}
