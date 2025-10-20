using System.Security.Claims;

public static class ClaimsPrincipalExtensions
{
  
    public static int GetUserId(this ClaimsPrincipal principal)
    {
        string userIdString = principal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdString))
        {
            throw new InvalidOperationException("User ID claim (NameIdentifier) not found in token.");
        }

        if (!int.TryParse(userIdString, out int userId))
        {
            throw new InvalidOperationException("User ID claim is not in a valid long format.");
        }

        return userId;
    }
}