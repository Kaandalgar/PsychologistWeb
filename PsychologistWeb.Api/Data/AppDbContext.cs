using Microsoft.EntityFrameworkCore;
using PsychologistWeb.Api.Models;

namespace PsychologistWeb.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(
            DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<TherapyService> TherapyServices { get; set; }

        public DbSet<AdminUser> AdminUsers { get; set; }

        public DbSet<BlogPost> BlogPosts { get; set; }

        public DbSet<Appointment> Appointments { get; set; }

        public DbSet<AvailableSlot> AvailableSlots { get; set; }

        public DbSet<ContactMessage> ContactMessages { get; set; }

        public DbSet<SiteSetting> SiteSettings { get; set; }


        protected override void OnModelCreating(
            ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // =====================================
            // AVAILABLE SLOT
            // Aynı tarih/saat iki kez oluşturulamaz.
            // =====================================

            modelBuilder.Entity<AvailableSlot>()
                .HasIndex(x => x.StartDateTime)
                .IsUnique();


            // =====================================
            // APPOINTMENT
            // Aynı tarih/saatte yalnızca
            // 1 aktif randevu olabilir.
            //
            // Status = 2 -> Cancelled
            // İptal edilmiş randevu yeni rezervasyonu
            // engellemez.
            // =====================================

            modelBuilder.Entity<Appointment>()
                .HasIndex(x => x.AppointmentDate)
                .IsUnique()
                .HasFilter("[Status] <> 2");
        }
    }
}