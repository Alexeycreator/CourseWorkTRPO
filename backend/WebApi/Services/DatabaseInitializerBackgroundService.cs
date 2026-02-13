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
                { "Clients", "SQL/InitClients.sql" },
                { "Addresses", "SQL/InitAddresses.sql" },
                { "Passports", "SQL/InitPassports.sql" },
                { "Employees", "SQL/InitEmployees.sql" },
                { "Tours", "SQL/InitTours.sql" },
                { "Hotels", "SQL/InitHotels.sql" },
                { "Transfers", "SQL/InitTransfers.sql" },
                { "Tickets", "SQL/InitTickets.sql" },
                { "HotelRooms", "SQL/InitHotelRooms.sql" },
                { "CurrencyRates_Tickets", "SQL/InitCurrencyRates_Tickets.sql" }
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
        var sql = @"
            SELECT COUNT(*) 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_NAME = '{0}'";

        var count = await dbContext.Database
            .ExecuteSqlRawAsync(string.Format(sql, tableName));

        return count > 0;
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