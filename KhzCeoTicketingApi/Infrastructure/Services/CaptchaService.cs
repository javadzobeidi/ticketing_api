using System.Net.Mime;
using KhzCeoTicketingApi.Infrastructure.Data;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Services;

using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
public class CaptchaResultDto
{
    // FIX: Initialized the property to resolve warning CS8618
    public string CaptchaImageBase64 { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}


public class CaptchaService:ICaptchaService 
{
    // You can use the same CaptchaResult class from the previous example
    // public class CaptchaResult { ... }
    private readonly IDataProtector _protector;
    private readonly IMemoryCache _cache;
    
    public CaptchaService(IDataProtectionProvider provider,IMemoryCache cache)
    {
        // Create a "protector" for this specific purpose
        _protector = provider.CreateProtector("Captcha.v1");
        _cache=cache;
    }

    public CaptchaResultDto GenerateCaptcha()
    {      
        Random rand = new Random();
        int num1 = rand.Next(0, 100);
        int num2 = rand.Next(0, 100);
        int sum = num1 + num2;

        
        string expiry = DateTime.Now.AddMinutes(2).ToString("yyyy-MM-dd HH:mm:ss");
        string uniqueId = Guid.NewGuid().ToString("N"); // Create a unique ID
        string payload = $"{sum}|{expiry}|{uniqueId}";
        string token = _protector.Protect(payload);
       string base64String= GenerateCaptchaImage(num1, num2);
        
        return new CaptchaResultDto
        {
            CaptchaImageBase64 = $"data:image/png;base64,{base64String}",
            Token = token
        };
        
    }
    
    public bool VerifyCaptcha(string answer, string token)
    {
        try
        {
            string payload = _protector.Unprotect(token);
            string[] parts = payload.Split('|');
            string correctSum = parts[0];
            DateTime time =DateTime.Parse(parts[1]);
            string uniqueId = parts[2];

            if (_cache.Get(uniqueId) != null)
            {
                return false;
            }

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(1));
            _cache.Set(uniqueId, true, cacheEntryOptions);

            if (DateTime.Now > time)
            {
                return false;
            }

            if (answer != correctSum)
            {
                return false;
            }

            return true;
        }
        catch
        {
            return false;
        }
    }
    
    
    public string GenerateCaptchaImage(int num1,int num2)
    {

        Random rand = new Random();

        string captchaText = $"{num1} + {num2}";

        int width = 200;
        int height = 70;

        using (Bitmap bitmap = new Bitmap(width, height))
        using (Graphics graphics = Graphics.FromImage(bitmap))
        {
            graphics.SmoothingMode = SmoothingMode.AntiAlias;
            Rectangle rect = new Rectangle(0, 0, width, height);

            // Step 2: Create a colourful, gradient background
            using (LinearGradientBrush gradientBrush = new LinearGradientBrush(rect, Color.LightGray, Color.WhiteSmoke, LinearGradientMode.BackwardDiagonal))
            {
                graphics.FillRectangle(gradientBrush, rect);
            }

            // Define a palette of appealing colours
            Color[] colors = { Color.Blue, Color.Green, Color.Red, Color.DarkViolet, Color.DeepSkyBlue, Color.Orange };

            // Step 3: Draw each character individually with transformations
            float charX = 15; // Starting X position for the first character
            foreach (char c in captchaText)
            {
                // Save the current state of the graphics object
                GraphicsState state = graphics.Save();

                // Pick a random font size and color
                float fontSize = rand.Next(24, 32);
                Color charColor = colors[rand.Next(colors.Length)];
                using (Font font = new Font("Arial", fontSize, FontStyle.Bold))

                using (Brush brush = new SolidBrush(charColor))
                {
                    // Get a random rotation angle
                    float angle = rand.Next(-20, 21);

                    // Apply rotation and translation
                    graphics.TranslateTransform(charX, height / 2f);
                    graphics.RotateTransform(angle);
                    
                    // Measure the character to centre it properly
                    SizeF charSize = graphics.MeasureString(c.ToString(), font);
                    graphics.DrawString(c.ToString(), font, brush, -charSize.Width / 2, -charSize.Height / 2);

                    // Move the X position for the next character
                    charX += charSize.Width * 0.9f;
                }
                
                // Restore the graphics state to remove the transformations
                graphics.Restore(state);
            }
            
            // Step 4: Add more complex noise (lines)
            for (int i = 0; i < 5; i++)
            {
                int x1 = rand.Next(width);
                int y1 = rand.Next(height);
                int x2 = rand.Next(width);
                int y2 = rand.Next(height);
                Color noiseColor = colors[rand.Next(colors.Length)];
                using (Pen pen = new Pen(noiseColor, 1))
                {
                    graphics.DrawLine(pen, x1, y1, x2, y2);
                }
            }

            // Step 5: Apply a wave distortion to the final image
            using (Bitmap distortedBitmap = ApplyWaveDistortion(bitmap, rand))
            {
                // Step 6: Convert the final distorted image to Base64
                using (MemoryStream ms = new MemoryStream())
                {
                    distortedBitmap.Save(ms, ImageFormat.Png);
                    byte[] imageBytes = ms.ToArray();
                    string base64String = Convert.ToBase64String(imageBytes);


                    return base64String;
                    
                   
                     
                   
                }
            }
        }
    }

    private Bitmap ApplyWaveDistortion(Bitmap sourceBitmap, Random rand)
    {
        Bitmap distortedBitmap = new Bitmap(sourceBitmap.Width, sourceBitmap.Height);
        
        // Define wave parameters
        double amplitude = rand.Next(4, 7); // How much the wave goes up/down
        double frequency = rand.Next(80, 120) / 100.0; // How many waves
        
        for (int y = 0; y < sourceBitmap.Height; y++)
        {
            for (int x = 0; x < sourceBitmap.Width; x++)
            {
                // Calculate the horizontal offset using a sine wave
                int offsetX = (int)(amplitude * Math.Sin(2 * Math.PI * y * frequency / sourceBitmap.Height));
                int newX = x + offsetX;

                // Ensure the new coordinate is within the image bounds
                if (newX >= 0 && newX < sourceBitmap.Width)
                {
                    Color pixelColor = sourceBitmap.GetPixel(newX, y);
                    distortedBitmap.SetPixel(x, y, pixelColor);
                }
                else
                {
                    distortedBitmap.SetPixel(x, y, Color.Transparent);
                }
            }
        }
        return distortedBitmap;
    }
}