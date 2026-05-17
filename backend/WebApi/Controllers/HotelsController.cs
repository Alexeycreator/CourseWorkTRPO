using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NLog;
using WebApi.Methods.DataBase;
using WebApi.Models.DTOs.Addresses;
using WebApi.Models.DTOs.Hotels;
using WebApi.Models.DTOs.Hotels.HotelRooms;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HotelsController(ServerDbContext dbContext) : ControllerBase
{
    private Logger loggerHotelsController = LogManager.GetCurrentClassLogger();

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HotelsModel>>> GetHotels()
    {
        return await dbContext.Hotels.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HotelsModel>> GetHotel(int id)
    {
        var hotel = await dbContext.Hotels.FindAsync(id);
        if (hotel == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный отель не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(hotel);
    }

    [HttpPost("create-hotel")]
    public async Task<IActionResult> CreateHotel(int userId, [FromBody] CreateHotelDto? request)
    {
        try
        {
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"Такого пользователя нет" });
            }

            if (user.Role != "admin")
            {
                if (user.Role != "employee")
                {
                    return BadRequest(new { message = $"У пользователя недостаточно прав" });
                }
            }

            if (request == null)
            {
                return BadRequest(new { message = "Данные пустые" });
            }

            if (string.IsNullOrEmpty(request.Name))
            {
                return BadRequest(new { message = $"Название отеля обязательное поле" });
            }

            if (request.Stars <= 0)
            {
                return BadRequest(new { message = $"Звезды отеля обязательное поле" });
            }

            if (request.HotelRoomId > 0)
            {
                var hotelRoom = await dbContext.HotelRooms.FindAsync(request.HotelRoomId);
                if (hotelRoom == null)
                {
                    return NotFound(new { message = $"Данных о номере отеля не существует" });
                }
            }

            var address = await dbContext.Addresses.FindAsync(request.AddressId);
            if (address == null)
            {
                return NotFound(new { message = $"Данных об адресе отеля не существует" });
            }

            var newHotel = new HotelsModel()
            {
                Name = request.Name,
                ImageHotel = request.ImageHotel,
                Stars = request.Stars,
                Details = request.Details,
                HotelRoomsId = request.HotelRoomId,
                AddressId = request.AddressId
            };

            await dbContext.AddAsync(newHotel);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerHotelsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpPut("update-hotel")]
    public async Task<IActionResult> UpdateHotel(int userId, [FromBody] UpdateHotelDto? request)
    {
        try
        {
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"Такого пользователя нет" });
            }

            if (user.Role != "admin")
            {
                if (user.Role != "employee")
                {
                    return BadRequest(new { message = $"У пользователя недостаточно прав" });
                }
            }

            if (request == null)
            {
                return BadRequest(new { message = "Данные пустые" });
            }

            var hotel = await dbContext.Hotels.FindAsync(request.Id);
            if (hotel == null)
            {
                return BadRequest(new { message = $"Такого отеля нет" });
            }

            if (!string.IsNullOrEmpty(request.Name))
            {
                hotel.Name = request.Name;
            }

            if (!string.IsNullOrEmpty(request.ImageHotel))
            {
                hotel.ImageHotel = request.ImageHotel;
            }

            if (!string.IsNullOrEmpty(request.Details))
            {
                hotel.Details = request.Details;
            }

            if (request.Stars > 0)
            {
                hotel.Stars = request.Stars;
            }

            if (request.HotelRoomId > 0)
            {
                var hotelRoom = await dbContext.HotelRooms.FindAsync(request.HotelRoomId);
                if (hotelRoom == null)
                {
                    return NotFound(new { message = $"Данных о номере отеля не существует" });
                }

                if (request.HotelRoomId != hotel.HotelRoomsId)
                {
                    hotel.HotelRoomsId = request.HotelRoomId;
                }
            }
            
            var address = await dbContext.Addresses.FindAsync(request.AddressId);
            if (address == null)
            {
                return NotFound(new { message = $"Данных об адресе отеля не существует" });
            }

            if (hotel.AddressId != request.AddressId)
            {
                hotel.AddressId = request.AddressId;
            }

            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerHotelsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpDelete("delete-hotel")]
    public async Task<IActionResult> DeleteHotel(int hotelId, int userId)
    {
        try
        {
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"Такого пользователя нет" });
            }

            if (user.Role != "admin")
            {
                if (user.Role != "employee")
                {
                    return BadRequest(new { message = $"У пользователя недостаточно прав" });
                }
            }

            var hotel = await dbContext.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                return NotFound(new { message = $"Такого отеля нет" });
            }


            dbContext.Hotels.Remove(hotel);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerHotelsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }


    [HttpGet("get-current-hotel-info")]
    public async Task<IActionResult> GetCurrentHotelInfo(int tourId)
    {
        try
        {
            loggerHotelsController.Info($"Задействован метод получения информации об отеле...");
            var hotel = await dbContext.Hotels.FindAsync(tourId);
            if (hotel == null)
            {
                return NotFound(new { message = $"Данных об отеле нет" });
            }

            var tourHotelAddress = await dbContext.ToursHotelsAddresses.Where(tha => tha.ToursId == tourId)
                .Include(tha => tha.Hotel)
                .ThenInclude(hotelsModel => hotelsModel.HotelRoom)
                .Include(toursHotelsAddressesModel => toursHotelsAddressesModel.Tour).FirstOrDefaultAsync();
            if (tourHotelAddress != null)
            {
                if (tourHotelAddress.Tour != null)
                {
                    ResponseHotelDto responseCurrentHotel = new ResponseHotelDto()
                    {
                        Id = hotel.Id,
                        Name = hotel.Name,
                        ImageHotel = hotel.ImageHotel,
                        Stars = hotel.Stars,
                        Description = hotel.Details,
                        CountNight = CalculateCountNight(Convert.ToDateTime(tourHotelAddress.Tour.EndDot),
                            Convert.ToDateTime(tourHotelAddress.Tour.StartDot))
                    };

                    var address = await dbContext.Addresses.FindAsync(tourHotelAddress.AddressesId);
                    if (address != null)
                    {
                        ResponseInfoAddressHotelOrRoomDto responseCurrentHotelAddress =
                            new ResponseInfoAddressHotelOrRoomDto()
                            {
                                Id = address.Id,
                                Region = address.Region,
                                Country = address.Country,
                                City = address.City,
                                Street = address.Street,
                                House = address.House,
                                Apartment = address.Apartment
                            };
                        var hotelRooms = await dbContext.HotelRooms.Include(hr => hr.Hotels.Where(h => h.Id == tourId))
                            .ToListAsync();
                        List<ResponseMainInfoHotelRooms> respInfoHotelRoom = new List<ResponseMainInfoHotelRooms>();
                        if (hotelRooms.Count > 0)
                        {
                            foreach (var hr in hotelRooms)
                            {
                                var idHotelRoom = hr.Id;
                                var nameHotelRoom = hr.NameRoom;
                                var typeHotelRoom = hr.TypeRoom;
                                var imageHotelRoom = hr.ImageRoom;
                                var floorHotelRoom = hr.Floor;
                                var detailsHotelRoom = hr.Details;

                                respInfoHotelRoom.Add(new ResponseMainInfoHotelRooms()
                                {
                                    Id = idHotelRoom,
                                    NameRoom = nameHotelRoom,
                                    TypeRoom = typeHotelRoom,
                                    ImageRoom = imageHotelRoom,
                                    Floor = floorHotelRoom,
                                    Details = detailsHotelRoom,
                                });
                            }
                        }

                        ResponseHotelDto respHotelInfo = new ResponseHotelDto()
                        {
                            Id = responseCurrentHotel.Id,
                            CountNight = responseCurrentHotel.CountNight,
                            Stars = responseCurrentHotel.Stars,
                            Description = responseCurrentHotel.Description,
                            Name = responseCurrentHotel.Name,
                            ImageHotel = responseCurrentHotel.ImageHotel,
                            Address = responseCurrentHotelAddress,
                            MainInfo = respInfoHotelRoom,
                        };

                        return Ok(respHotelInfo);
                    }
                }
            }

            return BadRequest(new { message = $"Что-то пошло не так. Обратитесь к администратору" });
        }
        catch (Exception ex)
        {
            loggerHotelsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    private int CalculateCountNight(DateTime end, DateTime start)
    {
        return end.Day - start.Day;
    }
}