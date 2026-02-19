using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HotelsController(ServerDbContext dbContext) : ControllerBase
{
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

    [HttpPost]
    public async Task<ActionResult<HotelsModel>> CreateHotel(HotelsModel hotel)
    {
        var errorMessage = new List<string>();
        if (string.IsNullOrWhiteSpace(hotel.Name))
        {
            errorMessage.Add($"Название отеля обязательно для заполнения");
        }

        if (string.IsNullOrWhiteSpace(hotel.Stars.ToString()))
        {
            errorMessage.Add($"Количество звезд отеля обязательно для заполнения");
        }

        if (string.IsNullOrWhiteSpace(hotel.ImageHotel))
        {
            errorMessage.Add($"Фото отеля обязательно для заполнения");
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

        var existsHotel = await dbContext.Hotels.AnyAsync(h => h.Name == hotel.Name);

        if (existsHotel)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой отель уже существует!",
                ExistingClient = new
                {
                    hotel.Name
                },
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Hotels.Add(hotel);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetHotels), new { id = hotel.Id }, hotel);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHotel(int id, HotelsModel hotel)
    {
        var existsHotel = await dbContext.Hotels.FindAsync(id);
        if (existsHotel == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Отеля не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        if (existsHotel.IsReadOnly)
        {
            return StatusCode(403, new
            {
                StatusCode = 403,
                Error = "Forbidden",
                Message = "Этот отель защищен от изменений",
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Entry(hotel).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHotel(int id)
    {
        var hotel = await dbContext.Hotels.FirstOrDefaultAsync(e => e.Id == id);
        if (hotel == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Такого отеля не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        dbContext.Hotels.Remove(hotel);
        await dbContext.SaveChangesAsync();

        return Ok(new
        {
            StatusCode = 200,
            Message = "Отель успешно удален",
            DeletedId = id,
            Timestamp = DateTime.UtcNow
        });
    }
}