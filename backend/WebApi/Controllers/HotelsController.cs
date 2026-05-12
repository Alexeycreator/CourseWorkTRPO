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

            var newHotel = new HotelsModel()
            {
                Name = request.Name,
                ImageHotel = request.ImageHotel,
                Stars = request.Stars,
                Details = request.Details,
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
            return await FillingHotelInfo(tourId);
        }
        catch (Exception ex)
        {
            loggerHotelsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    private async Task<HotelsModel?> FindHotels(int? hotelId)
    {
        var hotel = await dbContext.Hotels.FindAsync(hotelId);
        if (hotel == null)
        {
            loggerHotelsController.Error($"Данных об отелях нет");
        }

        return hotel;
    }

    private async Task<IActionResult> FillingHotelInfo(int hotelId)
    {
        loggerHotelsController.Info($"Обработка отелей...");
        List<ResponseHotelDto> respHotelInfo = new List<ResponseHotelDto>();
        var tourHotelAddress = await dbContext.ToursHotelsAddresses.Where(tha => tha.ToursId == hotelId)
            .Include(toursHotelsAddressesModel => toursHotelsAddressesModel.Hotel)
            .ThenInclude(hotelsModel => hotelsModel.HotelRoom).FirstOrDefaultAsync();
        if (tourHotelAddress == null)
        {
            loggerHotelsController.Error($"У данного тура нет информации об отелях");
            return NotFound(new { message = $"У данного тура нет информации об отелях" });
        }

        ResponseInfoAddressHotelOrRoomDto responseInfoAddress = new ResponseInfoAddressHotelOrRoomDto();
        List<RespMainInfoHotelRooms> respInfoHotelRoom = new List<RespMainInfoHotelRooms>();
        HotelMainInfoDto respInfoHotel = new ResponseHotelDto();

        if (tourHotelAddress.Hotel != null)
        {
            var hotel = await FindHotels(tourHotelAddress.HotelsId);
            if (hotel == null)
            {
                loggerHotelsController.Error($"Такого отеля (id = {hotel?.Id}) нет");
                return NotFound(new { message = $"Такого отеля нет" });
            }

            if (tourHotelAddress.Hotel.HotelRoom != null)
            {
                var hotelRoom = await dbContext.HotelRooms.Where(hr => hr.Id == tourHotelAddress.Hotel.HotelRoomsId)
                    .ToListAsync();
                var tourCountNight = await dbContext.Tours.FindAsync(tourHotelAddress.ToursId);
                var address = await dbContext.Addresses.FindAsync(tourHotelAddress.AddressesId);

                if (address != null)
                {
                    responseInfoAddress.Id = address.Id;
                    responseInfoAddress.Country = address.Country;
                    responseInfoAddress.Region = address.Region;
                    responseInfoAddress.City = address.City;
                    responseInfoAddress.Street = address.Street;
                    responseInfoAddress.House = address.House;
                    responseInfoAddress.Apartment = address.Apartment;
                }


                if (tourCountNight != null)
                {
                    respInfoHotel.Id = hotel.Id;
                    respInfoHotel.Name = hotel.Name;
                    respInfoHotel.Stars = hotel.Stars;
                    respInfoHotel.ImageHotel = hotel.ImageHotel;
                    respInfoHotel.Description = hotel.Details;
                    respInfoHotel.CountNight = CalculateCountNight(Convert.ToDateTime(tourCountNight.EndDot),
                        Convert.ToDateTime(tourCountNight.StartDot));
                }
            }
            else
            {
                loggerHotelsController.Error($"Информации о номерах отеля нет");
                return BadRequest(new { message = $"Информации о номерах отеля нет" });
            }
        }
        else
        {
            loggerHotelsController.Error($"Информации об отеле нет");
            return BadRequest(new { message = $"Информации об отеле нет" });
        }

        respHotelInfo.Add(new ResponseHotelDto()
        {
            Id = respInfoHotel.Id,
            Name = respInfoHotel.Name,
            Stars = respInfoHotel.Stars,
            ImageHotel = respInfoHotel.ImageHotel,
            Description = respInfoHotel.Description,
            CountNight = respInfoHotel.CountNight,
            Address = responseInfoAddress,
            MainInfo = respInfoHotelRoom
        });

        return Ok(respHotelInfo);
    }

    private int CalculateCountNight(DateTime end, DateTime start)
    {
        return end.Day - start.Day;
    }
}