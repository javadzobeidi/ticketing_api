using Mediator;

namespace Application.Common.Interfaces.Messaging;

public interface ICommand<out TResponse> : IRequest<TResponse>
{
}