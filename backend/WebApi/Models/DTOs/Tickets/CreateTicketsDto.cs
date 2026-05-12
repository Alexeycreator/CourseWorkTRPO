namespace WebApi.Models.DTOs.Tickets;

public class CreateTicketsDto
{
    public decimal Price { get; set; }
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public DateTime DateSale { get; set; }
}