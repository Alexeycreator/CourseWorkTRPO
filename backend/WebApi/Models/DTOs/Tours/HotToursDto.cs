namespace WebApi.Models.DTOs.HotTours;

public sealed class HotToursDto : ToursDto
{
    public double? OldPrice { get; set; }
    public double? NowPrice { get; set; }
}