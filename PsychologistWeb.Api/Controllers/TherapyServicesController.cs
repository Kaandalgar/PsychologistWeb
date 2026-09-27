using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsychologistWeb.Api.Data;
using PsychologistWeb.Api.Models;

namespace PsychologistWeb.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TherapyServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TherapyServicesController(AppDbContext context)
        {
            _context = context;
        }

        // HERKES ERİŞEBİLİR
        // Ana sayfadaki aktif hizmetleri getirir.
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var services = await _context.TherapyServices
                .Where(x => x.IsActive)
                .OrderBy(x => x.DisplayOrder)
                .ToListAsync();

            return Ok(services);
        }

        // HERKES ERİŞEBİLİR
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var service = await _context.TherapyServices
                .FirstOrDefaultAsync(x => x.Id == id);

            if (service == null)
            {
                return NotFound();
            }

            return Ok(service);
        }

        // SADECE ADMIN
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(TherapyService therapyService)
        {
            _context.TherapyServices.Add(therapyService);

            await _context.SaveChangesAsync();

            return Ok(therapyService);
        }

        // SADECE ADMIN
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            TherapyService therapyService)
        {
            var service = await _context.TherapyServices.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }

            service.Title = therapyService.Title;
            service.Description = therapyService.Description;
            service.ImageUrl = therapyService.ImageUrl;
            service.IsActive = therapyService.IsActive;
            service.DisplayOrder = therapyService.DisplayOrder;

            await _context.SaveChangesAsync();

            return Ok(service);
        }

        // SADECE ADMIN
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var service = await _context.TherapyServices.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }

            _context.TherapyServices.Remove(service);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}