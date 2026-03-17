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

    [HttpPost]
    public async Task<ActionResult<TicketsModel>> CreateTicket(TicketsModel ticket)
    {
        var errorMessage = new List<string>();
        if (string.IsNullOrWhiteSpace(ticket.Price.ToString()))
        {
            errorMessage.Add($"Цена билета обязательна для заполнения");
        }

        if (string.IsNullOrWhiteSpace(ticket.DepartureTime.ToString()))
        {
            errorMessage.Add($"Дата отправления обязательна для заполнения");
        }

        if (string.IsNullOrWhiteSpace(ticket.ArrivalTime.ToString()))
        {
            errorMessage.Add($"Дата прибытия обязательна для заполнения");
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

        var existTicket = await dbContext.Tickets.AnyAsync(t =>
            t.Price == ticket.Price && t.DepartureTime == ticket.DepartureTime && t.ArrivalTime == ticket.ArrivalTime);

        if (existTicket)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой билет уже существует!",
                ExistingClient = new
                {
                    ticket.Price,
                    ticket.DepartureTime,
                    ticket.ArrivalTime
                },
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Tickets.Add(ticket);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTickets), new { id = ticket.Id }, ticket);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTicket(int id, TicketsModel ticket)
    {
        var existsTicket = await dbContext.Tickets.FindAsync(id);
        if (existsTicket == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Билета не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        if (existsTicket.IsReadOnly)
        {
            return StatusCode(403, new
            {
                StatusCode = 403,
                Error = "Forbidden",
                Message = "Этот билет защищен от изменений",
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Entry(ticket).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTicket(int id)
    {
        var ticket = await dbContext.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Такого билета не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        dbContext.Tickets.Remove(ticket);
        await dbContext.SaveChangesAsync();

        return Ok(new
        {
            StatusCode = 200,
            Message = "Билет успешно удален",
            DeletedId = id,
            Timestamp = DateTime.UtcNow
        });
    }
}