using System.Text;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Methods.CsvWorking;

public sealed class CsvWriter
{
    public void Write(string filePath, List<CurrencyRatesModel> rates)
    {
        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.AppendLine("DigitalCode;LetterCode;Units;Currency;Rate;DateReceipt");
        foreach (var rate in rates)
        {
            csvBuilder.AppendLine(
                $"{rate.DigitalCode};{rate.LetterCode};{rate.Units};{rate.Currency};{rate.Rate};{rate.DateReceipt}");
        }

        File.WriteAllText(filePath, csvBuilder.ToString());
    }
}