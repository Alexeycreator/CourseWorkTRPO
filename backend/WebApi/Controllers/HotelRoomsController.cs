using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HotelRoomsController(ServerDbContext dbContext) : ControllerBase
{
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
                Message = $"Данный сотрудник не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(hotelRoom);
    }

    [HttpPost]
    public async Task<ActionResult<HotelRoomsModel>> CreateHotelRoom(HotelRoomsModel hotelRoom)
    {
        var errorMessage = new List<string>();
        if (string.IsNullOrWhiteSpace(hotelRoom.NameRoom))
        {
            errorMessage.Add($"Название комнаты обязательно для заполнения");
        }

        if (string.IsNullOrWhiteSpace(hotelRoom.Floor.ToString()))
        {
            errorMessage.Add($"Этаж обязателен для заполнения");
        }

        if (errorMessage.Any())
        {
            return BadRequest(new
            {
                StatusCode = 400,
                Message = "Ошибка валидации",
                Errors = errorMessage,
                Timestamp = DateTime.UtcNow,
            });
        }

        var existsNameRoom = await dbContext.HotelRooms.AnyAsync(hr => hr.NameRoom == hotelRoom.NameRoom);
        if (existsNameRoom)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой номер уже существует!",
                ExistingClient = new
                {
                    hotelRoom.NameRoom
                },
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.HotelRooms.Add(hotelRoom);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetHotelRooms), new { id = hotelRoom.Id }, hotelRoom);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHotelRoom(int id, HotelRoomsModel hotelRoom)
    {
        var existsHotelRoom = await dbContext.HotelRooms.FindAsync(id);
        if (existsHotelRoom == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Номера не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        if (existsHotelRoom.IsReadOnly)
        {
            return StatusCode(403, new
            {
                StatusCode = 403,
                Error = "Forbidden",
                Message = "Этот номер защищен от изменений",
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Entry(hotelRoom).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHotelRoom(int id)
    {
        var hotelRoom = await dbContext.HotelRooms.FirstOrDefaultAsync(hr => hr.Id == id);
        if (hotelRoom == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Номер не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        dbContext.HotelRooms.Remove(hotelRoom);
        await dbContext.SaveChangesAsync();

        return Ok(new
        {
            StatusCode = 200,
            Message = "Номер успешно удален",
            DeletedId = id,
            Timestamp = DateTime.UtcNow
        });
    }
}