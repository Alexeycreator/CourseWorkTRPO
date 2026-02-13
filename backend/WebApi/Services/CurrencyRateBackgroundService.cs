using Microsoft.EntityFrameworkCore;
using NLog;
using WebApi.Methods.DataBase;
using WebApi.Methods.Parsing;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Services;

public sealed class CurrencyRateBackgroundService : BackgroundService
{
    private Logger loggerCurrencyRateBackgroundService = LogManager.GetCurrentClassLogger();
    private readonly IServiceProvider services;
    private readonly HttpClient httpClient;
    private readonly TimeSpan updateInterval = TimeSpan.FromHours(6);
    private List<CurrencyRatesModel> currencies = new List<CurrencyRatesModel>();

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        loggerCurrencyRateBackgroundService.Info("Сервис фонового получения курсов валют запущен");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                CurrencyRateParser parser = new CurrencyRateParser(currencies);
                currencies = parser.GetRates();
                if (currencies.Any())
                {
                    loggerCurrencyRateBackgroundService.Info($"Попытка отправить курсы валют в БД...");
                    await PushRatesInDbAsync();
                }
                else
                {
                    loggerCurrencyRateBackgroundService.Warn($"Данные пустые. Отправлять в БД нечего.");
                }
            }
            catch (Exception ex)
            {
                loggerCurrencyRateBackgroundService.Error(ex,
                    "Ошибка при выполнении фоновой задачи получения курсов валют");
            }

            await Task.Delay(updateInterval, stoppingToken);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        loggerCurrencyRateBackgroundService.Info("Сервис фонового получения курсов валют останавливается");
        await base.StopAsync(cancellationToken);
    }

    private async Task PushRatesInDbAsync()
    {
        try
        {
            var optionsBuilder = new DbContextOptionsBuilder<ServerDbContext>();
            optionsBuilder.UseSqlServer(
                $@"Server=(local)\SQLEXPRESS;Database=TravelAgency;Trusted_Connection=True;TrustServerCertificate=True;");
            await using (ServerDbContext dbContext = new ServerDbContext(optionsBuilder.Options))
            {
                bool isConnected = await dbContext.Database.CanConnectAsync();
                if (isConnected)
                {
                    loggerCurrencyRateBackgroundService.Info($"Подключение к БД прошло успешно");
                    if (currencies.Any())
                    {
                        int countUpdateCurrency = 0;
                        int countAddedCurrency = 0;
                        foreach (var currency in currencies)
                        {
                            var existingCurrency =
                                dbContext.CurrencyRates.FirstOrDefault(c =>
                                    c.LetterCode == currency.LetterCode && c.DateReceipt == currency.DateReceipt);
                            if (existingCurrency != null)
                            {
                                bool updated = false;
                                if (existingCurrency.DigitalCode != currency.DigitalCode)
                                {
                                    existingCurrency.DigitalCode = currency.DigitalCode;
                                    updated = true;
                                }

                                if (existingCurrency.Units != currency.Units)
                                {
                                    existingCurrency.Units = currency.Units;
                                    updated = true;
                                }

                                if (existingCurrency.Currency != currency.Currency)
                                {
                                    existingCurrency.Currency = currency.Currency;
                                    updated = true;
                                }

                                if (existingCurrency.Rate != currency.Rate)
                                {
                                    existingCurrency.Rate = currency.Rate;
                                    updated = true;
                                }

                                dbContext.Entry(existingCurrency).State = EntityState.Modified;
                                if (updated)
                                {
                                    countUpdateCurrency++;
                                }
                            }
                            else
                            {
                                dbContext.CurrencyRates.Add(currency);
                                countAddedCurrency++;
                            }
                        }

                        int countSavedCurrency = await dbContext.SaveChangesAsync();
                        loggerCurrencyRateBackgroundService.Info(
                            $"Обработано валют: {countSavedCurrency} (добавлено: {countAddedCurrency}, обновлено: {countUpdateCurrency})");
                    }
                    else
                    {
                        loggerCurrencyRateBackgroundService.Error(
                            $"Данные о валютах пустые и не могут быть добавлены в таблицу 'CurrencyRates'.");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            loggerCurrencyRateBackgroundService.Error($"Неизвестная ошибка: {ex.Message}");
        }
    }
}