using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsychologistWeb.Api.Data;
using PsychologistWeb.Api.DTOs;
using PsychologistWeb.Api.Models;

namespace PsychologistWeb.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteSettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SiteSettingsController(AppDbContext context)
        {
            _context = context;
        }

        // PUBLIC
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var setting = await _context.SiteSettings
    .OrderBy(x => x.Id)
    .FirstOrDefaultAsync();

            return Ok(setting);
        }

        // ADMIN
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> Update(
            UpdateSiteSettingDto dto)
        {
            var setting = await _context.SiteSettings
    .OrderBy(x => x.Id)
    .FirstOrDefaultAsync();

            if (setting == null)
            {
                setting = new SiteSetting
                {
                    FullName = dto.FullName,
                    Title = dto.Title,
                    AboutText = dto.AboutText,
                    HomeIntroText = dto.HomeIntroText,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    Address = dto.Address,
                    InstagramUrl = dto.InstagramUrl,
                    LinkedInUrl = dto.LinkedInUrl,
                    ProfileImageUrl = dto.ProfileImageUrl
                };

                _context.SiteSettings.Add(setting);
            }
            else
            {
                setting.FullName = dto.FullName;
                setting.Title = dto.Title;
                setting.AboutText = dto.AboutText;
                setting.HomeIntroText = dto.HomeIntroText;
                setting.Email = dto.Email;
                setting.Phone = dto.Phone;
                setting.Address = dto.Address;
                setting.InstagramUrl = dto.InstagramUrl;
                setting.LinkedInUrl = dto.LinkedInUrl;
                setting.ProfileImageUrl = dto.ProfileImageUrl;
            }

            await _context.SaveChangesAsync();

            return Ok(setting);
        }
    }
}