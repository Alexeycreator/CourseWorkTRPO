using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Models.ModelsDataBase;

[Table("CurrencyRates_Tickets")]
public sealed class CurrencyRates_TicketsModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Column("CurrencyRatesId")]
    [ForeignKey("CurrencyRate")]
    public int? CurrencyRatesId { get; set; }

    [Column("TicketsId")]
    [ForeignKey("Ticket")]
    public int? TicketsId { get; set; }
    
    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public CurrencyRatesModel? CurrencyRate { get; set; }

    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public TicketsModel? Ticket { get; set; }
}