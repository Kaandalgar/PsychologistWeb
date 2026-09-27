namespace PsychologistWeb.Api.Models
{
    public class SiteSetting
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string AboutText { get; set; } = string.Empty;

        public string HomeIntroText { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string? InstagramUrl { get; set; }

        public string? LinkedInUrl { get; set; }

        public string? ProfileImageUrl { get; set; }
    }
}