using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HotelRoomsController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<HotelRoomsModel>>> GetHotelRooms()
    {
        return await dbContext.HotelRooms.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HotelRoomsModel>> GetHotelRoom(int id)
    {
        var hotelRoom = await dbContext.HotelRooms.FindAsync(id);
        if (hotelRoom == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный сотрудник не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(hotelRoom);
    }
}