using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ClientsController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClientsModel>>> GetClients()
    {
        return await dbContext.Clients.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClientsModel>> GetClient(int id)
    {
        var clients = await dbContext.Clients.FindAsync(id);
        if (clients == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данного клиента не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(clients);
    }

    [HttpPost]
    public async Task<ActionResult<AddressesModel>> CreateClient(ClientsModel client)
    {
        var errorMessage = new List<string>();
        if (string.IsNullOrWhiteSpace(client.SurName))
        {
            errorMessage.Add($"Фамилия обязательна для заполнения");
        }

        if (string.IsNullOrWhiteSpace(client.FirstName))
        {
            errorMessage.Add($"Имя обязательно для заполнения");
        }

        if (string.IsNullOrWhiteSpace(client.PhoneNumber))
        {
            errorMessage.Add($"Номер телефона обязателен для заполнения");
        }

        if (string.IsNullOrWhiteSpace(client.Email))
        {
            errorMessage.Add($"Email обязателен для заполнения");
        }

        if (string.IsNullOrWhiteSpace(client.Login))
        {
            errorMessage.Add($"Логин обязателен для заполнения");
        }

        if (string.IsNullOrWhiteSpace(client.Password))
        {
            errorMessage.Add($"Пароль обязателен для заполнения");
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

        var existsFullNameClient = await dbContext.Clients.AnyAsync(c =>
            c.SurName == client.SurName && c.FirstName == client.FirstName && c.MiddleName == client.MiddleName);
        if (existsFullNameClient)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой клиент уже существует!",
                ExistingClient = new
                {
                    client.SurName,
                    client.FirstName,
                    client.MiddleName
                },
                Timestamp = DateTime.UtcNow
            });
        }

        var existsPhoneNumberClient = await dbContext.Clients.AnyAsync(c => c.PhoneNumber == client.PhoneNumber);
        if (existsPhoneNumberClient)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой номер телефона у клиента уже существует!",
                ExistingClient = new
                {
                    client.PhoneNumber
                },
                Timestamp = DateTime.UtcNow
            });
        }

        var existsEmailClient = await dbContext.Clients.AnyAsync(c => c.Email == client.Email);
        if (existsEmailClient)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой email у клиента уже существует!",
                ExistingClient = new
                {
                    client.Email
                },
                Timestamp = DateTime.UtcNow
            });
        }

        var existsLoginClient = await dbContext.Clients.AnyAsync(c => c.Login == client.Login);
        if (existsLoginClient)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = $"Такой логин уже существует",
                ExistingClient = new
                {
                    client.Login,
                },
                Timestamp = DateTime.UtcNow
            });
        }

        var existsPasswordClient = await dbContext.Clients.AnyAsync(c => c.Password == client.Password);
        if (existsPasswordClient)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = $"Такой пароль уже существует",
                ExistingClient = new
                {
                    client.Password,
                },
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Clients.Add(client);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetClients), new { id = client.Id }, client);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClient(int id, ClientsModel client)
    {
        var existsClient = await dbContext.Clients.FindAsync(id);
        if (existsClient == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Клиента не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        if (existsClient.IsReadOnly)
        {
            return StatusCode(403, new
            {
                StatusCode = 403,
                Error = "Forbidden",
                Message = "Этот клиент защищен от изменений",
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Entry(client).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClient(int id)
    {
        var client = await dbContext.Clients.FirstOrDefaultAsync(c => c.Id == id);
        if (client == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Такого клиента не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        dbContext.Clients.Remove(client);
        await dbContext.SaveChangesAsync();

        return Ok(new
        {
            StatusCode = 200,
            Message = "Клиент успешно удален",
            DeletedId = id,
            Timestamp = DateTime.UtcNow
        });
    }
}