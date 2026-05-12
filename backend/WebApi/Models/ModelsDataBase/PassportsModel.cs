using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApi.Models.ModelsDataBase;

[Table("Passports")]
public sealed class PassportsModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Required] public int Seria { get; set; }
    [Required] public int Number { get; set; }
    [Required] [MaxLength(50)] public string Type { get; set; }
    [Required] [MaxLength(500)] public string IssuedBy { get; set; }
    [Required] [MaxLength(25)] public string DepartmentCode { get; set; }
    [Required] public DateOnly DateOfIssue { get; set; }

    [JsonIgnore] public ICollection<AddressesModel>? Addresses { get; set; }
    [JsonIgnore] public ICollection<UsersModel>? Clients { get; set; }
}