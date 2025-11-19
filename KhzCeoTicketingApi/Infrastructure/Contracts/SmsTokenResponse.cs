using System.Text.Json.Serialization;

namespace KhzCeoTicketingApi.Infrastructure.Data.Contracts;

public class SmsTokenResponse
{

    [JsonPropertyName("access_token")]
    public string AccessToken { set; get; }
  
    [JsonPropertyName("refresh_token")]
    public string RefreshToken { set; get; }

    
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { set; get; }
    
}