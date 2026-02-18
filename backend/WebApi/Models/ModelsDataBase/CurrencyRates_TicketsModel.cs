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

    [Column("CurrencyRates_Id")]
    [ForeignKey("CurrencyRate")]
    public int? CurrencyRates_Id { get; set; }

    [Column("Tickets_Id")]
    [ForeignKey("Ticket")]
    public int? Tickets_Id { get; set; }

    public bool IsReadOnly { get; set; } = false;

    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public CurrencyRatesModel? CurrencyRate { get; set; }

    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public TicketsModel? Ticket { get; set; }
}