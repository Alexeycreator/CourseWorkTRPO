using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.ModelsDataBase;

[Table("CurrencyRates_Tickets")]
public sealed class CurrencyRates_TicketsModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Column("CurrencyRates_Id")]
    [ForeignKey("CurrencyRate")]
    public int CurrencyRates_Id { get; set; }

    [Column("Tickets_Id")]
    [ForeignKey("Ticket")]
    public int Tickets_Id { get; set; }

    public CurrencyRatesModel CurrencyRate { get; set; }
    public TicketsModel Ticket { get; set; }
}