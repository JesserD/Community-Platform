using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class Create
    {
        public class Command : IRequest<Result<MessageDto>>
        {
            public string Body { get; set; } = string.Empty;
            public Guid ConversationId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
                RuleFor(x => x.ConversationId).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<MessageDto>>
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
            public async Task<Result<MessageDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var conversation = await _context.Conversations.FindAsync(new object?[] { request.ConversationId }, cancellationToken: cancellationToken);
                if (conversation == null) return Result<MessageDto>.Failure("Failed to add message. The conversation doesn't exist.");

                var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == _userAccessor.GetUserId(), cancellationToken: cancellationToken);
                if (user == null) return Result<MessageDto>.Failure("Failed to add message. The user doesn't exist."); ;

                var message = new Message
                {
                    Author = user,
                    Conversation = conversation,
                    Body = request.Body,
                    IsSent= true,
                };

                conversation.Messages.Add(message);

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (success)
                {
                    message.IsSent = true;
                    return Result<MessageDto>.Success(_mapper.Map<MessageDto>(message));
                }

                return Result<MessageDto>.Failure("Failed to add message");
            }
        }
    }
}
