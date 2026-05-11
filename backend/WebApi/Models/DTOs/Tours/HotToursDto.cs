namespace WebApi.Models.DTOs.HotTours;

public class HotToursDto : ToursDto
{
    public double? OldPrice { get; set; }
    public double? NowPrice { get; set; }
}