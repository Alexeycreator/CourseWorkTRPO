using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NLog;
using WebApi.Methods.DataBase;
using WebApi.Models.DTOs.Tickets;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TicketsController(ServerDbContext dbContext) : ControllerBase
{
    private Logger loggerTicketsController = LogManager.GetCurrentClassLogger();

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

    [HttpPost("create-ticket")]
    public async Task<IActionResult> CreatePassportData(int userId, CreateTicketsDto? request)
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

            if (request.Price <= 0)
            {
                return BadRequest(new { message = $"Цена не может быть меньше или равна 0" });
            }

            var newTicket = new TicketsModel()
            {
                Price = request.Price,
                DepartureTime = request.DepartureTime,
                ArrivalTime = request.ArrivalTime,
                DateSale = request.DateSale,
            };

            await dbContext.AddAsync(newTicket);
            await dbContext.SaveChangesAsync();

            if (request.HotelRoomsId <= 0)
            {
                return BadRequest(new { message = $"Номер не передан серверу" });
            }

            var hotel = await dbContext.Hotels.FirstOrDefaultAsync(h => h.HotelRoomsId == request.HotelRoomsId);
            if (hotel == null)
            {
                return NotFound(new { message = $"Данных о номере нет" });
            }

            var tour = await dbContext.Tours.FindAsync(request.TourId);
            var ticket = await dbContext.Tickets.OrderByDescending(t => t.Id).FirstAsync();
            if (tour != null)
            {
                tour.TicketsId = ticket.Id;
                hotel.TicketsId = ticket.Id;
                user.TicketsId = ticket.Id;
            }

            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerTicketsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpPut("update-ticket")]
    public async Task<IActionResult> UpdatePassport(int userId, UpdateTicketsDto? request)
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

            var ticket = await dbContext.Tickets.FindAsync(request.Id);
            if (ticket == null)
            {
                return BadRequest(new { message = $"Данных о билете нет" });
            }

            if (request.Price != ticket.Price)
            {
                ticket.Price = request.Price;
            }

            if (request.DepartureTime != ticket.DepartureTime)
            {
                ticket.DepartureTime = request.DepartureTime;
            }

            if (request.ArrivalTime != ticket.ArrivalTime)
            {
                ticket.ArrivalTime = request.ArrivalTime;
            }

            if (request.DateSale != ticket.DateSale)
            {
                ticket.DateSale = request.DateSale;
            }

            if (request.HotelRoomsId <= 0)
            {
                return BadRequest(new { message = $"Номер не передан серверу" });
            }

            var hotel = await dbContext.Hotels.FirstOrDefaultAsync(h => h.HotelRoomsId == request.HotelRoomsId);
            if (hotel == null)
            {
                return NotFound(new { message = $"Данных о номере нет" });
            }

            hotel.TicketsId = ticket.Id;
            user.TicketsId = ticket.Id;
            var tour = await dbContext.Tours.FindAsync(request.TourId);
            if (tour != null)
            {
                tour.TicketsId = ticket.Id;
            }
            else
            {
                return BadRequest(new { message = $"Тур не найден" });
            }

            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerTicketsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpDelete("delete-ticket")]
    public async Task<IActionResult> DeletePassport(int userId, int ticketId)
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

            var ticket = await dbContext.Tickets.FindAsync(ticketId);
            if (ticket == null)
            {
                return NotFound(new { message = $"Данных о паспорте нет" });
            }

            dbContext.Tickets.Remove(ticket);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerTicketsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }
}