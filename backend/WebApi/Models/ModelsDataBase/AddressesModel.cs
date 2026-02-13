using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
    [Required] [MaxLength(100)] public string Street { get; set; }
    [Required] [MaxLength(100)] public string House { get; set; }
    public int? Apartment { get; set; }

    [Column("Passport_Id")]
    [ForeignKey("Passport")]
    public int? Passport_Id { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public PassportsModel Passport { get; set; }

    public ICollection<HotelsModel> Hotels { get; set; }
}