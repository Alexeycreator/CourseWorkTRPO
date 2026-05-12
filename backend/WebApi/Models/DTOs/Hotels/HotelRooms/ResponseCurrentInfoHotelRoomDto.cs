using WebApi.Models.DTOs.Addresses;

namespace WebApi.Models.DTOs.Hotels.HotelRooms;

public sealed class ResponseCurrentInfoHotelRoomDto
{
    public int Id { get; set; }
    public string? NameRoom { get; set; }
    public string? TypeRoom { get; set; }
    public string? Description { get; set; }
    public int? Floor { get; set; }
    public string? ImageRoom { get; set; }
    public AddressMainInfoDto? Address { get; set; }
}