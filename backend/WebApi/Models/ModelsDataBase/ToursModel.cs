using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Models.ModelsDataBase;

[Table("Tours")]
public sealed class ToursModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Required] [MaxLength(100)] public string Name { get; set; }
    [Required] [MaxLength(100)] public string StartDot { get; set; }
    [Required] [MaxLength(100)] public string EndDot { get; set; }
    [Required] [MaxLength(4000)] public string Details { get; set; }
    [Required] [MaxLength(1000)] public string ImageTour { get; set; }
    [Required] [MaxLength(4000)] public string Description { get; set; }
    [Required] [MaxLength(2000)] public string Separately { get; set; } = "Не предусмотрено";
    [Required] [MaxLength(2000)] public string Included { get; set; } = "Не предусмотрено";
    [Required] [MaxLength(2000)] public string Program { get; set; } = "Не предусмотрено";
    [Required] [MaxLength(100)] public string Type { get; set; } = "Экскурсионный";
    [Required] public bool HotTour { get; set; } = false;

    [Required]
    [Column(TypeName = "decimal(18, 2)")]
    public double Price { get; set; }
    
    [Column("TicketsId")]
    [ForeignKey("Ticket")]
    public int? TicketsId { get; set; }

    [Column("TransfersId")]
    [ForeignKey("Transfer")]
    public int? TransfersId { get; set; }

    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public TicketsModel? Ticket { get; set; }

    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public TransfersModel? Transfer { get; set; }

    [JsonIgnore] public ICollection<Tours_Hotels_AddressesModel>? ToursHotels { get; set; }
}