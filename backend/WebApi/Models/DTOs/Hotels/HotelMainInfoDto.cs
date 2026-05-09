namespace WebApi.Models.DTOs.Hotels;

public sealed class HotelMainInfoDto
{
    public int Id { get; set; }
    public int? Stars { get; set; }
    public int? CountNight { get; set; }
    public string? Description { get; set; }
    public string? ImageHotel { get; set; }
}