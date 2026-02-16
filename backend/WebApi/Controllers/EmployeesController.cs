using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController(ServerDbContext dbContext)
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeesModel>>> GetEmployees()
    {
        return await dbContext.Employees.ToListAsync();
    }
}