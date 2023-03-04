using Application.Conversations;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ConversationsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetConversations()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }
        [HttpPost]
        public async Task<IActionResult> CreateConversation(string participantId)
        {

            return HandleResult(await Mediator.Send(new Create.Command { ParticipantId = participantId }));
        }

    }
}
