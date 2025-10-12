using Application.Common.Interfaces;
using Mediator;
using Microsoft.Extensions.Logging;
namespace Application.Common.Behaviours;


public sealed class HandleExceptionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull, IMessage
{
    private readonly ILogger<HandleExceptionBehavior<TRequest, TResponse>> _logger;

    public HandleExceptionBehavior(ILogger<HandleExceptionBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }


    public async ValueTask<TResponse> Handle(TRequest request, MessageHandlerDelegate<TRequest, TResponse> next, CancellationToken cancellationToken)
    {
        try
        {
            return await next(request, cancellationToken); // Continue to the next handler/behavior
        }
        catch(Exception exception)
        {
            _logger.LogError(exception, "Error handling message of type {messageType}", request.GetType().Name);
            throw;
        }
    }
}
