namespace WebApi.Models.DTOs.Client;

public sealed class ClientResponseDto
{
    public int Id { get; set; }
    public string SurName { get; set; }
    public string FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string Login { get; set; }
    public int? Passport_Id { get; set; }
    public bool IsReadOnly { get; set; }
}