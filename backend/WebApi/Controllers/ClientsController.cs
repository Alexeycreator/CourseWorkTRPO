using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NLog;
using WebApi.Methods.DataBase;
using WebApi.Models.DTOs.Auth;
using WebApi.Models.DTOs.Client;
using WebApi.Models.ModelsDataBase;
using WebApi.Services.Interfaces;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ClientsController(
    ServerDbContext dbContext,
    IPasswordService passwordService,
    IConfiguration configuration,
    IPasswordHasher passwordHasher
) : ControllerBase
{
    private Logger loggerClientsController = LogManager.GetCurrentClassLogger();

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsersModel>>> GetClients()
    {
        return await dbContext.Clients.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UsersModel>> GetClient(int id)
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
}