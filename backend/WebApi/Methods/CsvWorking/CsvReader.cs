namespace WebApi.Methods.CsvWorking;

public sealed class CsvReader
{
    private readonly string csvFilePath_Clients =
        Path.Combine(Directory.GetCurrentDirectory(), /*"DataBaseModels",*/ "Clients.csv");

    public void Read()
    {
        using (StreamReader sr =
               new StreamReader(
                   @"C:\Users\Алексей\Desktop\Учеба\github\CourseWorkTRPO\backend\WebApi\bin\Debug\net9.0\Clients.csv"))
        {
            sr.ReadLine();
            while (!sr.EndOfStream)
            {
                var line = sr.ReadLine();
            }
        }
    }
}