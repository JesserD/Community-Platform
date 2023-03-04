using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Conversations
{
    public class Create
    {
        public class Command : IRequest<Result<ConversationDto>>
        {
            public string ParticipantId { get; set; } = string.Empty;
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.ParticipantId).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<ConversationDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }
            public async Task<Result<ConversationDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var participants = await _context.Users.Where(u => request.ParticipantId == u.Id).ToListAsync(cancellationToken);

                if (participants == null) return Result<ConversationDto>.Failure("Failed to create conversation. The user doesn't exist.");

                var user = await _context.Users.Where(u => u.Id.Equals(_userAccessor.GetUserId())).FirstOrDefaultAsync();

                if (user != null) participants.Add(user);

                var conversation = new Conversation
                {
                    Participants = participants,
                    Messages = {
                        new Message { Author = participants[1], Body = $"Hello, I'm {participants[1].UserName}", IsSent = true }
                    }
                };

                _context.Conversations.Add(conversation);

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (success) return Result<ConversationDto>.Success(_mapper.Map<ConversationDto>(conversation));

                return Result<ConversationDto>.Failure("Failed to create conversation");
            }
        }
    }
}
