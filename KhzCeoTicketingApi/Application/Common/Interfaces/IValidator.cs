using FluentValidation.Results;
using System.Diagnostics.CodeAnalysis;

namespace Application.Common.Interfaces;

public interface IValidation : IMessage
{
    bool IsValid([NotNullWhen(false)] out IEnumerable<ValidationFailure>? error);
}