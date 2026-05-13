using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NLog;
using WebApi.Methods.DataBase;
using WebApi.Models.DTOs.Addresses;
using WebApi.Models.DTOs.Hotels;
using WebApi.Models.DTOs.HotTours;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ToursController(ServerDbContext dbContext) : ControllerBase
{
    private Logger loggerToursController = LogManager.GetCurrentClassLogger();

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ToursModel>>> GetTours()
    {
        return await dbContext.Tours.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ToursModel>> GetTour(int id)
    {
        var tour = await dbContext.Tours.FindAsync(id);
        if (tour == null)
        {
            return NotFound(new
            {
                StatusCode = 404,
                Message = $"Данный тур не существует",
                Timestamp = DateTime.UtcNow
            });
        }

        return Ok(tour);
    }

    [HttpGet("get-main-tours")]
    public async Task<IActionResult> GetMainTours()
    {
        try
        {
            loggerToursController.Info($"Задействован метод получения каталога туров...");
            return await FillingMainTours();
        }
        catch (Exception ex)
        {
            loggerToursController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpGet("get-current-main-tour")]
    public async Task<IActionResult> GetCurrentMainTour(int tourId)
    {
        try
        {
            loggerToursController.Info($"Задействован метод получения данных конкретного тура...");
            return await FillingCurrentMainTour(tourId);
        }
        catch (Exception ex)
        {
            loggerToursController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpGet("get-hot-tours")]
    public async Task<IActionResult> GetHotTours()
    {
        try
        {
            loggerToursController.Info($"Задействован метод получения данных горячего тура...");
            return await FillingHotTours();
        }
        catch (Exception ex)
        {
            loggerToursController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpGet("get-current-hot-tour")]
    public async Task<IActionResult> GetCurrentHotTour(int hotTourId)
    {
        try
        {
            loggerToursController.Info($"Задействован метод получения данных конркретного горящего тура...");
            return await FillingCurrentHotTour(hotTourId);
        }
        catch (Exception ex)
        {
            loggerToursController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    private async Task<IActionResult> FillingMainTours()
    {
        var tours = await dbContext.Tours.ToListAsync();
        List<ToursDto> toursDto = new List<ToursDto>();
        loggerToursController.Info($"Обработка туров...");

        foreach (var tour in tours)
        {
            loggerToursController.Info($"Обработка тура (id = {tour.Id})");
            var idDto = tour.Id;
            var imageTourDto = tour.ImageTour;
            var nameTourDto = tour.Name;
            var detailsDto = tour.Details;
            var startDotDto = tour.StartDot;
            var endDotDto = tour.EndDot;
            var typeDto = tour.Type;
            var priceDto = tour.Price;
            var countNightDto = CalculateCountNight(Convert.ToDateTime(endDotDto), Convert.ToDateTime(startDotDto));

            toursDto.Add(new ToursDto()
            {
                Id = idDto,
                ImageTour = imageTourDto,
                NameTour = nameTourDto,
                Details = detailsDto,
                StartDot = startDotDto,
                EndDot = endDotDto,
                Type = typeDto,
                Price = priceDto,
                CountNights = countNightDto
            });
            loggerToursController.Info($"Тур (id = {tour.Id}) успешно обработан");
        }

        if (toursDto.Count <= 0)
        {
            loggerToursController.Error($"Не получилось обработать туры");
            return BadRequest(new { message = $"Не получилось обработать туры" });
        }

        loggerToursController.Info($"Все туры успешно обработаны. Отправка клиенту...");
        return Ok(toursDto);
    }

    private async Task<IActionResult> FillingCurrentMainTour(int tourId)
    {
        var tour = await dbContext.Tours.FindAsync(tourId);
        if (tour == null)
        {
            loggerToursController.Error($"Данных об этом туре (id = {tourId}) нет");
            return NotFound(new { message = $"Данных об этом туре нет" });
        }

        var tourHotelsAddresses = await dbContext.ToursHotelsAddresses
            .Where(tha => tha.ToursId == tourId)
            .Include(tha => tha.Hotel)
            .Include(tha => tha.Address)
            .ToListAsync();

        if (!tourHotelsAddresses.Any())
        {
            loggerToursController.Error($"Данные для формирования отелей отсутствуют");
            return BadRequest(new { message = $"Данные для формирования отелей отсутствуют" });
        }

        var countNight = CalculateCountNight(Convert.ToDateTime(tour.EndDot), Convert.ToDateTime(tour.StartDot));

        var hotelsList = tourHotelsAddresses
            .Where(tha => tha.Hotel != null && tha.Address != null)
            .Select(tha => new HotelMainInfoDto()
            {
                Id = tha.Hotel.Id,
                Name = tha.Hotel.Name,
                Stars = tha.Hotel.Stars,
                Description = tha.Hotel.Details,
                ImageHotel = tha.Hotel.ImageHotel,
                CountNight = countNight
            })
            .ToList();

        var addressesList = tourHotelsAddresses
            .Where(tha => tha.Address != null)
            .Select(tha => new AddressMainInfoDto()
            {
                Id = tha.Address.Id,
                City = tha.Address.City,
                Country = tha.Address.Country,
            })
            .ToList();

        if (!hotelsList.Any())
        {
            loggerToursController.Error($"Не удалось загрузить ни одного отеля для тура {tourId}");
            return BadRequest(new { message = $"Не удалось загрузить информацию об отелях" });
        }

        var currentTourDto = new CurrentTourDto()
        {
            Id = tour.Id,
            ImageTour = tour.ImageTour,
            NameTour = tour.Name,
            Details = tour.Details,
            StartDot = tour.StartDot,
            EndDot = tour.EndDot,
            Type = tour.Type,
            Price = tour.Price,
            CountNights = countNight,
            Description = ParsingStringData(tour.Description),
            Separately = ParsingStringData(tour.Separately),
            Included = ParsingStringData(tour.Included),
            Program = ParsingStringData(tour.Program),
            Hotels = hotelsList,
            Addresses = addressesList
        };

        return Ok(currentTourDto);
    }

    private async Task<IActionResult> FillingHotTours()
    {
        var tours = await dbContext.Tours.ToListAsync();
        List<HotToursDto> hotToursDto = new List<HotToursDto>();
        loggerToursController.Info($"Обработка туров...");

        foreach (var hotTour in tours)
        {
            loggerToursController.Info($"Обработка тура (id = {hotTour.Id})");
            var idDto = hotTour.Id;
            var imageTourDto = hotTour.ImageTour;
            var nameTourDto = hotTour.Name;
            var detailsDto = hotTour.Details;
            var startDotDto = hotTour.StartDot;
            var endDotDto = hotTour.EndDot;
            var typeDto = hotTour.Type;
            var priceDto = hotTour.Price;
            var countNightDto = CalculateCountNight(Convert.ToDateTime(endDotDto), Convert.ToDateTime(startDotDto));
            var isHotTour = hotTour.HotTour;

            if (isHotTour)
            {
                hotToursDto.Add(new HotToursDto()
                {
                    Id = idDto,
                    ImageTour = imageTourDto,
                    NameTour = nameTourDto,
                    Details = detailsDto,
                    StartDot = startDotDto,
                    EndDot = endDotDto,
                    Type = typeDto,
                    OldPrice = priceDto,
                    NowPrice = CalculateDiscountPrice(priceDto),
                    CountNights = countNightDto
                });
                loggerToursController.Info($"Тур (id = {hotTour.Id}) успешно обработан");
            }
            else
            {
                loggerToursController.Error($"Тур (id = {hotTour.Id}) не является 'горящим'");
                return BadRequest(new { message = $"Тур не является 'горящим'" });
            }
        }

        if (hotToursDto.Count <= 0)
        {
            loggerToursController.Error($"'Горящих туров нет'");
            return NotFound(new { message = $"'Горящих туров нет'" });
        }

        loggerToursController.Info($"Все туры успешно обработаны. Отправка клиенту...");
        return Ok(hotToursDto);
    }

    private async Task<IActionResult> FillingCurrentHotTour(int hotTourId)
    {
        var hotTour = await dbContext.Tours.FindAsync(hotTourId);
        if (hotTour == null)
        {
            loggerToursController.Error($"Данных об этом туре (id = {hotTourId}) нет");
            return NotFound(new { message = $"Данных об этом туре нет" });
        }

        if (!hotTour.HotTour)
        {
            loggerToursController.Error($"Тур (id = {hotTourId}) не является 'горящим'");
            return BadRequest(new { message = $"Тур не является 'горящим'" });
        }

        var tourHotelsAddresses = await dbContext.ToursHotelsAddresses
            .Where(tha => tha.ToursId == hotTourId)
            .Include(tha => tha.Hotel)
            .Include(tha => tha.Address)
            .ToListAsync();

        if (!tourHotelsAddresses.Any())
        {
            loggerToursController.Error($"Данные для формирования отелей отсутствуют");
            return BadRequest(new { message = $"Данные для формирования отелей отсутствуют" });
        }

        var countNight = CalculateCountNight(Convert.ToDateTime(hotTour.EndDot), Convert.ToDateTime(hotTour.StartDot));
        var hotelsList = tourHotelsAddresses
            .Where(tha => tha.Hotel != null && tha.Address != null)
            .Select(tha => new HotelMainInfoDto()
            {
                Id = tha.Hotel.Id,
                Stars = tha.Hotel.Stars,
                Name = tha.Hotel.Name,
                Description = tha.Hotel.Details,
                ImageHotel = tha.Hotel.ImageHotel,
                CountNight = countNight
            })
            .ToList();

        var addressesList = tourHotelsAddresses
            .Where(tha => tha.Address != null)
            .Select(tha => new AddressMainInfoDto()
            {
                Id = tha.Address.Id,
                City = tha.Address.City,
                Country = tha.Address.Country,
            })
            .ToList();

        if (!hotelsList.Any())
        {
            loggerToursController.Error($"Не удалось загрузить ни одного отеля для горящего тура {hotTourId}");
            return BadRequest(new { message = $"Не удалось загрузить информацию об отелях" });
        }

        var currentHotTourDto = new CurrentHotTourDto()
        {
            Id = hotTour.Id,
            ImageTour = hotTour.ImageTour,
            NameTour = hotTour.Name,
            Details = hotTour.Details,
            StartDot = hotTour.StartDot,
            EndDot = hotTour.EndDot,
            Type = hotTour.Type,
            CountNights = countNight,
            Description = ParsingStringData(hotTour.Description),
            Separately = ParsingStringData(hotTour.Separately),
            Included = ParsingStringData(hotTour.Included),
            Program = ParsingStringData(hotTour.Program),
            Hotels = hotelsList,
            Addresses = addressesList, // Все адреса отелей в туре
            OldPrice = hotTour.Price,
            NowPrice = CalculateDiscountPrice(hotTour.Price)
        };

        return Ok(currentHotTourDto);
    }

    [HttpPost("create-tour")]
    public async Task<IActionResult> CreateTour(int userId, [FromBody] CreateTourDto? request)
    {
        try
        {
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"Такого пользователя нет" });
            }

            if (user.Role != "admin")
            {
                if (user.Role != "employee")
                {
                    return BadRequest(new { message = $"У пользователя недостаточно прав" });
                }
            }

            if (request == null)
            {
                return BadRequest(new { message = $"Данные пустые" });
            }

            if (string.IsNullOrEmpty(request.NameTour))
            {
                return BadRequest(new { message = $"Название тура обязательное поле" });
            }

            if (string.IsNullOrEmpty(request.TypeTour))
            {
                return BadRequest(new { message = $"Тип тура обязательное поле" });
            }

            if (request.Price <= 0)
            {
                return BadRequest(new { message = $"Цена тура обязательное поле и не может быть меньше или равна 0" });
            }

            if (string.IsNullOrEmpty(request.Details))
            {
                return BadRequest(new { message = $"Детали тура обязательное поле" });
            }

            if (string.IsNullOrEmpty(request.Description))
            {
                return BadRequest(new { message = $"Краткое описание обязательное поле" });
            }

            if (string.IsNullOrEmpty(request.Included))
            {
                return BadRequest(new { message = $"Что включено в тур обязательное поле" });
            }

            if (string.IsNullOrEmpty(request.Program))
            {
                return BadRequest(new { message = $"Программа тура обязательное поле" });
            }

            if (string.IsNullOrEmpty(request.Separately))
            {
                return BadRequest(new { message = $"Что оплачивается отдельно обязательное поле" });
            }

            var newTour = new ToursModel()
            {
                Name = request.NameTour,
                Description = request.Description,
                Details = request.Details,
                Price = request.Price,
                Program = request.Program,
                Included = request.Included,
                Separately = request.Separately,
                ImageTour = request.ImageTour,
                StartDot = request.StartDot.ToString(),
                EndDot = request.EndDot.ToString(),
                HotTour = request.HotTour,
            };

            await dbContext.AddAsync(newTour);
            await dbContext.SaveChangesAsync();

            var hotel = await dbContext.Hotels.FindAsync(request.HotelsId);
            if (hotel != null)
            {
                var newTourHotelAddress = new Tours_Hotels_AddressesModel()
                {
                    ToursId = newTour.Id,
                    HotelsId = hotel.Id,
                    AddressesId = hotel.AddressId,
                };

                await dbContext.AddAsync(newTourHotelAddress);
                await dbContext.SaveChangesAsync();
            }
            else
            {
                return NotFound(new { message = $"Информация об отеле не найдена" });
            }

            return Ok();
        }
        catch (Exception ex)
        {
            loggerToursController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpPut("update-tour")]
    public async Task<IActionResult> UpdateTour(int userId, [FromBody] UpdateTourDto? request)
    {
        try
        {
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"Такого пользователя нет" });
            }

            if (user.Role != "admin")
            {
                if (user.Role != "employee")
                {
                    return BadRequest(new { message = $"У пользователя недостаточно прав" });
                }
            }

            if (request == null)
            {
                return BadRequest(new { message = $"Данные пустые" });
            }

            var tour = await dbContext.Tours.FindAsync(request.Id);
            if (tour == null)
            {
                return NotFound(new { message = $"Данного тура не существует" });
            }

            if (!string.IsNullOrEmpty(request.ImageTour))
            {
                tour.ImageTour = request.ImageTour;
            }

            if (!string.IsNullOrEmpty(request.Description))
            {
                tour.Description = request.Description;
            }

            if (!string.IsNullOrEmpty(request.Details))
            {
                tour.Details = request.Details;
            }

            if (!string.IsNullOrEmpty(request.Program))
            {
                tour.Program = request.Program;
            }

            if (!string.IsNullOrEmpty(request.Included))
            {
                tour.Included = request.Included;
            }

            if (!string.IsNullOrEmpty(request.Separately))
            {
                tour.Separately = request.Separately;
            }

            if (!string.IsNullOrEmpty(request.Details))
            {
                tour.Details = request.Details;
            }

            if (!string.IsNullOrEmpty(request.NameTour))
            {
                tour.Name = request.NameTour;
            }

            if (request.Price <= 0)
            {
                return BadRequest(new { message = $"Цена не может быть меньше или равна 0" });
            }

            tour.Price = request.Price;

            if (request.HotTour != tour.HotTour)
            {
                tour.HotTour = request.HotTour;
            }

            if (request.StartDot.ToString() != tour.StartDot)
            {
                tour.StartDot = request.StartDot.ToString();
            }

            if (request.EndDot.ToString() != tour.EndDot)
            {
                tour.EndDot = request.EndDot.ToString();
            }

            var tourHotelAddress = await dbContext.ToursHotelsAddresses.ToListAsync();
            if (tourHotelAddress.Count > 0)
            {
                var hotel = await dbContext.Hotels.FindAsync(request.HotelsId);
                if (hotel != null)
                {
                    foreach (var tha in tourHotelAddress.Where(
                                 tha => tha.ToursId == tour.Id && tha.HotelsId != request.HotelsId))
                    {
                        tha.HotelsId = hotel.Id;
                        tha.AddressesId = hotel.AddressId;
                    }
                }
            }

            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerToursController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    [HttpDelete("delete-tour")]
    public async Task<IActionResult> DeleteTour(int tourId, int hotelId, int userId)
    {
        try
        {
            var user = await dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"Такого пользователя нет" });
            }

            if (user.Role != "admin")
            {
                if (user.Role != "employee")
                {
                    return BadRequest(new { message = $"У пользователя недостаточно прав" });
                }
            }

            var tour = await dbContext.Tours.FindAsync(tourId);
            if (tour == null)
            {
                return NotFound(new { message = $"Такого тура нет" });
            }

            var tourHotelAddress =
                await dbContext.ToursHotelsAddresses.FirstOrDefaultAsync(tha =>
                    tha.ToursId == tourId && tha.HotelsId == hotelId);

            dbContext.Tours.Remove(tour);
            if (tourHotelAddress != null)
            {
                dbContext.ToursHotelsAddresses.Remove(tourHotelAddress);
            }

            await dbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            loggerToursController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    private int CalculateCountNight(DateTime end, DateTime start)
    {
        return end.Day - start.Day;
    }

    private double CalculateDiscountPrice(double price)
    {
        return price - price * 0.20;
    }

    private string ParsingStringData(string text)
    {
        if (string.IsNullOrEmpty(text))
        {
            throw new ArgumentNullException(nameof(text), "Текст не может быть null или пустым");
        }

        const char separator = ';';
        if (!text.Contains(separator))
        {
            return text;
        }

        StringBuilder parsingBuilder = new StringBuilder();
        string[] parts = text.Split(separator);

        for (int i = 0; i < parts.Length; i++)
        {
            string trimmedPart = parts[i].Trim();
            if (!string.IsNullOrEmpty(trimmedPart))
            {
                parsingBuilder.Append(trimmedPart);

                if (i < parts.Length - 1)
                {
                    parsingBuilder.AppendLine();
                }
            }
        }

        return parsingBuilder.ToString();
    }
}