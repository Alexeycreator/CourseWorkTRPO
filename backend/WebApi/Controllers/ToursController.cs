using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ToursController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ToursModel>>> GetTours()
    {
        return await dbContext.Tours.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ToursModel>> GetTour(int id)
    {
        var tour = await dbContext.Tours.FindAsync(id);
        if (tour == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный тур не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(tour);
    }
}