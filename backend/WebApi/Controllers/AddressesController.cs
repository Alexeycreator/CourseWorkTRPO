using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AddressesController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AddressesModel>>> GetAddresses()
    {
        return await dbContext.Addresses.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AddressesModel>> GetAddress(int id)
    {
        var address = await dbContext.Addresses.FindAsync(id);
        if (address == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный адрес не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(address);
    }
}