using WebApi.Models.DTOs.Addresses;

namespace WebApi.Models.DTOs.Passports;

public sealed class ResponsePassportInfoDto
{
    public int Id { get; set; }
    public int Seria { get; set; }
    public int Number { get; set; }
    public string Type { get; set; }
    public string IssuedBy { get; set; }
    public string DepartmentCode { get; set; }
    public DateOnly DateOfIssue { get; set; }
    public ResponseInfoAddressHotelOrRoomDto Address { get; set; }
}