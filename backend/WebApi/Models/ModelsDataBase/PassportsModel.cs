using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    public ICollection<AddressesModel> Addresses { get; set; }
    public ICollection<ClientsModel> Clients { get; set; }
}