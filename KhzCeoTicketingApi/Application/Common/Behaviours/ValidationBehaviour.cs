using Mediator;

using Microsoft.AspNetCore.Authorization; // Requires Microsoft.AspNetCore.Authorization
using System.Reflection; // Required for GetCustomAttribute
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using Application.Common.Interfaces; // Required for Any()
using FluentValidation;
using FluentValidation.Results;
namespace Application.Common.Behaviours;


public sealed class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull, IMessage
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

  
    public ValidationBehaviour(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async ValueTask<TResponse> Handle(TRequest request, MessageHandlerDelegate<TRequest, TResponse> next, CancellationToken cancellationToken)
    {
        if (_validators.Any())
        {
            var context = new ValidationContext<TRequest>(request);
            var validationResults = await Task.WhenAll(
                _validators.Select(v =>
                    v.ValidateAsync(context, cancellationToken)));

            var failures = validationResults
                .Where(r => r.Errors.Any())
                .SelectMany(r => r.Errors)
                .ToList();
 
            if (failures.Any())
                throw new Application.Common.Exceptions.ValidationException(failures);
        }
        return await next(request, cancellationToken); // Continue to the next handler/behavior

        
    }
}
