using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NLog;
using WebApi.Methods.DataBase;
using WebApi.Models.DTOs.Passports;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class PassportsController(ServerDbContext dbContext) : ControllerBase
{
    private Logger loggerPassportsController = LogManager.GetCurrentClassLogger();

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

    [HttpPost("create-passport-data")]
    public async Task<IActionResult> CreatePassportData(int userId, CreatePassportDto? request)
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
                return BadRequest(new { message = $"Данные пустые" });
            }

            if (string.IsNullOrEmpty(request.Type))
            {
                return BadRequest(new { message = $"Тип паспорта это обязательное поле" });
            }

            if (string.IsNullOrEmpty(request.IssuedBy))
            {
                return BadRequest(new { message = $"Поле 'кем выдано' обязательно для заполнения" });
            }

            if (string.IsNullOrEmpty(request.DepartmentCode))
            {
                return BadRequest(new { message = $"Код подразделения обязательное поле" });
            }

            if (request.Seria <= 0)
            {
                return BadRequest(new { message = $"Серия не может быть меньше или равна нулю" });
            }

            if (request.Number <= 0)
            {
                return BadRequest(new { message = $"Номер не может быть меньше или равен нулю" });
            }

            var newPassport = new PassportsModel()
            {
                Seria = request.Seria,
                Number = request.Number,
                DateOfIssue = request.DateOfIssue,
                IssuedBy = request.IssuedBy,
                DepartmentCode = request.DepartmentCode,
                Type = request.Type,
            };

            await dbContext.AddAsync(newPassport);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerPassportsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpPut("update-passport")]
    public async Task<IActionResult> UpdatePassport(int userId, UpdatePassportDto? request)
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
                return BadRequest(new { message = $"Данные пустые" });
            }

            var passport = await dbContext.Passports.FindAsync(request.Id);
            if (passport == null)
            {
                return BadRequest(new { message = $"Данных о паспорте нет" });
            }

            if (!string.IsNullOrEmpty(request.Type))
            {
                passport.Type = request.Type;
            }

            if (!string.IsNullOrEmpty(request.DepartmentCode))
            {
                passport.DepartmentCode = request.DepartmentCode;
            }

            if (!string.IsNullOrEmpty(request.IssuedBy))
            {
                passport.IssuedBy = request.IssuedBy;
            }

            if (request.DateOfIssue != passport.DateOfIssue)
            {
                passport.DateOfIssue = request.DateOfIssue;
            }

            if (request.Seria != passport.Seria)
            {
                passport.Seria = request.Seria;
            }

            if (request.Number != passport.Number)
            {
                passport.Number = request.Number;
            }

            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerPassportsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpDelete("delete-passport")]
    public async Task<IActionResult> DeletePassport(int userId, int passportId)
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

            var passport = await dbContext.Passports.FindAsync(passportId);
            if (passport == null)
            {
                return NotFound(new { message = $"Данных о паспорте нет" });
            }

            dbContext.Passports.Remove(passport);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerPassportsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }
}