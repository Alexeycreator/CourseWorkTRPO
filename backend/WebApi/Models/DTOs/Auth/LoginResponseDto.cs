using WebApi.Models.DTOs.Client;

namespace WebApi.Models.DTOs.Auth;

public sealed class LoginResponseDto
{
    public string Token { get; set; }
    public DateTime Expiry { get; set; }
    public UserResponseDto User { get; set; }
}