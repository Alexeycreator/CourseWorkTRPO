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
    [Required] public string Type { get; set; }
    public bool IsReadOnly { get; set; } = false;

    [JsonIgnore] public ICollection<AddressesModel>? Addresses { get; set; }
    [JsonIgnore] public ICollection<ClientsModel>? Clients { get; set; }
}