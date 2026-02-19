using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Methods.DataBase;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController(ServerDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeesModel>>> GetEmployees()
    {
        return await dbContext.Employees.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeesModel>> GetEmployee(int id)
    {
        var employee = await dbContext.Employees.FindAsync(id);
        if (employee == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный сотрудник не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(employee);
    }

    [HttpPost]
    public async Task<ActionResult<EmployeesModel>> CreateEmployee(EmployeesModel employee)
    {
        var errorMessage = new List<string>();
        if (string.IsNullOrWhiteSpace(employee.SurName))
        {
            errorMessage.Add($"Фамилия обязательна для заполнения");
        }

        if (string.IsNullOrWhiteSpace(employee.FirstName))
        {
            errorMessage.Add($"Имя обязательно для заполнения");
        }

        if (string.IsNullOrWhiteSpace(employee.PhoneNumber))
        {
            errorMessage.Add($"Номер телефона обязателен для заполнения");
        }

        if (string.IsNullOrWhiteSpace(employee.Email))
        {
            errorMessage.Add($"Email обязателен для заполнения");
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

        var existsFullNameClient = await dbContext.Clients.AnyAsync(e =>
            e.SurName == employee.SurName && e.FirstName == employee.FirstName && e.MiddleName == employee.MiddleName);
        if (existsFullNameClient)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой сотрудник уже существует!",
                ExistingClient = new
                {
                    employee.SurName,
                    employee.FirstName,
                    employee.MiddleName
                },
                Timestamp = DateTime.UtcNow
            });
        }

        var existsPhoneNumberClient = await dbContext.Clients.AnyAsync(e => e.PhoneNumber == employee.PhoneNumber);
        if (existsPhoneNumberClient)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой номер телефона у сотрудника уже существует!",
                ExistingClient = new
                {
                    employee.PhoneNumber
                },
                Timestamp = DateTime.UtcNow
            });
        }

        var existsEmailClient = await dbContext.Clients.AnyAsync(e => e.Email == employee.Email);
        if (existsEmailClient)
        {
            return Conflict(new
            {
                StatusCode = 409,
                Message = "Такой email у сотрудника уже существует!",
                ExistingClient = new
                {
                    employee.Email
                },
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Employees.Add(employee);
        await dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEmployees), new { id = employee.Id }, employee);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(int id, EmployeesModel employee)
    {
        var existsEmployee = await dbContext.Employees.FindAsync(id);
        if (existsEmployee == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Сотрудника не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        if (existsEmployee.IsReadOnly)
        {
            return StatusCode(403, new
            {
                StatusCode = 403,
                Error = "Forbidden",
                Message = "Этот сотрудник защищен от изменений",
                Timestamp = DateTime.UtcNow
            });
        }

        dbContext.Entry(employee).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var employee = await dbContext.Clients.FirstOrDefaultAsync(e => e.Id == id);
        if (employee == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Error = "NotFound",
                Message = $"Такого сотрудника не существует!",
                Timestamp = DateTime.UtcNow,
            });
        }

        dbContext.Clients.Remove(employee);
        await dbContext.SaveChangesAsync();

        return Ok(new
        {
            StatusCode = 200,
            Message = "Сотрудник успешно удален",
            DeletedId = id,
            Timestamp = DateTime.UtcNow
        });
    }
}