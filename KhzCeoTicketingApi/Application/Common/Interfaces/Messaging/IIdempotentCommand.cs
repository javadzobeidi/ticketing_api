using System;

namespace Application.Common.Interfaces.Messaging;

public interface IIdempotentCommand<out TResponse> : ICommand<TResponse>
{
    Guid RequestId { get; set; }
}