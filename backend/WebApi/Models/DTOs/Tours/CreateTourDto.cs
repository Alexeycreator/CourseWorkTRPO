namespace WebApi.Models.DTOs.HotTours;

public class CreateTourDto
{
    public string NameTour { get; set; }
    public DateOnly StartDot { get; set; }
    public DateOnly EndDot { get; set; }
    public string Details { get; set; }
    public string TypeTour { get; set; }
    public bool HotTour { get; set; }
    public double Price { get; set; }
    public string Description { get; set; }
    public string Program { get; set; }
    public string Included { get; set; }
    public string Separately { get; set; }
    public string ImageTour { get; set; }
    public int HotelsId { get; set; }
}