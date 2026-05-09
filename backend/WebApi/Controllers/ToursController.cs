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
            return await FillingHotTours();
        }
        catch (Exception ex)
        {
            loggerToursController.Error($"Внутренняя ошибка сервера: {ex.Message}");
            return StatusCode(500, new { message = $"Внутренняя ошибка сервера: {ex.Message}" });
        }
    }

    private async Task<IActionResult> FillingMainTours()
    {
        var tours = await GetToursDataBase();
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
        var tour = GetTourDataBase(tourId).Result;
        if (tour == null)
        {
            loggerToursController.Error($"Данных об этом туре (id = {tourId}) нет");
            return NotFound(new { message = $"Данных об этом туре нет" });
        }

        var tourHotelsAddresses = await dbContext.ToursHotels.FindAsync(tourId);
        if (tourHotelsAddresses != null)
        {
            var hotel = GetHotelDataBase(tourHotelsAddresses.HotelsId).Result;
            var address = GetAddressDataBase(tourHotelsAddresses.AddressesId).Result;
            if (hotel != null && address != null)
            {
                loggerToursController.Info($"Формирование данных об отеле...");
                var hotelDto = new HotelMainInfoDto()
                {
                    Id = hotel.Id,
                    Stars = hotel.Stars,
                    Description = hotel.Details,
                    ImageHotel = hotel.ImageHotel,
                    CountNight = CalculateCountNight(Convert.ToDateTime(tour.EndDot), Convert.ToDateTime(tour.StartDot))
                };

                var addressDto = new AddressMainInfoDto()
                {
                    Id = address.Id,
                    City = address.City,
                    Country = address.Country,
                };

                loggerToursController.Info($"Заполнение данных о туре для отправки клиенту...");
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
                    CountNights =
                        CalculateCountNight(Convert.ToDateTime(tour.EndDot), Convert.ToDateTime(tour.StartDot)),
                    Description = ParsingStringData(tour.Description),
                    Separately = ParsingStringData(tour.Separately),
                    Included = ParsingStringData(tour.Included),
                    Program = ParsingStringData(tour.Program),
                    Hotel = hotelDto,
                    Address = addressDto,
                };
                loggerToursController.Info($"Данные о туре успешно заполнены. Отправка клиенту...");

                return Ok(currentTourDto);
            }

            loggerToursController.Error($"Не получилось извлечь данные");
            return BadRequest(new { message = $"Не получилось извлечь данные" });
        }
        else
        {
            loggerToursController.Error($"Данные для формирования отеля отсутствуют");
            return BadRequest(new { message = $"Данные для формирования отеля отсутствуют" });
        }
    }

    private int CalculateCountNight(DateTime end, DateTime start)
    {
        return end.Day - start.Day;
    }

    private async Task<List<ToursModel>> GetToursDataBase()
    {
        var tours = await dbContext.Tours.ToListAsync();
        if (tours.Count <= 0)
        {
            loggerToursController.Error($"Данных о турах нет");
        }

        return tours;
    }

    private async Task<ToursModel?> GetTourDataBase(int tourId)
    {
        var tours = await dbContext.Tours.FindAsync(tourId);
        if (tours == null)
        {
            loggerToursController.Error($"Данных о турах нет");
        }

        return tours;
    }

    private async Task<HotelsModel?> GetHotelDataBase(int? hotelId)
    {
        var hotel = await dbContext.Hotels.FindAsync(hotelId);
        if (hotel == null)
        {
            loggerToursController.Error($"Данные об отеле отсутсвуют");
        }

        return hotel;
    }

    private async Task<AddressesModel?> GetAddressDataBase(int? addressId)
    {
        var address = await dbContext.Addresses.FindAsync(addressId);
        if (addressId == null)
        {
            loggerToursController.Error($"Данные об адресе отсутсвуют");
        }

        return address;
    }

    private async Task<IActionResult> FillingHotTours()
    {
        loggerToursController.Info($"Все туры успешно обработаны. Отправка клиенту...");
        return Ok();
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