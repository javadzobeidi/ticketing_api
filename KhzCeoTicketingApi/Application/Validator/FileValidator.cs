using FluentValidation;
using KhzCeoTicketingApi.Infrastructure.Data;

namespace KhzCeoTicketingApi.Application.Validator;

public class FileValidator : AbstractValidator<IFormFile>
{
    public FileValidator(long maxFileSize = 10 * 1024 * 1024) // default 10MB
    {
        RuleFor(file => file)
            .NotNull().WithMessage("File is required.")
            .Must(f => f.Length > 0).WithMessage("File is empty.");

        RuleFor(file => file.Length)
            .LessThanOrEqualTo(maxFileSize)
            .WithMessage($"File size must be less than {maxFileSize / (1024 * 1024)} MB.");

        RuleFor(file => file.ContentType)
            .Must(IsSupportedMimeType)
            .WithMessage("Unsupported file type.");

        RuleFor(file => file)
            .Must(IsFileSignatureValid)
            .When(f => f is not null)
            .WithMessage("File signature does not match the declared file type.");
    }

    private bool IsSupportedMimeType(string? contentType)
    {
        if (string.IsNullOrEmpty(contentType)) return false;
        return FileValidationHelper.SupportedMimeTypes.Contains(contentType);
    }

    private bool IsFileSignatureValid(IFormFile file)
    {
        using var stream = file.OpenReadStream();
        return FileValidationHelper.IsValidFileType(stream, file.ContentType);
    }
}