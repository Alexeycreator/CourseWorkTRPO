namespace WebApi.Models.DTOs.Hotels;

public class CreateHotelDto
{
    public string Name { get; set; }
    public int Stars { get; set; }
    public string? ImageHotel { get; set; }
    public string? Details { get; set; }
    public int? HotelRoomId { get; set; }
}