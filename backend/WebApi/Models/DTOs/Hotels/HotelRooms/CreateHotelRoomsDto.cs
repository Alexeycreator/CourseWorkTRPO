namespace WebApi.Models.DTOs.Hotels.HotelRooms;

public class CreateHotelRoomsDto
{
    public string NameRoom { get; set; }
    public string? Details { get; set; }
    public int Floor { get; set; }
    public string? ImageRoom { get; set; }
    public string TypeRoom { get; set; }
}