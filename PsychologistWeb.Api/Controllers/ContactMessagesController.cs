using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsychologistWeb.Api.Data;
using PsychologistWeb.Api.DTOs;
using PsychologistWeb.Api.Models;
using Microsoft.AspNetCore.RateLimiting;

namespace PsychologistWeb.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactMessagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactMessagesController(AppDbContext context)
        {
            _context = context;
        }



        // ZİYARETÇİ - Mesaj gönderir

        [EnableRateLimiting("public-write")]
        [HttpPost]

        [HttpPost]
        public async Task<IActionResult> Create(
            CreateContactMessageDto dto)
        {
            var contactMessage = new ContactMessage
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Subject = dto.Subject,
                Message = dto.Message,
                IsRead = false,
                CreatedDate = DateTime.UtcNow
            };

            _context.ContactMessages.Add(contactMessage);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Mesajınız başarıyla gönderildi."
            });
        }

        // ADMIN - Tüm mesajları getirir
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var messages = await _context.ContactMessages
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();

            return Ok(messages);
        }

        // ADMIN - Tek mesaj
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var message = await _context.ContactMessages
                .FindAsync(id);

            if (message == null)
            {
                return NotFound();
            }

            return Ok(message);
        }

        // ADMIN - Okundu olarak işaretle
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var message = await _context.ContactMessages
                .FindAsync(id);

            if (message == null)
            {
                return NotFound();
            }

            message.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok(message);
        }

        // ADMIN - Tekrar okunmadı yap
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/unread")]
        public async Task<IActionResult> MarkAsUnread(int id)
        {
            var message = await _context.ContactMessages
                .FindAsync(id);

            if (message == null)
            {
                return NotFound();
            }

            message.IsRead = false;

            await _context.SaveChangesAsync();

            return Ok(message);
        }

        // ADMIN - Sil
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var message = await _context.ContactMessages
                .FindAsync(id);

            if (message == null)
            {
                return NotFound();
            }

            _context.ContactMessages.Remove(message);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}