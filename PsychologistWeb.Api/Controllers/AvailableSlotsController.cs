using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsychologistWeb.Api.Data;
using PsychologistWeb.Api.Models;

namespace PsychologistWeb.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvailableSlotsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AvailableSlotsController(AppDbContext context)
        {
            _context = context;
        }

        // HERKES - Sadece gelecekteki aktif ve boş saatler
        [HttpGet]
        public async Task<IActionResult> GetAvailableSlots()
        {
            var bookedDates = await _context.Appointments
                .Where(x => x.Status != AppointmentStatus.Cancelled)
                .Select(x => x.AppointmentDate)
                .ToListAsync();

            var slots = await _context.AvailableSlots
                .Where(x =>
                    x.IsActive &&
                    x.StartDateTime > DateTime.Now &&
                    !bookedDates.Contains(x.StartDateTime))
                .OrderBy(x => x.StartDateTime)
                .ToListAsync();

            return Ok(slots);
        }

        // ADMIN - Tüm slotları gör
        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllForAdmin()
        {
            var slots = await _context.AvailableSlots
                .OrderBy(x => x.StartDateTime)
                .ToListAsync();

            return Ok(slots);
        }

        // ADMIN - Yeni müsait saat ekle
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(AvailableSlot slot)
        {
            if (slot.StartDateTime <= DateTime.Now)
            {
                return BadRequest("Geçmiş bir saat eklenemez.");
            }

            var exists = await _context.AvailableSlots.AnyAsync(x =>
                x.StartDateTime == slot.StartDateTime);

            if (exists)
            {
                return Conflict("Bu saat zaten mevcut.");
            }

            _context.AvailableSlots.Add(slot);

            await _context.SaveChangesAsync();

            return Ok(slot);
        }

        // ADMIN - Slot aktif/pasif
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            var slot = await _context.AvailableSlots.FindAsync(id);

            if (slot == null)
            {
                return NotFound();
            }

            slot.IsActive = !slot.IsActive;

            await _context.SaveChangesAsync();

            return Ok(slot);
        }

        // ADMIN - Slot sil
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var slot = await _context.AvailableSlots.FindAsync(id);

            if (slot == null)
            {
                return NotFound();
            }

            _context.AvailableSlots.Remove(slot);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}