using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Mediator;

namespace Application.Common.Behaviours;


public sealed class MessageValidatorBehaviour<TMessage, TResponse> : MessagePreProcessor<TMessage, TResponse>
    where TMessage : IValidation
{
    protected override ValueTask Handle(TMessage message, CancellationToken cancellationToken)
    {
        if (!message.IsValid(out var validationError))
            throw new ValidationException(validationError);

        return default;
    }
}

