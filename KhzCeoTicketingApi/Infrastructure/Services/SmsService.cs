using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Hangfire;
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
    private readonly IBackgroundJobClient _backgroundJobClient;

    public SmsService(
        IHttpClientFactory httpClientFactory,
        ILogger<SmsService> logger,
        IOptions<SmsConfig> config,
        ISmsTokenStorage tokenStorage,
        IBackgroundJobClient backgroundJobClient)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
        _config = config.Value;
        _tokenStorage = tokenStorage;
        _backgroundJobClient = backgroundJobClient;
    }

    /// <summary>
    /// Queues an SMS to be sent in the background
    /// </summary>
    public async Task<bool> SendSMSAsync(string phoneNumber, string message, string customerId)
    {
        try
        {
            // Enqueue the SMS sending job
            var jobId = _backgroundJobClient.Enqueue(() => 
                ProcessSmsAsync(phoneNumber, message, customerId));

            _logger.LogInformation("SMS job queued with ID: {JobId} for {PhoneNumber}", jobId, phoneNumber);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error queuing SMS for {PhoneNumber}", phoneNumber);
            return false;
        }
    }

    /// <summary>
    /// Schedules an SMS to be sent at a specific time
    /// </summary>
    public string ScheduleSMS(string phoneNumber, string message, string customerId, DateTimeOffset scheduleAt)
    {
        var jobId = _backgroundJobClient.Schedule(() => 
            ProcessSmsAsync(phoneNumber, message, customerId), 
            scheduleAt);

        _logger.LogInformation("SMS scheduled with ID: {JobId} for {PhoneNumber} at {ScheduleTime}", 
            jobId, phoneNumber, scheduleAt);

        return jobId;
    }

    /// <summary>
    /// Sends an SMS immediately (synchronous fallback)
    /// </summary>
    public async Task<bool> SendSmsImmediateAsync(string phoneNumber, string message, string customerId)
    {
        return await ProcessSmsAsync(phoneNumber, message, customerId);
    }

    /// <summary>
    /// Background job method that actually sends the SMS
    /// This method is called by Hangfire
    /// </summary>
    [AutomaticRetry(Attempts = 3, DelaysInSeconds = new[] { 60, 300, 900 })]
    public async Task<bool> ProcessSmsAsync(string phoneNumber, string message, string customerId)
    {
        try
        {
            await EnsureValidTokenAsync();

            var client = _httpClientFactory.CreateClient("SMSClient");
            
            var messages = new[]
            {
                new {
                    sender = "9820004304",
                    recipient = phoneNumber,
                    body = message,
                    customerId = customerId
                }
            };
            
            var request = new HttpRequestMessage(HttpMethod.Post, "/panel/webservice/send")
            {
                Headers = { 
                    Authorization = new AuthenticationHeaderValue("Bearer", _tokenStorage.GetAccessToken()) 
                },
                Content = new StringContent(
                    JsonSerializer.Serialize(messages),
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
                    throw new Exception("Failed to refresh SMS service token");
                }
            }

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("SMS sent successfully to {PhoneNumber}", phoneNumber);
                return true;
            }

            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogWarning("SMS send failed: {StatusCode} - {Error}", 
                response.StatusCode, errorContent);
            
            // Throw exception to trigger Hangfire retry
            throw new Exception($"SMS send failed with status {response.StatusCode}: {errorContent}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending SMS to {PhoneNumber}", phoneNumber);
            throw; // Re-throw to let Hangfire handle retry
        }
    }

    /// <summary>
    /// Sends bulk SMS messages
    /// </summary>
    public void SendBulkSMS(IEnumerable<(string phoneNumber, string message, string customerId)> messages)
    {
        foreach (var (phoneNumber, message, customerId) in messages)
        {
            _backgroundJobClient.Enqueue(() => 
                ProcessSmsAsync(phoneNumber, message, customerId));
        }

        _logger.LogInformation("Bulk SMS queued: {Count} messages", messages.Count());
    }

    /// <summary>
    /// Sends recurring SMS (e.g., daily reports, reminders)
    /// </summary>
    public void AddRecurringSMS(string recurringJobId, string phoneNumber, string message, 
        string customerId, string cronExpression)
    {
        RecurringJob.AddOrUpdate(
            recurringJobId,
            () => ProcessSmsAsync(phoneNumber, message, customerId),
            cronExpression);

        _logger.LogInformation("Recurring SMS job added: {JobId} with cron {Cron}", 
            recurringJobId, cronExpression);
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

            request.Headers.Authorization = new AuthenticationHeaderValue(
                "Basic", "c2F6bWFuOnNhem1hbldlYnNlcnZpY2U=");

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