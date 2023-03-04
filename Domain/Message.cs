

namespace Domain
{
    public class Message
    {
        public Guid Id { get; set; } = new Guid();
        public AppUser Author { get; set; } = new AppUser();
        public string Body { get; set; } = string.Empty;
        public bool IsSent { get; set; } = true;
        public bool IsSeen { get; set; } = false;
        public bool IsDelivered { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Conversation Conversation { get; set; } = new Conversation();
    }
}
