using WebApi.Models.DTOs.Addresses;
using WebApi.Models.DTOs.Hotels;

namespace WebApi.Models.DTOs.HotTours;

public class CurrentTourDto : ToursDto
{
    public List<AddressMainInfoDto>? Addresses { get; set; }
    public List<HotelMainInfoDto>? Hotels { get; set; }
    public string? Description { get; set; }
    public string? Separately { get; set; }
    public string? Included { get; set; }
    public string? Program { get; set; }
}