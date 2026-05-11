using WebApi.Models.DTOs.Addresses;
using WebApi.Models.DTOs.Hotels;

namespace WebApi.Models.DTOs.HotTours;

public class CurrentHotTourDto : HotToursDto
{
    public AddressMainInfoDto? Address { get; set; }
    public HotelMainInfoDto? Hotel { get; set; }
    public string? Description { get; set; }
    public string? Separately { get; set; }
    public string? Included { get; set; }
    public string? Program { get; set; }
}