using HtmlAgilityPack;
using NLog;
using WebApi.Methods.CsvWorking;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Methods.Parsing;

public sealed class CurrencyRateParser
{
    private Logger loggerCurrencyRateParser = LogManager.GetCurrentClassLogger();
    private static string dateCurrencyRate = DateTime.Now.ToShortDateString();

    private readonly string urlCentralBank =
        $@"https://www.cbr.ru/currency_base/daily/?UniDbQuery.Posted=True&UniDbQuery.To={dateCurrencyRate}";

    private static readonly string dirPath = Path.Combine(Directory.GetCurrentDirectory(), "Rates");
    private readonly string filePath = Path.Combine(dirPath, $"Rate_{dateCurrencyRate}.csv");
    private HttpClient httpClient = new HttpClient();
    private HttpResponseMessage httpResponseMessage = new HttpResponseMessage();
    private List<CurrencyRatesModel> currencies;
    private readonly string contentId = "content";

    public CurrencyRateParser()
    {
        CheckExistDir();
    }

    public CurrencyRateParser(List<CurrencyRatesModel> currencies)
    {
        CheckExistDir();
        this.currencies = currencies;
    }

    private void CheckExistDir()
    {
        if (!Directory.Exists(dirPath))
        {
            loggerCurrencyRateParser.Info($"Директории для хранения курсов валют не существует.");
            Directory.CreateDirectory(dirPath);
            loggerCurrencyRateParser.Info($"Директория создана. Курсы валют хранятся в ней.");
        }
    }

    public List<CurrencyRatesModel> GetRates()
    {
        return FillingRates();
    }

    private List<CurrencyRatesModel> FillingRates()
    {
        try
        {
            loggerCurrencyRateParser.Info($"Подключение к сайту ЦБ РФ...");
            httpResponseMessage = httpClient.GetAsync(urlCentralBank).Result;
            if (httpResponseMessage.IsSuccessStatusCode)
            {
                loggerCurrencyRateParser.Info($"Подключение прошло успешно. {httpResponseMessage.StatusCode}");
                var htmlResponse = httpResponseMessage.Content.ReadAsStringAsync().Result;
                if (!string.IsNullOrEmpty(htmlResponse))
                {
                    loggerCurrencyRateParser.Info($"Получен ответ от сервера.");
                    HtmlDocument document = new HtmlDocument();
                    document.LoadHtml(htmlResponse);
                    var container = document.GetElementbyId($"{contentId}");
                    if (container != null)
                    {
                        var tableBody = container.ChildNodes.FindFirst("tbody").ChildNodes.Where(x => x.Name == "tr")
                            .Skip(1)
                            .ToArray();
                        loggerCurrencyRateParser.Info($"Данные страницы получены. Извлечение данных...");

                        try
                        {
                            foreach (var tableRow in tableBody)
                            {
                                var cellDigitalCode = tableRow.SelectSingleNode(".//td[1]").InnerText;
                                var cellLetterCode = tableRow.SelectSingleNode(".//td[2]").InnerText;
                                var cellUnits = tableRow.SelectSingleNode(".//td[3]").InnerText;
                                var cellCurrency = tableRow.SelectSingleNode(".//td[4]").InnerText;
                                var cellRate = tableRow.SelectSingleNode(".//td[5]").InnerText;
                                currencies.Add(new CurrencyRatesModel()
                                {
                                    DigitalCode = Convert.ToInt32(cellDigitalCode),
                                    LetterCode = cellLetterCode,
                                    Units = Convert.ToInt32(cellUnits),
                                    Currency = cellCurrency,
                                    Rate = Convert.ToDouble(cellRate),
                                    DateReceipt = dateCurrencyRate
                                });
                            }
                        }
                        catch (FormatException ex)
                        {
                            loggerCurrencyRateParser.Error($"Ошибка формата данных: {ex.Message}");
                        }
                        catch (OverflowException ex)
                        {
                            loggerCurrencyRateParser.Error($"Числовое переполнение: {ex.Message}");
                        }
                        catch (NullReferenceException ex)
                        {
                            loggerCurrencyRateParser.Error($"Не найдена ячейка таблицы: {ex.Message}");
                        }
                        catch (Exception ex)
                        {
                            loggerCurrencyRateParser.Error($"Неизвестная ошибка: {ex.Message}");
                        }

                        if (currencies.Count > 0)
                        {
                            loggerCurrencyRateParser.Info($"Данные успешно получены");
                            try
                            {
                                loggerCurrencyRateParser.Info($"Идет запись данных в файл, по пути: {filePath}");
                                CsvWriter csvWriter = new CsvWriter();
                                csvWriter.Write(filePath, currencies);
                                loggerCurrencyRateParser.Info($"Запись в файл прошла успешно.");
                            }
                            catch (IOException ex)
                            {
                                loggerCurrencyRateParser.Error($"Записать данные в файл не удалось: {ex.Message}");
                            }
                        }
                        else
                        {
                            loggerCurrencyRateParser.Error($"Данные не записаны.");
                        }
                    }
                    else
                    {
                        loggerCurrencyRateParser.Error(
                            $"Неверный id, для получения данных. Проверьте его: {contentId}");
                    }
                }
                else
                {
                    loggerCurrencyRateParser.Error($"Ответ от сервера пришел пустой.");
                }
            }
            else
            {
                loggerCurrencyRateParser.Error($"Подключиться не удалось. {httpResponseMessage.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            loggerCurrencyRateParser.Error($"{ex.Message}");
        }

        return currencies;
    }
}