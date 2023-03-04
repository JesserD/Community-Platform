using Application.Core;
using Application.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Details
    {
        public class Query : IRequest<Result<string>>
        {
            public string UserId { get; set; } = string.Empty;
        }

        public class Handler : IRequestHandler<Query, Result<string>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<string>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(u => u.ProfilePhoto).SingleOrDefaultAsync(x => x.Id == request.UserId);

                if (user == null) return null;

                return Result<string>.Success(user.ProfilePhoto.Url);
            }
        }
    }
}