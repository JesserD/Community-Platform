using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z]).{4,8}$", ErrorMessage = "Password must contain betwwen 4 and 8 characters , a mumber and a lowercase letter")]
        public string? Password { get; set; }
        [Required]
        public string? Username { get; set; }
    }
}
