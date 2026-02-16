using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class PassportsController(ServerDbContext dbContext)
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PassportsModel>>> GetPassports()
    {
        return await dbContext.Passports.ToListAsync();
    }
}