using WebApi.Models.DTOs.Addresses;
using WebApi.Models.DTOs.Hotels.HotelRooms;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Models.DTOs.Hotels;

public sealed class ResponseHotelDto : HotelMainInfoDto
{
    public ResponseInfoAddressHotelOrRoomDto? Address { get; set; }
    public List<RespMainInfoHotelRooms>? MainInfo { get; set; }
}