using Microsoft.EntityFrameworkCore;
using Persistence;
using MediatR;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Security;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Application.Messages;
using Infrastructure.Photos;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationsServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            }).AddFluentValidation(config =>
            {
                config.RegisterValidatorsFromAssemblyContaining<Create>();
            });
            services.AddDbContext<DataContext>(options => options.UseSqlite(config.GetConnectionString("DataContextConnection")));

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyMethod().AllowAnyHeader().AllowCredentials().WithOrigins(new string[] { "http://localhost:3000", "https://localhost:5000" });
                });
            });
            
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            var sectionName = "Cloudinary";
            var cloudinaryValues = new Dictionary<string, string> {
                { $"{sectionName}:CloudName", Environment.GetEnvironmentVariable($"CUSTOMCONNSTR_CloudName") ?? config[$"{sectionName}:CloudName"] },
                { $"{sectionName}:ApiKey", Environment.GetEnvironmentVariable($"CUSTOMCONNSTR_ApiKey") ?? config[$"{sectionName}:ApiKey"] },
                { $"{sectionName}:ApiSecret", Environment.GetEnvironmentVariable($"CUSTOMCONNSTR_ApiSecret") ?? config[$"{sectionName}:ApiSecret"] }
            };
            var customConfig = new ConfigurationBuilder().AddInMemoryCollection(cloudinaryValues).Build();
            services.Configure<CloudinarySettings>(customConfig.GetSection(sectionName));
            services.AddSignalR();

            return services;
        }
    }
}
