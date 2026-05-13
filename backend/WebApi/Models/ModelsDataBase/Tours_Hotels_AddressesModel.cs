using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Models.ModelsDataBase;

[Table("Tours_Hotels_Addresses")]
public sealed class Tours_Hotels_AddressesModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Column("ToursId")]
    [ForeignKey("Tour")]
    public int ToursId { get; set; }
    
    [Column("HotelsId")]
    [ForeignKey("Hotel")]
    public int HotelsId { get; set; }
    
    [Column("AddressesId")]
    [ForeignKey("Address")]
    public int AddressesId { get; set; }
    
    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public ToursModel? Tour { get; set; }
    
    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public HotelsModel? Hotel { get; set; }
    
    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public AddressesModel? Address { get; set; }
}