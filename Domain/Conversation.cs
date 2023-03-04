

namespace Domain
{
    public class Conversation
    {
        public Guid Id { get; set; } = new Guid();
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<AppUser> Participants { get; set; } = new List<AppUser>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
