using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public bool IsOnline { get; set; } = false;
        public DateTime LastSeen { get; set; } = DateTime.UtcNow;
        public Photo ProfilePhoto { get; set; } = new Photo();
        public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}