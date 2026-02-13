using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using NLog;
using WebApi.Methods.DataBase;

namespace WebApi.Services;

public sealed class DatabaseInitializerBackgroundService : BackgroundService
{
    private Logger loggerDatabaseInitializerBackgroundService = LogManager.GetCurrentClassLogger();
    private readonly string? connectionString;

    public DatabaseInitializerBackgroundService()
    {
    }

    public DatabaseInitializerBackgroundService(string? connectionString)
    {
        this.connectionString = connectionString;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        loggerDatabaseInitializerBackgroundService.Info(
            $"Запуск фоновой задачи, на проверку существования данных в БД");
        try
        {
            var optionsBuilder = new DbContextOptionsBuilder<ServerDbContext>();
            optionsBuilder.UseSqlServer($"{connectionString}");
            await using (ServerDbContext dbContext = new ServerDbContext(optionsBuilder.Options))
            {
                loggerDatabaseInitializerBackgroundService.Info($"Подключение к БД...");
                try
                {
                    bool isConnected = await dbContext.Database.CanConnectAsync(stoppingToken);
                    if (isConnected)
                    {
                        loggerDatabaseInitializerBackgroundService.Info($"Подключение к БД прошло упешно.");
                        await EnsureAllTablesDataAsync(dbContext);
                    }
                }
                catch (Exception ex)
                {
                    loggerDatabaseInitializerBackgroundService.Error($"Ошибка подключения к БД: {ex.Message}");
                }
            }
        }
        catch (Exception ex)
        {
            loggerDatabaseInitializerBackgroundService.Error($"Неизвестная ошибка: {ex.Message}");
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        loggerDatabaseInitializerBackgroundService.Info("Сервис фонового получения курсов валют останавливается");
        await base.StopAsync(cancellationToken);
    }

    private async Task EnsureAllTablesDataAsync(ServerDbContext dbContext)
    {
        try
        {
            var tableScripts = new Dictionary<string, string>
            {
                { "Passports", "SQL/InitPassports.sql" },
                { "Addresses", "SQL/InitAddresses.sql" },
                { "Clients", "SQL/InitClients.sql" },
                { "Tickets", "SQL/InitTickets.sql" },
                { "Employees", "SQL/InitEmployees.sql" },
                { "HotelRooms", "SQL/InitHotelRooms.sql" },
                { "Hotels", "SQL/InitHotels.sql" },
                { "Transfers", "SQL/InitTransfers.sql" },
                { "CurrencyRates_Tickets", "SQL/InitCurrencyRates_Tickets.sql" },
                { "Tours", "SQL/InitTours.sql" }
            };

            foreach (var (tableName, scriptPath) in tableScripts)
            {
                await EnsureTableDataAsync(tableName, scriptPath, dbContext);
            }
        }
        catch (Exception ex)
        {
            loggerDatabaseInitializerBackgroundService.Error($"Неизвестная ошибка: {ex.Message}");
        }
    }

    private async Task EnsureTableDataAsync(string tableName, string scriptPath, ServerDbContext dbContext)
    {
        var tableExists = await CheckIfTableExistsAsync(tableName, dbContext);
        if (!tableExists)
        {
            loggerDatabaseInitializerBackgroundService.Info(
                $"Таблица {tableName} не существует. Сначала нужно создать структуру БД.");
            return;
        }

        var count = await GetTableRowCountAsync(tableName, dbContext);
        if (count == 0)
        {
            if (File.Exists(scriptPath))
            {
                string sqlScript = await File.ReadAllTextAsync(scriptPath);
                var commands = sqlScript.Split(new[] { ";" }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var cmd in commands)
                {
                    if (!string.IsNullOrWhiteSpace(cmd))
                    {
                        await dbContext.Database.ExecuteSqlRawAsync(cmd);
                    }
                }

                loggerDatabaseInitializerBackgroundService.Info(
                    $"Таблица {tableName} заполнена данными из {scriptPath}");
            }
            else
            {
                loggerDatabaseInitializerBackgroundService.Info($"Файл скрипта не найден: {scriptPath}");
            }
        }
        else
        {
            loggerDatabaseInitializerBackgroundService.Info(
                $"Таблица {tableName} уже содержит {count} записей. Пропускаем заполнение.");
        }
    }

    private async Task<bool> CheckIfTableExistsAsync(string tableName, ServerDbContext dbContext)
    {
        try
        {
            await dbContext.Database
                .ExecuteSqlRawAsync($"SELECT TOP 1 1 FROM {tableName}");
            return true;
        }
        catch (SqlException ex) when (ex.Number == 208)
        {
            return false;
        }
        catch (Exception ex)
        {
            loggerDatabaseInitializerBackgroundService.Error($"Ошибка при проверке таблицы: {ex.Message}");
            return false;
        }
    }

    private async Task<int> GetTableRowCountAsync(string tableName, ServerDbContext dbContext)
    {
        using (var command = dbContext.Database.GetDbConnection().CreateCommand())
        {
            command.CommandText = $"SELECT COUNT(*) FROM {tableName}";
            await dbContext.Database.OpenConnectionAsync();
            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }
    }
}