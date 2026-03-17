using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class PassportsController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PassportsModel>>> GetPassports()
    {
        return await dbContext.Passports.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PassportsModel>> GetPassport(int id)
    {
        var passport = await dbContext.Passports.FindAsync(id);
        if (passport == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный паспорт не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(passport);
    }

    [HttpPost]
    public async Task<ActionResult<PassportsModel>> CreatePassport(PassportsModel passport)
    {
        var errorMessage = new List<string>();
        if (string.IsNullOrWhiteSpace(passport.Seria.ToString()))
        {
            errorMessage.Add($"Серия паспорта обязательна для заполнения");
        }

        if (string.IsNullOrWhiteSpace(passport.Number.ToString()))
        {
            errorMessage.Add($"Номер паспорта обязателен для заполнения");
        }

        if (string.IsNullOrWhiteSpace(passport.Type))
        {
            errorMessage.Add($"Тип паспорта обязателен для заполнения");
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

        var existsPassport =
            await dbContext.Passports.AnyAsync(p =>
                p.Seria == passport.Seria && p.Number == passport.Number && p.Type == passport.Type);

        if (existsPassport)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой паспорт уже существует!",
                ExistingClient = new
                {
                    passport.Seria,
                    passport.Number,
                    passport.Type
                },
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Passports.Add(passport);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPassports), new { id = passport.Id }, passport);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePassport(int id, PassportsModel passport)
    {
        var existsPassport = await dbContext.Passports.FindAsync(id);
        if (existsPassport == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Паспорт не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        if (passport.IsReadOnly)
        {
            return StatusCode(403, new
            {
                StatusCode = 403,
                Error = "Forbidden",
                Message = "Этот паспорт защищен от изменений",
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Entry(passport).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePassport(int id)
    {
        var passport = await dbContext.Passports.FirstOrDefaultAsync(p => p.Id == id);
        if (passport == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Такого паспорта не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        dbContext.Passports.Remove(passport);
        await dbContext.SaveChangesAsync();

        return Ok(new
        {
            StatusCode = 200,
            Message = "Паспорт успешно удален",
            DeletedId = id,
            Timestamp = DateTime.UtcNow
        });
    }
}