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
}