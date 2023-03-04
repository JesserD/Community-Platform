using AutoMapper;
using MediatR;
using FluentValidation;
using Persistence;
using Application.Core;
using Domain;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages
{
    public class Update
    {
        public class Command : IRequest<Result<MessageDto>>
        {
            public Message Message { get; set; } = new Message();
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {

            }
        }

        public class Handler : IRequestHandler<Command, Result<MessageDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<MessageDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var messageDB = await _context.Messages.FindAsync(request.Message.Id);
                if (messageDB == null) return Result<MessageDto>.Failure("Failed to update message");

                messageDB.IsSeen = request.Message.IsSeen;
                messageDB.IsDelivered = request.Message.IsDelivered;
                _context.Entry(messageDB).State = EntityState.Modified;

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (!result) return Result<MessageDto>.Failure("Failed to update message");

                var messageDto = await _context.Messages
                    .Where(m => m.Id == messageDB.Id)
                    .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(cancellationToken);

                if (messageDto == null) return Result<MessageDto>.Failure("Failed to update message");
                return Result<MessageDto>.Success(messageDto);
            }
        }
    }
}
