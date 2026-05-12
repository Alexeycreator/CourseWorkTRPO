namespace WebApi.Models.DTOs.Hotels.HotelRooms;

public sealed class RespMainInfoHotelRooms
{
    public int Id { get; set; }
    public string? NameRoom { get; set; }
    public string? TypeRoom { get; set; }
    public string? ImageRoom { get; set; }
    public int? Floor { get; set; }
    public string? Details { get; set; }
}