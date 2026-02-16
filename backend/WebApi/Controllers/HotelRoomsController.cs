using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HotelRoomsController(ServerDbContext dbContext)
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<HotelRoomsModel>>> GetHotelRooms()
    {
        return await dbContext.HotelRooms.ToListAsync();
    }
}