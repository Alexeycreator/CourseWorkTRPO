using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CurrencyRatesController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CurrencyRatesModel>>> GetCurrencyRates()
    {
        return await dbContext.CurrencyRates.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<CurrencyRatesModel>>> GetCurrencyRate(int id)
    {
        var transfer = await dbContext.Transfers.FindAsync(id);
        if (transfer == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данного курса валют не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(transfer);
    }
}