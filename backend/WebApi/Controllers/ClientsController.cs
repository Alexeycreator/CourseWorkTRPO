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

    [HttpPost("register")]
    public async Task<ActionResult<ClientResponseDto>> Register(CreateClientDto createDto)
    {
        try
        {
            // Проверка уникальности
            if (await dbContext.Clients.AnyAsync(c => c.Login == createDto.Login))
                return Conflict(new { message = "Логин уже существует" });

            if (await dbContext.Clients.AnyAsync(c => c.Email == createDto.Email))
                return Conflict(new { message = "Email уже существует" });

            if (await dbContext.Clients.AnyAsync(c => c.PhoneNumber == createDto.PhoneNumber))
                return Conflict(new { message = "Телефон уже существует" });

            // Хэшируем пароль для поля PasswordHash
            string hashedPassword = passwordService.HashPassword(createDto.Password);

            loggerClientsController.Info($"Пароль захэширован для пользователя {createDto.Login}");

            var client = new ClientsModel
            {
                SurName = createDto.SurName,
                FirstName = createDto.FirstName,
                MiddleName = createDto.MiddleName,
                PhoneNumber = createDto.PhoneNumber,
                Email = createDto.Email,
                Login = createDto.Login,
                Password = createDto.Password, // Сохраняем оригинальный пароль
                PasswordHash = hashedPassword, // Сохраняем хэш
                LoginAttempts = 0,
                IsReadOnly = false
            };

            dbContext.Clients.Add(client);
            await dbContext.SaveChangesAsync();

            // Возвращаем данные без пароля
            var response = new ClientResponseDto
            {
                Id = client.Id,
                SurName = client.SurName,
                FirstName = client.FirstName,
                MiddleName = client.MiddleName,
                PhoneNumber = client.PhoneNumber,
                Email = client.Email,
                Login = client.Login,
                Passport_Id = client.Passport_Id,
                IsReadOnly = client.IsReadOnly,
                Age = client.Age,
                Birthday = client.Birthday,
                Gender = client.Gender
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            loggerClientsController.Error(ex, "Ошибка при регистрации пользователя {Login}", createDto.Login);
            return StatusCode(500, new { message = "Внутренняя ошибка сервера" });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto loginDto)
    {
        try
        {
            // Ищем пользователя по логину
            var client = await dbContext.Clients
                .FirstOrDefaultAsync(c =>
                    c.Login == loginDto.Login ||
                    c.Email == loginDto.Login ||
                    c.PhoneNumber == loginDto.Login);

            // Проверяем существование
            if (client == null)
            {
                loggerClientsController.Warn("Попытка входа с несуществующим логином: {Login}", loginDto.Login);
                return Unauthorized(new { message = "Неверный логин или пароль" });
            }

            // Проверка блокировки
            if (client.LockoutEnd.HasValue && client.LockoutEnd > DateTime.UtcNow)
            {
                loggerClientsController.Warn("Попытка входа заблокированного пользователя: {Login}", loginDto.Login);
                return Unauthorized(new
                {
                    message = $"Аккаунт заблокирован до {client.LockoutEnd:dd.MM.yyyy HH:mm}"
                });
            }

            bool isPasswordValid = false;

            // 1. Сначала проверяем по хэшу (PasswordHash)
            if (!string.IsNullOrEmpty(client.PasswordHash))
            {
                isPasswordValid = passwordService.VerifyPassword(loginDto.Password, client.PasswordHash);

                // Если хэш устарел, но пароль верный - обновляем хэш
                if (isPasswordValid && passwordService.NeedsRehash(client.PasswordHash))
                {
                    loggerClientsController.Info("Обновление устаревшего хэша для пользователя: {Login}",
                        loginDto.Login);
                    client.PasswordHash = passwordService.HashPassword(loginDto.Password);
                }
            }

            // 2. Если нет хэша или проверка по хэшу не прошла - проверяем по оригинальному паролю
            if (!isPasswordValid && !string.IsNullOrEmpty(client.Password))
            {
                isPasswordValid = client.Password == loginDto.Password;

                // Если пароль верный - создаем хэш для будущих входов
                if (isPasswordValid)
                {
                    loggerClientsController.Info("Создание хэша для пользователя с оригинальным паролем: {Login}",
                        loginDto.Login);
                    client.PasswordHash = passwordService.HashPassword(loginDto.Password);
                }
            }

            // Обработка неудачных попыток входа
            if (!isPasswordValid)
            {
                client.LoginAttempts++;

                // Блокировка после 5 неудачных попыток
                if (client.LoginAttempts >= 5)
                {
                    client.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
                    loggerClientsController.Warn("Пользователь {Login} заблокирован на 15 минут", loginDto.Login);
                }

                await dbContext.SaveChangesAsync();

                loggerClientsController.Warn("Неверный пароль для пользователя: {Login}. Попытка {Attempts}",
                    loginDto.Login, client.LoginAttempts);

                return Unauthorized(new { message = "Неверный логин или пароль" });
            }

            // Сброс счетчика неудачных попыток при успешном входе
            client.LoginAttempts = 0;
            client.LockoutEnd = null;
            client.LastLoginAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();

            loggerClientsController.Info("Успешный вход пользователя: {Login}", loginDto.Login);

            // Генерация JWT токена
            var token = GenerateJwtToken(client);

            var response = new LoginResponseDto
            {
                Token = token,
                Expiry = DateTime.UtcNow.AddHours(1),
                User = new ClientResponseDto
                {
                    Id = client.Id,
                    SurName = client.SurName,
                    FirstName = client.FirstName,
                    MiddleName = client.MiddleName,
                    PhoneNumber = client.PhoneNumber,
                    Email = client.Email,
                    Login = client.Login,
                    Passport_Id = client.Passport_Id,
                    IsReadOnly = client.IsReadOnly,
                    Age = client.Age,
                    Birthday = client.Birthday,
                    Gender = client.Gender
                }
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            loggerClientsController.Error(ex, "Ошибка при входе пользователя {Login}", loginDto.Login);
            return StatusCode(500, new { message = "Внутренняя ошибка сервера" });
        }
    }

    private string GenerateJwtToken(ClientsModel client)
    {
        var jwtSettings = configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

        // 1. СОЗДАЕМ CLAIMS (утверждения о пользователе)
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, client.Id.ToString()), // Subject (ID)
            new Claim(JwtRegisteredClaimNames.Name, client.Login), // Имя пользователя
            new Claim(JwtRegisteredClaimNames.Email, client.Email), // Email
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Уникальный ID токена
            new Claim("fullName", $"{client.SurName} {client.FirstName}"), // Кастомный claim
            new Claim("phoneNumber", client.PhoneNumber) // Кастомный claim
        };

        // Добавляем роль если есть
        // if (client.IsAdmin) claims.Add(new Claim(ClaimTypes.Role, "Admin"));

        // 2. СОЗДАЕМ КЛЮЧ ПОДПИСИ
        var securityKey = new SymmetricSecurityKey(key);
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // 3. СОЗДАЕМ ТОКЕН
        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(int.Parse(jwtSettings["ExpiryInHours"] ?? "1")),
            signingCredentials: credentials
        );

        // 4. ВОЗВРАЩАЕМ СТРОКУ ТОКЕНА
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // [HttpPost]
    // public async Task<ActionResult<ClientsModel>> CreateClient(ClientsModel client)
    // {
    //     var errorMessage = new List<string>();
    //     if (string.IsNullOrWhiteSpace(client.SurName))
    //     {
    //         errorMessage.Add($"Фамилия обязательна для заполнения");
    //     }
    //
    //     if (string.IsNullOrWhiteSpace(client.FirstName))
    //     {
    //         errorMessage.Add($"Имя обязательно для заполнения");
    //     }
    //
    //     if (string.IsNullOrWhiteSpace(client.PhoneNumber))
    //     {
    //         errorMessage.Add($"Номер телефона обязателен для заполнения");
    //     }
    //
    //     if (string.IsNullOrWhiteSpace(client.Email))
    //     {
    //         errorMessage.Add($"Email обязателен для заполнения");
    //     }
    //
    //     if (string.IsNullOrWhiteSpace(client.Login))
    //     {
    //         errorMessage.Add($"Логин обязателен для заполнения");
    //     }
    //
    //     if (string.IsNullOrWhiteSpace(client.Password))
    //     {
    //         errorMessage.Add($"Пароль обязателен для заполнения");
    //     }
    //
    //     if (errorMessage.Any())
    //     {
    //         return BadRequest(new
    //         {
    //             StatusCode = 400,
    //             Message = "Ошибка валидации",
    //             Errors = errorMessage,
    //             Timestamp = DateTime.UtcNow,
    //         });
    //     }
    //
    //     var existsFullNameClient = await dbContext.Clients.AnyAsync(c =>
    //         c.SurName == client.SurName && c.FirstName == client.FirstName && c.MiddleName == client.MiddleName);
    //     if (existsFullNameClient)
    //     {
    //         return Conflict(new
    //         {
    //             StatusCode = 409,
    //             Message = "Такой клиент уже существует!",
    //             ExistingClient = new
    //             {
    //                 client.SurName,
    //                 client.FirstName,
    //                 client.MiddleName
    //             },
    //             Timestamp = DateTime.UtcNow
    //         });
    //     }
    //
    //     var existsPhoneNumberClient = await dbContext.Clients.AnyAsync(c => c.PhoneNumber == client.PhoneNumber);
    //     if (existsPhoneNumberClient)
    //     {
    //         return Conflict(new
    //         {
    //             StatusCode = 409,
    //             Message = "Такой номер телефона у клиента уже существует!",
    //             ExistingClient = new
    //             {
    //                 client.PhoneNumber
    //             },
    //             Timestamp = DateTime.UtcNow
    //         });
    //     }
    //
    //     var existsEmailClient = await dbContext.Clients.AnyAsync(c => c.Email == client.Email);
    //     if (existsEmailClient)
    //     {
    //         return Conflict(new
    //         {
    //             StatusCode = 409,
    //             Message = "Такой email у клиента уже существует!",
    //             ExistingClient = new
    //             {
    //                 client.Email
    //             },
    //             Timestamp = DateTime.UtcNow
    //         });
    //     }
    //
    //     var existsLoginClient = await dbContext.Clients.AnyAsync(c => c.Login == client.Login);
    //     if (existsLoginClient)
    //     {
    //         return Conflict(new
    //         {
    //             StatusCode = 409,
    //             Message = $"Такой логин уже существует",
    //             ExistingClient = new
    //             {
    //                 client.Login,
    //             },
    //             Timestamp = DateTime.UtcNow
    //         });
    //     }
    //
    //     var existsPasswordClient = await dbContext.Clients.AnyAsync(c => c.Password == client.Password);
    //     if (existsPasswordClient)
    //     {
    //         return Conflict(new
    //         {
    //             StatusCode = 409,
    //             Message = $"Такой пароль уже существует",
    //             ExistingClient = new
    //             {
    //                 client.Password,
    //             },
    //             Timestamp = DateTime.UtcNow
    //         });
    //     }
    //
    //     dbContext.Clients.Add(client);
    //     await dbContext.SaveChangesAsync();
    //
    //     return CreatedAtAction(nameof(GetClients), new { id = client.Id }, client);
    // }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClient(int id, UpdateClientDto clientDto)
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

        if (clientDto.SurName != null)
        {
            existsClient.SurName = clientDto.SurName;
        }

        if (clientDto.FirstName != null)
        {
            existsClient.FirstName = clientDto.FirstName;
        }

        if (clientDto.MiddleName != null)
        {
            existsClient.MiddleName = clientDto.MiddleName;
        }

        if (clientDto.Gender != null)
        {
            existsClient.Gender = clientDto.Gender;
        }

        if (clientDto.Birthday.HasValue)
        {
            existsClient.Birthday = clientDto.Birthday.Value;
            existsClient.Age = CalculateAge(clientDto.Birthday.Value);
        }

        if (clientDto.Age.HasValue)
        {
            existsClient.Age = clientDto.Age.Value;
        }

        if (clientDto.PhoneNumber != null)
        {
            existsClient.PhoneNumber = clientDto.PhoneNumber;
        }

        if (clientDto.Email != null)
        {
            existsClient.Email = clientDto.Email;
        }

        // Смена пароля
        if (!string.IsNullOrEmpty(clientDto.NewPassword))
        {
            // Проверяем старый пароль
            if (string.IsNullOrEmpty(clientDto.CurrentPassword) ||
                !passwordHasher.VerifyPassword(clientDto.CurrentPassword, existsClient.PasswordHash))
            {
                return BadRequest(new { Message = "Неверный текущий пароль" });
            }

            // Устанавливаем новый пароль
            existsClient.Password = clientDto.NewPassword;
            existsClient.PasswordHash = passwordHasher.HashPassword(clientDto.NewPassword);
        }

        //dbContext.Entry(clientDto).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    private int CalculateAge(DateOnly birthday)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var age = today.Year - birthday.Year;
        if (birthday > today.AddYears(-age)) age--;
        return age;
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

    private bool IsPasswordHashed(string password)
    {
        return !string.IsNullOrEmpty(password) &&
               (password.StartsWith("$2a$") ||
                password.StartsWith("$2b$") ||
                password.StartsWith("$2y$"));
    }
}