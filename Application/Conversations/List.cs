using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Conversations
{
    public class List
    {
        public class Query : IRequest<Result<List<ConversationDto>>>
        {
            
        }

        public class Handler : IRequestHandler<Query, Result<List<ConversationDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<List<ConversationDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == _userAccessor.GetUserId(), cancellationToken);
                if (user == null) return Result<List<ConversationDto>>.Failure("Failed to fetch conversations. This user doesn't exist.");

                var convsersations = await _context.Conversations
                    .Where(c => c.Participants.Contains(user))
                    .OrderByDescending(x => x.CreatedAt)
                    .ProjectTo<ConversationDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return Result<List<ConversationDto>>.Success(convsersations);
            }
        }
    }
}
