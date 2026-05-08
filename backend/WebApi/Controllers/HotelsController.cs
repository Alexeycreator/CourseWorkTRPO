using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HotelsController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<HotelsModel>>> GetHotels()
    {
        return await dbContext.Hotels.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HotelsModel>> GetHotel(int id)
    {
        var hotel = await dbContext.Hotels.FindAsync(id);
        if (hotel == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный отель не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(hotel);
    }
}