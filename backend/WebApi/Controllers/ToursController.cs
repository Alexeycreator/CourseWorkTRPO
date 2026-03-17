using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ToursController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ToursModel>>> GetTours()
    {
        return await dbContext.Tours.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ToursModel>> GetTour(int id)
    {
        var tour = await dbContext.Tours.FindAsync(id);
        if (tour == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный тур не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(tour);
    }

    [HttpPost]
    public async Task<ActionResult<ToursModel>> CreateTour(ToursModel tour)
    {
        var errorMessage = new List<string>();
        if (string.IsNullOrWhiteSpace(tour.Name))
        {
            errorMessage.Add($"Название тура обязательно для заполнения");
        }

        if (string.IsNullOrWhiteSpace(tour.StartDot))
        {
            errorMessage.Add($"Точка отправления обязательна для заполнения");
        }

        if (string.IsNullOrWhiteSpace(tour.EndDot))
        {
            errorMessage.Add($"Точка прибытия тура обязательна для заполнения");
        }

        if (string.IsNullOrWhiteSpace(tour.Details))
        {
            errorMessage.Add($"Описание тура обязательно для заполнения");
        }

        if (string.IsNullOrWhiteSpace(tour.ImageTour))
        {
            errorMessage.Add($"Фото тура обязательно для заполнения");
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

        var existsTour = await dbContext.Tours.AnyAsync(t =>
            t.Name == tour.Name && t.StartDot == tour.StartDot && t.EndDot == tour.EndDot);

        if (existsTour)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой сотрудник уже существует!",
                ExistingClient = new
                {
                    tour.Name,
                    tour.StartDot,
                    tour.EndDot
                },
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Tours.Add(tour);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTours), new { id = tour.Id }, tour);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTour(int id, ToursModel tour)
    {
        var existsTour = await dbContext.Tours.FindAsync(id);
        if (existsTour == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Тур не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        if (existsTour.IsReadOnly)
        {
            return StatusCode(403, new
            {
                StatusCode = 403,
                Error = "Forbidden",
                Message = "Этот тур защищен от изменений",
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Entry(tour).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTour(int id)
    {
        var tour = await dbContext.Tours.FirstOrDefaultAsync(t => t.Id == id);
        if (tour == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Такого тура не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        dbContext.Tours.Remove(tour);
        await dbContext.SaveChangesAsync();

        return Ok(new
        {
            StatusCode = 200,
            Message = "Тур успешно удален",
            DeletedId = id,
            Timestamp = DateTime.UtcNow
        });
    }
}