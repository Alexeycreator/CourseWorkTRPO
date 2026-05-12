using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TicketsController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TicketsModel>>> GetTickets()
    {
        return await dbContext.Tickets.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TicketsModel>> GetTicket(int id)
    {
        var ticket = await dbContext.Tickets.FindAsync(id);
        if (ticket == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный билет не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(ticket);
    }
}