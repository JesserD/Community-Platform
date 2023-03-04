

namespace Application.Messages
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public bool IsSent { get; set; }
        public bool IsSeen { get; set; }
        public bool IsDelivered { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid ConversationId { get; set; }
    }
}
