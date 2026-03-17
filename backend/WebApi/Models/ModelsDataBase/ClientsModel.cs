using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Models.ModelsDataBase;

[Table("Clients")]
public sealed class ClientsModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    [Required] [MaxLength(100)] public string SurName { get; set; }
    [Required] [MaxLength(100)] public string FirstName { get; set; }
    [MaxLength(100)] public string? MiddleName { get; set; }
    [Required] [MaxLength(25)] public string Gender { get; set; }
    [Required] public DateOnly Birthday { get; set; }
    [Required] public int Age { get; set; }

    [Required]
    [MaxLength(15)]
    [DataType(DataType.PhoneNumber)]
    [RegularExpression(@"^(\+7|7|8)\d{10}$", ErrorMessage = "Формат: 8XXXXXXXXXX, 7XXXXXXXXXX или +7XXXXXXXXXX")]
    public string PhoneNumber { get; set; }

    [Required]
    [MaxLength(100)]
    [DataType(DataType.EmailAddress)]
    public string Email { get; set; }

    [Required] [MaxLength(100)] public string Login { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6,
        ErrorMessage = "Пароль должен быть от 6 до 100 символов")]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [MaxLength(2000)] public string PasswordHash { get; set; }

    public bool IsReadOnly { get; set; } = false;

    [Column("Passport_Id")]
    [ForeignKey("Passport")]
    public int? Passport_Id { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    [JsonIgnore]
    public PassportsModel? Passport { get; set; }

    [JsonIgnore] public ICollection<TicketsModel>? Tickets { get; set; }

    // НОВЫЕ ПОЛЯ ДЛЯ JWT ТОКЕНОВ
    [MaxLength(500)] public string? RefreshToken { get; set; } // Для refresh token
    public DateTime? RefreshTokenExpiryTime { get; set; } // Время истечения refresh token
    public DateTime? LastLoginAt { get; set; } // Время последнего входа
    public int LoginAttempts { get; set; } = 0; // Количество попыток входа
    public DateTime? LockoutEnd { get; set; } // Блокировка до (для защиты от брутфорса)
}