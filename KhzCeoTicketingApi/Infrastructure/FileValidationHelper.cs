namespace KhzCeoTicketingApi.Infrastructure.Data;

public static class FileValidationHelper
{
    private static readonly Dictionary<string, List<byte[]>> FileSignatures = new()
{
    // ----- Images -----
    { "image/jpeg", new List<byte[]> 
        { 
            new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 },
            new byte[] { 0xFF, 0xD8, 0xFF, 0xE1 },
            new byte[] { 0xFF, 0xD8, 0xFF, 0xE8 }
        } 
    },
    { "image/png", new List<byte[]> 
        { new byte[] { 0x89, 0x50, 0x4E, 0x47 } } 
    },
    { "image/gif", new List<byte[]> 
        { new byte[] { 0x47, 0x49, 0x46, 0x38 } } 
    },
    { "image/bmp", new List<byte[]> 
        { new byte[] { 0x42, 0x4D } } 
    },
    { "image/webp", new List<byte[]> 
        { new byte[] { 0x52, 0x49, 0x46, 0x46 } } // 'RIFF' (check for WEBP in header later)
    },

    // ----- Documents -----
    { "application/pdf", new List<byte[]> 
        { new byte[] { 0x25, 0x50, 0x44, 0x46, 0x2D } } // %PDF-
    },
    { "application/msword", new List<byte[]> 
        { new byte[] { 0xD0, 0xCF, 0x11, 0xE0 } } // .doc (OLE Compound)
    },
    { "application/vnd.openxmlformats-officedocument.wordprocessingml.document", new List<byte[]> 
        { new byte[] { 0x50, 0x4B, 0x03, 0x04 } } // .docx
    },
    { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", new List<byte[]> 
        { new byte[] { 0x50, 0x4B, 0x03, 0x04 } } // .xlsx
    },
    { "application/vnd.openxmlformats-officedocument.presentationml.presentation", new List<byte[]> 
        { new byte[] { 0x50, 0x4B, 0x03, 0x04 } } // .pptx
    },
    { "text/plain", new List<byte[]> 
        { new byte[] { 0xEF, 0xBB, 0xBF } } // UTF-8 BOM (optional)
    },
    { "text/csv", new List<byte[]> 
        { new byte[] { 0xEF, 0xBB, 0xBF } } // similar to .txt
    },

    // ----- Archives -----
    { "application/zip", new List<byte[]> 
        { new byte[] { 0x50, 0x4B, 0x03, 0x04 } } 
    },
    { "application/x-rar-compressed", new List<byte[]> 
        { new byte[] { 0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00 } } // RAR 4.x
    },
    { "application/x-7z-compressed", new List<byte[]> 
        { new byte[] { 0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C } } // 7z
    },

    // ----- Logs / Config -----
    { "application/json", new List<byte[]> 
        { new byte[] { 0x7B } } // '{'
    },
    { "application/xml", new List<byte[]> 
        { new byte[] { 0x3C, 0x3F, 0x78, 0x6D, 0x6C } } // '<?xml'
    },
};
    
    public static readonly string[] SupportedMimeTypes =
    [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/zip",
        "application/x-rar-compressed",
    ];
    
    public static bool IsValidFileType(Stream fileStream, string contentType)
    {
        if (!FileSignatures.TryGetValue(contentType, out var signatures))
            return false; // not a supported type

        using var reader = new BinaryReader(fileStream);
        var headerBytes = reader.ReadBytes(signatures.Max(m => m.Length));

        return signatures.Any(signature =>
            headerBytes.Take(signature.Length).SequenceEqual(signature));
    }
    

}