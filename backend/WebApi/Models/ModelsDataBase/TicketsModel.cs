using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    [Column("Client_Id")]
    [ForeignKey("Client")]
    public int Client_Id { get; set; }

    public ClientsModel Client { get; set; }

    public ICollection<CurrencyRates_TicketsModel> CurrencyRatesTickets { get; set; }
    public ICollection<EmployeesModel> Employees { get; set; }
}