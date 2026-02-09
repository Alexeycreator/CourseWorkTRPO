using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
    [Required] [MaxLength(2000)] public string Details { get; set; }
    [Required] [MaxLength(1000)] public string ImageTour { get; private set; }

    [Column("Tickets_Id")]
    [ForeignKey("Ticket")]
    public int Tickets_Id { get; set; }

    [Column("Transfers_Id")]
    [ForeignKey("Transfer")]
    public int Transfers_Id { get; set; }

    public TicketsModel Ticket { get; set; }
    public TransfersModel Transfer { get; set; }
}