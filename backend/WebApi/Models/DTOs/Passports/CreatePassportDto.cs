using WebApi.Models.ModelsDataBase;

namespace WebApi.Models.DTOs.Passports;

public class CreatePassportDto
{
    public int Seria { get; set; }
    public int Number { get; set; }
    public string Type { get; set; }
    public string IssuedBy { get; set; }
    public string DepartmentCode { get; set; }
    public DateOnly DateOfIssue { get; set; }
    public AddressesModel? Address { get; set; }
}