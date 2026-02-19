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

    [HttpPost]
    public async Task<ActionResult<AddressesModel>> CreateAddress(AddressesModel address)
    {
        var errorMessage = new List<string>();
        if (string.IsNullOrWhiteSpace(address.Country))
        {
            errorMessage.Add($"Страна обязательна для заполнения.");
        }

        if (string.IsNullOrWhiteSpace(address.City))
        {
            errorMessage.Add($"Город обязателен для заполнения");
        }

        if (string.IsNullOrWhiteSpace(address.Street))
        {
            errorMessage.Add($"Улица обязательная для заполнения");
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

        var exists = await dbContext.Addresses.AnyAsync(a =>
            a.Country == address.Country && a.City == address.City && a.Street == address.Street &&
            a.House == address.House && a.Apartment == address.Apartment);
        if (exists)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой адрес уже существует!",
                ExistingAddress = new
                {
                    address.Country,
                    address.City,
                    address.Street,
                },
                Timestamp = DateTime.UtcNow
            });
        }
        
        dbContext.Addresses.Add(address);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAddresses), new { id = address.Id }, address);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAddress(int id, AddressesModel address)
    {
        var existingAddress = await dbContext.Addresses.FindAsync(id);
        if (existingAddress == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Адрес не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        if (existingAddress.IsReadOnly)
        {
            return StatusCode(403, new
            {
                StatusCode = 403,
                Error = "Forbidden",
                Message = "Этот адрес защищен от изменений",
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Entry(address).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAddress(int id)
    {
        var address = await dbContext.Addresses.FirstOrDefaultAsync(a => a.Id == id);
        if (address == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Такого адреса не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        dbContext.Addresses.Remove(address);
        await dbContext.SaveChangesAsync();

        return Ok(new
        {
            StatusCode = 200,
            Message = "Адрес успешно удален",
            DeletedId = id,
            Timestamp = DateTime.UtcNow
        });
    }
}