namespace MrSmsApi.Application.Common.Interfaces;

public interface IEmailQueueService
{
    Task EnqueueAsync(string to, string subject, string body);
    Task EnqueueTemplateAsync(string templateName, string to, string subject, Dictionary<string, string> parameters);


}


