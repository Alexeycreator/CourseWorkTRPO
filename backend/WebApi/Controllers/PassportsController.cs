using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NLog;
using WebApi.Methods.DataBase;
using WebApi.Models.DTOs.Addresses;
using WebApi.Models.DTOs.Passports;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class PassportsController(ServerDbContext dbContext) : ControllerBase
{
    private Logger loggerPassportsController = LogManager.GetCurrentClassLogger();

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PassportsModel>>> GetPassports()
    {
        return await dbContext.Passports.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PassportsModel>> GetPassport(int id)
    {
        var passport = await dbContext.Passports.FindAsync(id);
        if (passport == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный паспорт не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(passport);
    }

    [HttpGet("get-info-passport")]
    public async Task<IActionResult> GetInfoPassport(int userId)
    {
        try
        {
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"Такого пользователя нет" });
            }

            var passportInfo = await dbContext.Passports
                .FirstOrDefaultAsync(p => p.Clients.Any(c => c.Id == userId));

            if (passportInfo == null)
            {
                return NotFound(new { message = $"Паспорт для пользователя {userId} не найден" });
            }

            var address = await dbContext.Addresses
                .FirstOrDefaultAsync(a => a.PassportId == passportInfo.Id);

            ResponseInfoAddressHotelOrRoomDto respAddress = new ResponseInfoAddressHotelOrRoomDto();
            if (address != null)
            {
                respAddress = new ResponseInfoAddressHotelOrRoomDto()
                {
                    Id = address.Id,
                    Apartment = address.Apartment,
                    City = address.City,
                    Country = address.Country,
                    House = address.House,
                    Region = address.Region,
                    Street = address.Street,
                };
            }

            ResponsePassportInfoDto respPassport = new ResponsePassportInfoDto()
            {
                Id = passportInfo.Id,
                DateOfIssue = passportInfo.DateOfIssue,
                Seria = passportInfo.Seria,
                Number = passportInfo.Number,
                Type = passportInfo.Type,
                IssuedBy = passportInfo.IssuedBy,
                DepartmentCode = passportInfo.DepartmentCode,
                Address = respAddress
            };

            return Ok(respPassport);
        }
        catch (Exception ex)
        {
            loggerPassportsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpPost("create-passport-data")]
    public async Task<IActionResult> CreatePassportData(int userId, CreatePassportDto? request)
    {
        try
        {
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"Такого пользователя нет" });
            }

            if (request == null)
            {
                return BadRequest(new { message = $"Данные пустые" });
            }

            if (string.IsNullOrEmpty(request.Type))
            {
                return BadRequest(new { message = $"Тип паспорта это обязательное поле" });
            }

            if (string.IsNullOrEmpty(request.IssuedBy))
            {
                return BadRequest(new { message = $"Поле 'кем выдано' обязательно для заполнения" });
            }

            if (string.IsNullOrEmpty(request.DepartmentCode))
            {
                return BadRequest(new { message = $"Код подразделения обязательное поле" });
            }

            if (request.Seria <= 0)
            {
                return BadRequest(new { message = $"Серия не может быть меньше или равна нулю" });
            }

            if (request.Number <= 0)
            {
                return BadRequest(new { message = $"Номер не может быть меньше или равен нулю" });
            }

            var newPassport = new PassportsModel()
            {
                Seria = request.Seria,
                Number = request.Number,
                DateOfIssue = request.DateOfIssue,
                IssuedBy = request.IssuedBy,
                DepartmentCode = request.DepartmentCode,
                Type = request.Type,
            };

            await dbContext.AddAsync(newPassport);
            await dbContext.SaveChangesAsync();

            var passport = await dbContext.Passports.FindAsync(newPassport.Id);
            if (passport != null)
            {
                if (user.PassportId == null || user.PassportId != newPassport.Id)
                {
                    user.PassportId = newPassport.Id;
                }

                if (request.Address != null)
                {
                    var existAddress = await dbContext.Addresses
                        .Where(a => a.Country == request.Address.Country && a.Region == request.Address.Region &&
                                    a.City == request.Address.City && a.Street == request.Address.Street &&
                                    a.Apartment == request.Address.Apartment).FirstOrDefaultAsync();
                    if (existAddress != null)
                    {
                        existAddress.PassportId = newPassport.Id;
                    }
                    else
                    {
                        var newAddress = new AddressesModel()
                        {
                            Country = request.Address.Country,
                            Region = request.Address.Region,
                            City = request.Address.City,
                            Street = request.Address.Street,
                            House = request.Address.House,
                            Apartment = request.Address.Apartment,
                            PassportId = newPassport.Id
                        };

                        await dbContext.AddAsync(newAddress);
                    }
                }
            }
            else
            {
                return BadRequest(new { message = $"Данных о паспорте нет" });
            }

            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerPassportsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpPut("update-passport")]
    public async Task<IActionResult> UpdatePassport(int userId, UpdatePassportDto? request)
    {
        try
        {
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"Такого пользователя нет" });
            }

            if (request == null)
            {
                return BadRequest(new { message = $"Данные пустые" });
            }

            var passport = await dbContext.Passports.FindAsync(request.Id);
            if (passport == null)
            {
                return BadRequest(new { message = $"Данных о паспорте нет" });
            }

            if (!string.IsNullOrEmpty(request.Type))
            {
                passport.Type = request.Type;
            }

            if (!string.IsNullOrEmpty(request.DepartmentCode))
            {
                passport.DepartmentCode = request.DepartmentCode;
            }

            if (!string.IsNullOrEmpty(request.IssuedBy))
            {
                passport.IssuedBy = request.IssuedBy;
            }

            if (request.DateOfIssue != passport.DateOfIssue)
            {
                passport.DateOfIssue = request.DateOfIssue;
            }

            if (request.Seria != passport.Seria)
            {
                passport.Seria = request.Seria;
            }

            if (request.Number != passport.Number)
            {
                passport.Number = request.Number;
            }

            var passportDb = await dbContext.Passports.FindAsync(request.PassportId);
            if (passportDb != null)
            {
                if (user.PassportId == null || user.PassportId != request.PassportId)
                {
                    user.PassportId = request.PassportId;
                }

                if (request.Address != null)
                {
                    var existAddress = await dbContext.Addresses
                        .Where(a => a.Country == request.Address.Country && a.Region == request.Address.Region &&
                                    a.City == request.Address.City && a.Street == request.Address.Street &&
                                    a.Apartment == request.Address.Apartment).FirstOrDefaultAsync();
                    if (existAddress != null && existAddress.Country != request.Address.Country)
                    {
                        existAddress.Country = request.Address.Country;
                    }

                    if (existAddress != null && existAddress.City != request.Address.City)
                    {
                        existAddress.City = request.Address.City;
                    }

                    if (existAddress != null && existAddress.Region != request.Address.Region)
                    {
                        existAddress.Region = request.Address.Region;
                    }

                    if (existAddress != null && existAddress.Street != request.Address.Street)
                    {
                        existAddress.Street = request.Address.Street;
                    }

                    if (existAddress != null && existAddress.House != request.Address.House)
                    {
                        existAddress.House = request.Address.House;
                    }

                    if (existAddress != null && existAddress.Apartment != request.Address.Apartment)
                    {
                        existAddress.Apartment = request.Address.Apartment;
                    }

                    if (existAddress != null && existAddress.PassportId != request.Address.PassportId)
                    {
                        existAddress.PassportId = request.Address.PassportId;
                    }
                    else
                    {
                        var newAddress = new AddressesModel()
                        {
                            Country = request.Address.Country,
                            Region = request.Address.Region,
                            City = request.Address.City,
                            Street = request.Address.Street,
                            House = request.Address.House,
                            Apartment = request.Address.Apartment,
                            PassportId = request.PassportId
                        };

                        await dbContext.AddAsync(newAddress);
                    }
                }
            }
            else
            {
                return BadRequest(new { message = $"Данных о паспорте нет" });
            }

            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerPassportsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpDelete("delete-passport")]
    public async Task<IActionResult> DeletePassport(int userId, int passportId)
    {
        try
        {
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"Такого пользователя нет" });
            }

            var passport = await dbContext.Passports.FindAsync(passportId);
            if (passport == null)
            {
                return NotFound(new { message = $"Данных о паспорте нет" });
            }

            dbContext.Passports.Remove(passport);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerPassportsController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }
}