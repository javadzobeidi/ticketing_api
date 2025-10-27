using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace KhzCeoTicketingApi.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize] 
public class AttachmentController:ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<AttachmentController> _logger;

    public AttachmentController(
        IWebHostEnvironment environment,
        ILogger<AttachmentController> logger)
    {
        _environment = environment;
        _logger = logger;
    }
    
    private readonly Regex GuidPrefixedFileRegex =
        new Regex(@"^(?<guid>[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})[_-](?<name>.+)$",
            RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public string FilenameAfterGuid(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return input;

        var m = GuidPrefixedFileRegex.Match(input);
        if (m.Success)
            return m.Groups["name"].Value;

        // Fallback: return the file name part (handles paths)
        return Path.GetFileName(input);
    }
    
    [HttpGet("download")]
        public IActionResult DownloadFile([FromQuery] string path)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(path))
                {
                    return BadRequest("File path is required");
                }

                var normalizedPath = path.Replace("/", "\\");

                // Build full path
                var fullPath = Path.Combine(_environment.ContentRootPath, normalizedPath);
                var uploadsRoot = Path.Combine(_environment.ContentRootPath, "Uploads");

                // Security check: Ensure the path is within the uploads directory
                var fullPathNormalized = Path.GetFullPath(fullPath);
                var uploadsRootNormalized = Path.GetFullPath(uploadsRoot);

                if (!fullPathNormalized.StartsWith(uploadsRootNormalized, StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogWarning("Attempted access outside uploads directory: {FilePath}", path);
                    return BadRequest("Invalid file path");
                }

                // Check if file exists
                if (!System.IO.File.Exists(fullPath))
                {
                    _logger.LogWarning("File not found: {FilePath}", fullPath);
                    return NotFound("File not found");
                }

                // Get the content type
                var provider = new FileExtensionContentTypeProvider();
                var fileName = Path.GetFileName(fullPath);
                if (!provider.TryGetContentType(fileName, out var contentType))
                {
                    contentType = "application/octet-stream";
                }

                var originalFileName = FilenameAfterGuid(fileName);

                // Stream the file directly without loading into memory
                var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
                return File(stream, contentType, originalFileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading file: {FilePath}", path);
                return StatusCode(500, "Error downloading file");
            }
        }

    
}