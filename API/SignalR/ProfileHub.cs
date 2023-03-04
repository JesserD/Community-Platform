using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ProfileHub : Hub
    {
        private readonly IMediator _mediator;
        public ProfileHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SearchUsername(List.Query query)
        {
            var users = await _mediator.Send(query);
            await Clients.Caller.SendAsync("LoadProfiles", users.Value);
        }

    }
}
