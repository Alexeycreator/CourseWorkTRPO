using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApi.Models.ModelsDataBase;

[Table("HotelRooms")]
public sealed class HotelRoomsModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required] [MaxLength(100)] public string NameRoom { get; set; }

    [MaxLength(1000)] public string? Details { get; set; }
    [Required] public int Floor { get; set; }

    [MaxLength(1000)] public string? ImageRoom { get; set; }
    public bool IsReadOnly { get; set; } = false;

    [JsonIgnore] public ICollection<HotelsModel>? Hotels { get; set; }
}