using FoodDiary.API;
using FoodDiary.Infrastructure;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FoodDiary.ComponentTests.Infrastructure;

public static class WebApplicationFactoryExtensions
{
    public static async Task SeedDataAsync<TEntity>(
        this WebApplicationFactory<Startup> factory,
        IEnumerable<TEntity> entities) where TEntity : class
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<FoodDiaryContext>();
        var dbSet = dbContext.Set<TEntity>();
        dbSet.AddRange(entities);
        await dbContext.SaveChangesAsync();
    }

    public static async Task ClearDataAsync(this WebApplicationFactory<Startup> factory)
    {
        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<FoodDiaryContext>();
        await dbContext.Database.ExecuteSqlRawAsync(@"
            truncate table ""Notes"" cascade;
            truncate table ""Pages"" cascade;
            truncate table ""Products"" cascade;
            truncate table ""Categories"" cascade;");
    }
}