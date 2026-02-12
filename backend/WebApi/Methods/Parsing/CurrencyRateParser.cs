using WebApi.Models.ModelsDataBase;

namespace WebApi.Methods.Parsing;

public sealed class CurrencyRateParser
{
    private static string dateCurrencyRate = DateTime.Now.ToShortDateString();

    private readonly string urlCentralBank =
        $@"https://www.cbr.ru/currency_base/daily/?UniDbQuery.Posted=True&UniDbQuery.To={dateCurrencyRate}";

    private static readonly string dirPath = Path.Combine(Directory.GetCurrentDirectory(), "Rates");
    private readonly string filePath = Path.Combine(dirPath, $"Rate_{dateCurrencyRate}.csv");
    private HttpClient httpClient = new HttpClient();
    private HttpResponseMessage httpResponseMessage = new HttpResponseMessage();
    private List<CurrencyRatesModel> currencies;

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
            Directory.CreateDirectory(dirPath);
        }
    }

    public List<CurrencyRatesModel> GetRates()
    {
        return currencies;
    }
}