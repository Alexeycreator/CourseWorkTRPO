using Microsoft.EntityFrameworkCore;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Methods.DataBase;

public sealed class ServerDbContext(DbContextOptions<ServerDbContext> options) : DbContext(options)
{
    public DbSet<AddressesModel> Addresses { get; set; }
    public DbSet<ClientsModel> Clients { get; set; }
    public DbSet<CurrencyRates_TicketsModel> CurrencyRatesTickets { get; set; }
    public DbSet<CurrencyRatesModel> CurrencyRates { get; set; }
    public DbSet<TicketsModel> Tickets { get; set; }
    public DbSet<EmployeesModel> Employees { get; set; }
    public DbSet<HotelsModel> Hotels { get; set; }
    public DbSet<HotelRoomsModel> HotelRoomsModels { get; set; }
    public DbSet<PassportsModel> Passports { get; set; }
    public DbSet<ToursModel> Tours { get; set; }
    public DbSet<TransfersModel> Transfers { get; set; }
}