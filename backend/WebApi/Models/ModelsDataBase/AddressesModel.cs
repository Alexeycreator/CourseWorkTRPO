using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Models.ModelsDataBase;

[Table("Addresses")]
public sealed class AddressesModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Required] [MaxLength(100)] public string Country { get; set; }
    [Required] [MaxLength(100)] public string Region { get; set; }
    [Required] [MaxLength(100)] public string City { get; set; }
    [MaxLength(100)] public string? Street { get; set; }
    [MaxLength(100)] public string? House { get; set; }
    public int? Apartment { get; set; }
    public bool IsReadOnly { get; set; } = false;

    [Column("Passport_Id")]
    [ForeignKey("Passport")]
    public int? Passport_Id { get; set; }

    [Column("Tours_Id")]
    [ForeignKey("Tours")]
    public int? Tours_Id { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    [JsonIgnore]
    public PassportsModel? Passport { get; set; }

    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public ToursModel? Tours { get; set; }

    [JsonIgnore] public ICollection<HotelsModel>? Hotels { get; set; }
}