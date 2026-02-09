using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.ModelsDataBase;

[Table("Hotels")]
public sealed class HotelsModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Required] [MaxLength(100)] public string Name { get; set; }
    [Required] public int Stars { get; set; }
    [Required] public int TimeOfStay { get; set; }
    [Required] [MaxLength(1000)] public string ImageHotel { get; set; }
    [MaxLength(2000)] public string? Details { get; set; }

    [Column("Address_Id")]
    [ForeignKey("Address")]
    public int Address_Id { get; set; }

    [Column("Tickets_Id")]
    [ForeignKey("Ticket")]
    public int Tickets_Id { get; set; }

    [Column("HotelRooms_Id")]
    [ForeignKey("HotelRoom")]
    public int HotelRooms_Id { get; set; }

    public AddressesModel Address { get; set; }
    public TicketsModel Ticket { get; set; }
    public HotelRoomsModel HotelRoom { get; set; }
}