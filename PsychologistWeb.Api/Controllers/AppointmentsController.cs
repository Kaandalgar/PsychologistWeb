using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using PsychologistWeb.Api.Data;
using PsychologistWeb.Api.DTOs;
using PsychologistWeb.Api.Models;

namespace PsychologistWeb.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }


        // =========================
        // ZİYARETÇİ - RANDEVU OLUŞTUR
        // =========================

        [EnableRateLimiting("public-write")]
        [HttpPost]
        public async Task<IActionResult> Create(
            CreateAppointmentDto dto)
        {
            if (dto.AppointmentDate <= DateTime.Now)
            {
                return BadRequest(
                    "Geçmiş bir tarih için randevu oluşturulamaz."
                );
            }


            // Seçilen saat gerçekten admin
            // tarafından açılmış mı?
            var availableSlot =
                await _context.AvailableSlots
                    .FirstOrDefaultAsync(x =>
                        x.StartDateTime ==
                            dto.AppointmentDate &&
                        x.IsActive
                    );

            if (availableSlot == null)
            {
                return BadRequest(
                    "Seçilen tarih ve saat müsait değildir."
                );
            }


            // Aynı saatte başka aktif
            // randevu var mı?
            var isBooked =
                await _context.Appointments
                    .AnyAsync(x =>
                        x.AppointmentDate ==
                            dto.AppointmentDate &&
                        x.Status !=
                            AppointmentStatus.Cancelled
                    );

            if (isBooked)
            {
                return Conflict(
                    "Bu tarih ve saat az önce başka biri tarafından alınmış olabilir. Lütfen başka bir saat seçin."
                );
            }


            var appointment = new Appointment
            {
                FullName = dto.FullName.Trim(),

                Email = dto.Email
                    .Trim()
                    .ToLower(),

                Phone = dto.Phone.Trim(),

                AppointmentDate =
                    dto.AppointmentDate,

                AppointmentType =
                    dto.AppointmentType.Trim(),

                Message =
                    string.IsNullOrWhiteSpace(
                        dto.Message
                    )
                        ? null
                        : dto.Message.Trim(),

                Status =
                    AppointmentStatus.Pending,

                CreatedDate =
                    DateTime.UtcNow
            };


            _context.Appointments.Add(
                appointment
            );


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict(
                    "Bu randevu saati az önce başka biri tarafından alındı. Lütfen farklı bir saat seçin."
                );
            }


            return Ok(new
            {
                message =
                    "Randevu talebiniz başarıyla oluşturuldu.",

                appointment.Id
            });
        }


        // =========================
        // ADMIN - TÜM RANDEVULAR
        // =========================

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var appointments =
                await _context.Appointments
                    .OrderBy(
                        x => x.AppointmentDate
                    )
                    .ToListAsync();

            return Ok(appointments);
        }


        // =========================
        // ADMIN - TEK RANDEVU
        // =========================

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(
            int id)
        {
            var appointment =
                await _context.Appointments
                    .FirstOrDefaultAsync(
                        x => x.Id == id
                    );

            if (appointment == null)
            {
                return NotFound(
                    "Randevu bulunamadı."
                );
            }

            return Ok(appointment);
        }


        // =========================
        // ADMIN - DURUM DEĞİŞTİR
        // =========================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            UpdateAppointmentStatusDto dto)
        {
            var appointment =
                await _context.Appointments
                    .FindAsync(id);

            if (appointment == null)
            {
                return NotFound(
                    "Randevu bulunamadı."
                );
            }


            appointment.Status =
                dto.Status;


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict(
                    "Bu tarih ve saatte başka bir aktif randevu bulunmaktadır."
                );
            }


            return Ok(appointment);
        }


        // =========================
        // ADMIN - RANDEVU SİL
        // =========================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(
            int id)
        {
            var appointment =
                await _context.Appointments
                    .FindAsync(id);

            if (appointment == null)
            {
                return NotFound(
                    "Randevu bulunamadı."
                );
            }


            _context.Appointments.Remove(
                appointment
            );

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}