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
}