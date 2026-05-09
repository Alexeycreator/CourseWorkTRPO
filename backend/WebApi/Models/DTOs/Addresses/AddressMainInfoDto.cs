namespace WebApi.Models.DTOs.Addresses;

public sealed class AddressMainInfoDto
{
    public int Id { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
}