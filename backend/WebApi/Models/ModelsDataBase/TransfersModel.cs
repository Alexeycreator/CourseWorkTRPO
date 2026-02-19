using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApi.Models.ModelsDataBase;

[Table("Transfers")]
public sealed class TransfersModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Required] [MaxLength(100)] public string Name { get; set; }
    [Required] [MaxLength(1000)] public string Route { get; set; }
    [MaxLength(2000)] public string? Details { get; set; }
    public bool IsReadOnly { get; set; } = false;

    [JsonIgnore] public ICollection<ToursModel>? Tours { get; set; }
}