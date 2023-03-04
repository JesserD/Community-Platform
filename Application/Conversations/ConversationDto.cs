

namespace Application.Conversations
{
    public class ConversationDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<string> ParticipantNames { get; set; } = new List<string>();
        public ICollection<string> ParticipantIds { get; set; } = new List<string>();
        public ICollection<string> ParticipantPictureUrls { get; set; } = new List<string>();
    }
}


