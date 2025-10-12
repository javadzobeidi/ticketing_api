using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using System.Text;

namespace KhzCeoTicketingApi;

public static class PasswordHasher
{
    private static readonly PasswordHasher<object> _hasher = new();
    private readonly static string _pepper = "sms_$%^anager_admin@!";

    public static string ComputeHash(string password, string salt, int iteration)
    {
        if (iteration <= 0) return password;

        using var sha256 = SHA256.Create();
        var passwordSaltPepper = $"{password}{salt}{_pepper}";
        var byteValue = Encoding.UTF8.GetBytes(passwordSaltPepper);
        var byteHash = sha256.ComputeHash(byteValue);
        var hash = Convert.ToBase64String(byteHash);
        return ComputeHash(hash, salt, iteration - 1);
    }


    public static string GenerateSalt()
    {
        using var rng = RandomNumberGenerator.Create();
        var byteSalt = new byte[16];
        rng.GetBytes(byteSalt);
        var salt = Convert.ToBase64String(byteSalt);
        return salt;
    }


}