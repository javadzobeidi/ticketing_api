namespace MrSmsApi.Application.Common.Interfaces;


public interface IEmailTemplateService
{
    Task<string> GetTemplateAsync(string templateName);
}