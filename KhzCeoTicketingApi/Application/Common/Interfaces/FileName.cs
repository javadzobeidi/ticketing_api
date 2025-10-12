namespace MrSmsApi.Application.Common.Interfaces;

public interface IGenerateToken
{
    string Generate(string userId);
}
