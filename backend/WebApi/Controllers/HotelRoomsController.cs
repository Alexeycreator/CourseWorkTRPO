using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NLog;
using WebApi.Methods.DataBase;
using WebApi.Models.DTOs.Addresses;
using WebApi.Models.DTOs.Hotels.HotelRooms;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HotelRoomsController(ServerDbContext dbContext) : ControllerBase
{
    private Logger loggerHotelRoomsController = LogManager.GetCurrentClassLogger();

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HotelRoomsModel>>> GetHotelRooms()
    {
        return await dbContext.HotelRooms.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HotelRoomsModel>> GetHotelRoom(int id)
    {
        var hotelRoom = await dbContext.HotelRooms.FindAsync(id);
        if (hotelRoom == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный номер отеля не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(hotelRoom);
    }

    [HttpGet("get-current-info-hotel-room")]
    public async Task<IActionResult> GetCurrentInfoHotelRoom(int hotelRoomId)
    {
        try
        {
            var hotelRoom = await dbContext.HotelRooms.FindAsync(hotelRoomId);
            if (hotelRoom != null)
            {
                var responseHotelRoom = new ResponseCurrentInfoHotelRoomDto
                {
                    Id = hotelRoom.Id,
                    NameRoom = hotelRoom.NameRoom,
                    ImageRoom = hotelRoom.ImageRoom,
                    TypeRoom = hotelRoom.TypeRoom,
                    Description = hotelRoom.Details,
                    Floor = hotelRoom.Floor,
                };

                var address = await dbContext.Hotels.Where(h => h.HotelRoomsId == hotelRoomId).Include(h => h.Address)
                    .FirstOrDefaultAsync();
                if (address != null && address.Address != null)
                {
                    var responseAddress = new AddressMainInfoDto()
                    {
                        Id = address.Address.Id,
                        City = address.Address.City,
                        Country = address.Address.Country,
                    };
                    responseHotelRoom.Address = responseAddress;
                }

                return Ok(responseHotelRoom);
            }

            return NotFound(new { message = $"Данных о номере нет" });
        }
        catch (Exception ex)
        {
            loggerHotelRoomsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpPost("create-hotel-room")]
    public async Task<IActionResult> CreateHotelRoom([FromBody] CreateHotelRoomsDto? request, int userId)
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

            if (string.IsNullOrEmpty(request.NameRoom))
            {
                return BadRequest(new { message = "Название комнаты обязательное поле" });
            }

            if (request.Floor <= 0)
            {
                return BadRequest(new { message = "Этаж обязательное поле и не может быть меньше или равен 0" });
            }

            if (string.IsNullOrEmpty(request.TypeRoom))
            {
                return BadRequest(new { message = "Тип комнаты обязательное поле" });
            }

            var newHotelRoom = new HotelRoomsModel()
            {
                NameRoom = request.NameRoom,
                ImageRoom = request.ImageRoom,
                Details = request.Details,
                Floor = request.Floor,
                TypeRoom = request.TypeRoom
            };

            await dbContext.AddAsync(newHotelRoom);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerHotelRoomsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpPut("update-hotel-room")]
    public async Task<IActionResult> UpdateHotelRoom(UpdateHotelRoomsDto? request, int userId)
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
                return Ok();
            }

            var hotelRoom = await dbContext.HotelRooms.FindAsync(request.Id);
            if (hotelRoom == null)
            {
                return NotFound(new { message = $"Данного номера нет" });
            }

            if (!string.IsNullOrEmpty(request.TypeRoom))
            {
                hotelRoom.TypeRoom = request.TypeRoom;
            }

            if (!string.IsNullOrEmpty(request.NameRoom))
            {
                hotelRoom.NameRoom = request.NameRoom;
            }

            if (!string.IsNullOrEmpty(request.ImageRoom))
            {
                hotelRoom.ImageRoom = request.ImageRoom;
            }

            if (!string.IsNullOrEmpty(request.Details))
            {
                hotelRoom.Details = request.Details;
            }

            if (request.Floor > 0)
            {
                hotelRoom.Floor = request.Floor;
            }

            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerHotelRoomsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpDelete("delete-hotel-room")]
    public async Task<IActionResult> DeleteHotelRoom(int hotelRoomId, int userId)
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

            var hotelRoom = await dbContext.HotelRooms.FindAsync(hotelRoomId);
            if (hotelRoom == null)
            {
                return NotFound(new { message = $"Такого номера отеля нет" });
            }


            dbContext.HotelRooms.Remove(hotelRoom);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerHotelRoomsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }
}