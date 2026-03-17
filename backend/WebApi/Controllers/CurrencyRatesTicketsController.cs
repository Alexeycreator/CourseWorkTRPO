using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CurrencyRatesTicketsController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CurrencyRates_TicketsModel>>> GetCurrencyRatesTickets()
    {
        return await dbContext.CurrencyRatesTickets.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<CurrencyRates_TicketsModel>>> GetCurrencyRatesTicket(int id)
    {
        var transfer = await dbContext.Transfers.FindAsync(id);
        if (transfer == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данная связь между валютами и билетами не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(transfer);
    }
}