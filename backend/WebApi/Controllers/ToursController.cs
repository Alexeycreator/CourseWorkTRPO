using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ToursController
{
    private readonly ServerDbContext dbContext;

    public ToursController(ServerDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ToursModel>>> GetTours()
    {
        return await dbContext.Tours.ToListAsync();
    }
}