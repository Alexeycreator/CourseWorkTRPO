using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Models.ModelsDataBase;

[Table("Tickets")]
public sealed class TicketsModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Required] public DateTime DepartureTime { get; set; }
    [Required] public DateTime ArrivalTime { get; set; }
    [Required] public DateTime DateSale { get; set; }
    public bool IsReadOnly { get; set; } = false;

    [Column("Client_Id")]
    [ForeignKey("Client")]
    public int? Client_Id { get; set; }

    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public ClientsModel? Client { get; set; }

    [JsonIgnore] public ICollection<CurrencyRates_TicketsModel>? CurrencyRatesTickets { get; set; }
    [JsonIgnore] public ICollection<EmployeesModel>? Employees { get; set; }
}