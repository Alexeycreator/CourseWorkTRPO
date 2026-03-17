using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApi.Models.ModelsDataBase;

[Table("CurrencyRates")]
public sealed class CurrencyRatesModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Required] public int DigitalCode { get; set; }
    [Required] [MaxLength(100)] public string LetterCode { get; set; }
    [Required] public int Units { get; set; }
    [Required] [MaxLength(100)] public string Currency { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,4)")]
    public double Rate { get; set; }

    [Required] [MaxLength(25)] public string DateReceipt { get; set; }
    public bool IsReadOnly { get; set; } = false;

    [JsonIgnore] public ICollection<CurrencyRates_TicketsModel>? CurrencyRatesTickets { get; set; }
}