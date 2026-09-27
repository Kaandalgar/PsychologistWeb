using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PsychologistWeb.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public UploadsController(
            IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("profile-image")]
        public async Task<IActionResult> UploadProfileImage(
            IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Lütfen bir görsel seçin.");
            }

            // Maksimum 5 MB
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(
                    "Görsel boyutu en fazla 5 MB olabilir."
                );
            }

            var allowedExtensions = new[]
            {
                ".jpg",
                ".jpeg",
                ".png",
                ".webp"
            };

            var extension =
                Path.GetExtension(file.FileName)
                    .ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(
                    "Sadece JPG, JPEG, PNG veya WEBP yükleyebilirsiniz."
                );
            }

            var allowedContentTypes = new[]
            {
                "image/jpeg",
                "image/png",
                "image/webp"
            };

            if (!allowedContentTypes.Contains(file.ContentType))
            {
                return BadRequest(
                    "Geçersiz görsel türü."
                );
            }

            var webRootPath =
                _environment.WebRootPath;

            if (string.IsNullOrEmpty(webRootPath))
            {
                webRootPath = Path.Combine(
                    _environment.ContentRootPath,
                    "wwwroot"
                );
            }

            var uploadFolder = Path.Combine(
                webRootPath,
                "uploads"
            );

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(
                    uploadFolder
                );
            }

            var fileName =
                $"{Guid.NewGuid()}{extension}";

            var filePath = Path.Combine(
                uploadFolder,
                fileName
            );

            await using var stream =
                new FileStream(
                    filePath,
                    FileMode.Create
                );

            await file.CopyToAsync(stream);

            var imageUrl =
    $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";

            return Ok(new
            {
                imageUrl
            });
        }
    }
}