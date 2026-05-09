namespace WebApi.Models.DTOs.HotTours;

public class CurrentHotTourDto : HotToursDto
{
    public string? Description { get; set; }
    public string? Separately { get; set; }
    public string? Included { get; set; }
    public string? Program { get; set; }
}