namespace PsychologistWeb.Api.Models
{
    public class AdminUser
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string? PasswordResetTokenHash { get; set; }

        public DateTime? PasswordResetTokenExpiresAt { get; set; }
    }

}