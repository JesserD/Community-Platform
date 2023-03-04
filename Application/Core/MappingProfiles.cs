using Application.Conversations;
using Application.Messages;
using Application.Profiles;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Conversation, ConversationDto>()
                .ForMember(d => d.ParticipantPictureUrls, o => o.MapFrom(s => s.Participants.Select(Participant => Participant.ProfilePhoto.Url)))
                .ForMember(d => d.ParticipantIds, o => o.MapFrom(s => s.Participants.Select(Participant => Participant.Id)))
                .ForMember(d => d.ParticipantNames, o => o.MapFrom(s => s.Participants.Select(Participant => Participant.UserName)));
            CreateMap<Message, MessageDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.ConversationId, o => o.MapFrom(s => s.Conversation.Id));
            CreateMap<AppUser, ProfileDto>()
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ProfilePhoto.Url));

        }
    }
}
