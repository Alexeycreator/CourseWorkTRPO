namespace WebApi.Models.DTOs.HotTours;

public class ToursDto
{
    public int Id { get; set; }
    public string? ImageTour { get; set; }
    public string? NameTour { get; set; }
    public string? Details { get; set; }
    public string? StartDot { get; set; }
    public string? EndDot { get; set; }
    public string? Type { get; set; }
    public double? Price { get; set; }
    public int? CountNights { get; set; }
}