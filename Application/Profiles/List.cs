using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class List
    {
        public class Query : IRequest<Result<List<ProfileDto>>>
        {
            public string SearchUsername { get; set; } = string.Empty;
        }

        public class Handler : IRequestHandler<Query, Result<List<ProfileDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<ProfileDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var users = await _context.Users.Include(u => u.ProfilePhoto)
                    .Where(u => u.UserName.Contains(request.SearchUsername))
                    .ProjectTo<ProfileDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return Result<List<ProfileDto>>.Success(users);
            }
        }
    }
}
