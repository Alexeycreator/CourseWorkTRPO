using WebApi.Models.ModelsDataBase;

namespace WebApi.Models.DTOs.Tickets;

public sealed class ResponseUserTicketsData
{
    public int Id { get; set; }
    public decimal Price { get; set; }
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public DateTime DateSale { get; set; }
    public int TourId { get; set; }
    public int HotelId { get; set; }
}