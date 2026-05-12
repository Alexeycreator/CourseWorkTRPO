namespace WebApi.Models.DTOs.Addresses;

public class ResponseInfoAddressHotelOrRoomDto : AddressMainInfoDto
{
    public string? Region { get; set; }
    public string? Street { get; set; }
    public string? House { get; set; }
    public int? Apartment { get; set; }
}