using Application.Core;
using Application.Messages;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendMessage(Create.Command command)
        {
            var message = await _mediator.Send(command);
            await ForwardMessage(command.ConversationId.ToString(), "ReceiveMessage", message);
        }

        public async Task UpdateMessage(Update.Command command)
        {
            var message = await _mediator.Send(command);
            if (message.Value != null)
                await ForwardMessage(message.Value.ConversationId.ToString(), "UpdateMessage", message);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            if (httpContext == null) return;

            var conversationId = httpContext.Request.Query["conversationId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
            var result = await _mediator.Send(new List.Query { ConversationId = Guid.Parse(conversationId) });
            await Clients.Caller.SendAsync("LoadMessages", result.Value);
        }

        private async Task ForwardMessage(string ConversationId, string MethodName, Result<MessageDto> message)
        {
            await Clients.Group(ConversationId).SendAsync(MethodName, message.Value);
        }
    }
}