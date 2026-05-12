namespace WebApi.Models.DTOs.Passports;

public sealed class UpdatePassportDto : CreatePassportDto
{
    public int Id { get; set; }
    public int PassportId { get; set; }
}