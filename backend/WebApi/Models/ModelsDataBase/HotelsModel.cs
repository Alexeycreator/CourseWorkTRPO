using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Models.ModelsDataBase;

[Table("Hotels")]
public sealed class HotelsModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Required] [MaxLength(100)] public string Name { get; set; }
    [Required] public int Stars { get; set; }
    public int? TimeOfStay { get; set; }
    [MaxLength(1000)] public string? ImageHotel { get; set; }
    [MaxLength(2000)] public string? Details { get; set; }

    [Column("AddressId")]
    [ForeignKey("Address")]
    public int AddressId { get; set; }

    [Column("TicketsId")]
    [ForeignKey("Ticket")]
    public int? TicketsId { get; set; }

    [Column("HotelRoomsId")]
    [ForeignKey("HotelRoom")]
    public int? HotelRoomsId { get; set; }

    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public AddressesModel? Address { get; set; }

    [DeleteBehavior(DeleteBehavior.SetNull)]
    [JsonIgnore]
    public TicketsModel? Ticket { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    [JsonIgnore]
    public HotelRoomsModel? HotelRoom { get; set; }

    [JsonIgnore] public ICollection<Tours_Hotels_AddressesModel>? ToursHotels { get; set; }
}