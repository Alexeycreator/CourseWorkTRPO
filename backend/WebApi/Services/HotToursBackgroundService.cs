using Microsoft.EntityFrameworkCore;
using NLog;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Services;

public sealed class HotToursBackgroundService : BackgroundService
{
    private Logger loggerHotToursBackgroundService = LogManager.GetCurrentClassLogger();
    private string? connectionString;

    public HotToursBackgroundService()
    {
    }

    public HotToursBackgroundService(string? connectionString)
    {
        this.connectionString = connectionString;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        loggerHotToursBackgroundService.Info(
            $"Запуск фоновой задачи для обнаружения 'горячих туров' в БД");
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var optionsBuilder = new DbContextOptionsBuilder<ServerDbContext>();
                optionsBuilder.UseSqlServer($"{connectionString}");
                await using (ServerDbContext dbContext = new ServerDbContext(optionsBuilder.Options))
                {
                    await GetHotTours(dbContext);
                }
            }
            catch (Exception ex)
            {
                loggerHotToursBackgroundService.Error($"Неизвестная ошибка при запуске задачи: {ex.Message}");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        loggerHotToursBackgroundService.Info(
            "Сервис фонового обнаружение 'горячих туров' в БД останавливается");
        await base.StopAsync(cancellationToken);
    }

    private async Task<ToursModel> GetHotTours(ServerDbContext dbContext)
    {
        try
        {
            List<ToursModel> tours = new List<ToursModel>();
            while (true)
            {
                var hotTours = await dbContext.Tours.Where(t => t.HotTour == true).ToListAsync();
                if (hotTours.Count > 0)
                {
                    tours.Add(new ToursModel()
                    {
                        
                    });
                }
                await Task.Delay(TimeSpan.FromSeconds(10)); // поменять на 30 минут
            }
        }
        catch (Exception ex)
        {
            loggerHotToursBackgroundService.Error(
                $"Неизвестная ошибка при получении данных о 'горячих турах': {ex.Message}");
            return null;
        }
    }
}