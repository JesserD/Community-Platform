using Domain;
using Microsoft.AspNetCore.Identity;


namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any() && !context.Conversations.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    { UserName = "Bob", Email = "bob@test.com", Id="a13f9259-02a3-4567-b37a-056554664603"},
                    new AppUser
                    { UserName = "Jane", Email = "jane@test.com", Id="b13f9259-02a3-4567-b37a-056554664603"},
                    new AppUser
                    { UserName = "Tom", Email = "tom@test.com", Id="c13f9259-02a3-4567-b37a-056554664603"},
                };

                users[0].ProfilePhoto = new Photo { Id = "gnzgzbialcwch1vutpar", Url = "https://res.cloudinary.com/do53vjdkv/image/upload/v1648049900/gnzgzbialcwch1vutpar.png" };
                users[1].ProfilePhoto = new Photo { Id = "bpw1r1nsg5hpq3y0zkbi", Url = "https://res.cloudinary.com/do53vjdkv/image/upload/v1657451059/bpw1r1nsg5hpq3y0zkbi.jpg" };
                users[2].ProfilePhoto = new Photo { Id = "zc90dzv5ojrm3beywhlh", Url = "https://res.cloudinary.com/do53vjdkv/image/upload/v1657451059/zc90dzv5ojrm3beywhlh.jpg" };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }

                var conversationJaneTom = new List<Message>
                {
                    new Message
                    {
                        Id = new Guid(),
                        Author = users[1],
                        Body = "Hello I'm Jane",
                        IsSent=true,
                        CreatedAt = DateTime.UtcNow.AddHours(-2),
                    },
                    new Message
                    {
                        Id = new Guid(),
                        Author = users[2],
                        Body = "Hello I'm Tom",
                        IsSent=true,
                        CreatedAt = DateTime.UtcNow.AddHours(-3),
                    }
                };

                var conversationBobJane = new List<Message>
                {
                    new Message
                    {
                        Id = new Guid(),
                        Author = users[0],
                        CreatedAt = DateTime.UtcNow.AddHours(-1),
                        Body = "Hello I'm Bob. This is a conversation between me and Jane",
                        IsSent=true,
                    },
                    new Message
                    {
                        Id = new Guid(),
                        CreatedAt = DateTime.UtcNow.AddHours(-2),
                        Author = users[1],
                        Body = "Hello I'm Jane. This is a conversation between me and Bob",
                        IsSent=true,
                    },

                };

                var conversations = new List<Conversation>
                {
                    new Conversation
                    {
                        Id = new Guid(),
                        Participants = new List<AppUser>{users[0], users[1]},
                        Messages = conversationBobJane,
                    },
                    new Conversation
                    {
                        Id = new Guid(),
                        Participants = new List<AppUser>{users[2], users[1]},
                        Messages = conversationJaneTom,
                    },
                };



                await context.Conversations.AddRangeAsync(conversations);
                await context.SaveChangesAsync();
            }
        }
    }
}
