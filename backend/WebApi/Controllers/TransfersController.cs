using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TransfersController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransfersModel>>> GetTransfers()
    {
        return await dbContext.Transfers.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TransfersModel>> GetTransfer(int id)
    {
        var transfer = await dbContext.Transfers.FindAsync(id);
        if (transfer == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный маршрут не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(transfer);
    }

    [HttpPost]
    public async Task<ActionResult<TransfersModel>> CreateTransfer(TransfersModel transfer)
    {
        var errorMessage = new List<string>();
        if (string.IsNullOrWhiteSpace(transfer.Name))
        {
            errorMessage.Add($"Название маршрута обязательно для заполнения");
        }

        if (string.IsNullOrWhiteSpace(transfer.Route))
        {
            errorMessage.Add($"Путь маршрута обязателен для заполнения");
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

        var existsTransfer =
            await dbContext.Transfers.AnyAsync(tr => tr.Name == transfer.Name && tr.Route == transfer.Route);

        if (existsTransfer)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой сотрудник уже существует!",
                ExistingClient = new
                {
                    transfer.Name,
                    transfer.Route
                },
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Transfers.Add(transfer);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTransfers), new { id = transfer.Id }, transfer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransfer(int id, TransfersModel transfer)
    {
        var existsTransfer = await dbContext.Transfers.FindAsync(id);
        if (existsTransfer == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Маршрута не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        if (existsTransfer.IsReadOnly)
        {
            return StatusCode(403, new
            {
                StatusCode = 403,
                Error = "Forbidden",
                Message = "Этот маршрут защищен от изменений",
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Entry(transfer).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransfer(int id)
    {
        var transfer = await dbContext.Transfers.FirstOrDefaultAsync(tr => tr.Id == id);
        if (transfer == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Такого маршрута не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        dbContext.Transfers.Remove(transfer);
        await dbContext.SaveChangesAsync();

        return Ok(new
        {
            StatusCode = 200,
            Message = "Маршрут успешно удален",
            DeletedId = id,
            Timestamp = DateTime.UtcNow
        });
    }
}