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
    public DbSet<HotelRoomsModel> HotelRooms { get; set; }
    public DbSet<PassportsModel> Passports { get; set; }
    public DbSet<ToursModel> Tours { get; set; }
    public DbSet<TransfersModel> Transfers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<ClientsModel>().HasIndex(c => new { c.SurName, c.FirstName, c.MiddleName })
            .HasDatabaseName("IX_Clients_FullName");
        builder.Entity<ClientsModel>().HasIndex(c => c.PhoneNumber)
            .IsUnique()
            .HasDatabaseName("IX_Clients_PhoneNumber");
        builder.Entity<ClientsModel>().HasIndex(c => c.Email)
            .IsUnique()
            .HasDatabaseName("IX_Clients_Email");
        builder.Entity<ClientsModel>().HasIndex(c => c.Login)
            .IsUnique()
            .HasDatabaseName("IX_Clients_Login");
        builder.Entity<ClientsModel>().HasIndex(c => c.Password)
            .HasDatabaseName("IX_Clients_Password");
        builder.Entity<ClientsModel>().HasIndex(c => c.Passport_Id)
            .HasDatabaseName("IX_Clients_PassportId");

        builder.Entity<EmployeesModel>().HasIndex(c => new { c.SurName, c.FirstName, c.MiddleName })
            .HasDatabaseName("IX_Employees_FullName");
        builder.Entity<EmployeesModel>().HasIndex(em => em.PhoneNumber)
            .IsUnique()
            .HasDatabaseName("IX_Employees_PhoneNumber");
        builder.Entity<EmployeesModel>().HasIndex(em => em.Email)
            .IsUnique()
            .HasDatabaseName("IX_Employees_Email");
        builder.Entity<EmployeesModel>().HasIndex(em => em.Tickets_Id)
            .HasDatabaseName("IX_Employees_TicketsId");

        builder.Entity<AddressesModel>().HasIndex(a => new { a.Country, a.City, a.Region, a.Street, a.House })
            .HasDatabaseName("IX_Addresses_Full");
        builder.Entity<AddressesModel>().HasIndex(a => a.Passport_Id)
            .HasDatabaseName("IX_Addresses_PassportId");

        builder.Entity<PassportsModel>()
            .HasIndex(p => new { p.Seria, p.Number })
            .IsUnique()
            .HasDatabaseName("IX_Passports_Seria_Number");
        builder.Entity<PassportsModel>().HasIndex(p => p.Type)
            .HasDatabaseName("IX_Passports_Type");

        builder.Entity<HotelsModel>().HasIndex(h => h.Name)
            .HasDatabaseName("IX_Hotels_Name");
        builder.Entity<HotelsModel>().HasIndex(h => new { h.Tickets_Id, h.Address_Id, h.HotelRooms_Id })
            .HasDatabaseName("IX_Hotels_TicketsAddressesRoomsId");
        builder.Entity<HotelsModel>().HasIndex(h => h.Tickets_Id)
            .HasDatabaseName("IX_Hotels_TicketsId");
        builder.Entity<HotelsModel>().HasIndex(h => h.Address_Id)
            .HasDatabaseName("IX_Hotels_AddressId");
        builder.Entity<HotelsModel>().HasIndex(h => h.HotelRooms_Id)
            .HasDatabaseName("IX_Hotels_HotelRoomsId");

        builder.Entity<HotelRoomsModel>().HasIndex(hr => hr.NameRoom)
            .HasDatabaseName("IX_HotelRooms_NameRoom");

        builder.Entity<TicketsModel>()
            .HasIndex(t => new { t.DepartureTime, t.ArrivalTime })
            .HasDatabaseName("IX_Tickets_Times");
        builder.Entity<TicketsModel>().HasIndex(t => t.Price)
            .HasDatabaseName("IX_Tickets_Price");
        builder.Entity<TicketsModel>().HasIndex(t => t.DateSale)
            .HasDatabaseName("IX_Tickets_DateSale");
        builder.Entity<TicketsModel>().HasIndex(t => t.Client_Id)
            .HasDatabaseName("IX_Tickets_ClientId");

        builder.Entity<ToursModel>().HasIndex(t => t.Name)
            .HasDatabaseName("IX_Tours_Name");
        builder.Entity<ToursModel>()
            .HasIndex(t => new { t.StartDot, t.EndDot })
            .HasDatabaseName("IX_Tours_Route");
        builder.Entity<ToursModel>().HasIndex(t => t.Tickets_Id)
            .HasDatabaseName("IX_Tours_TicketsId");
        builder.Entity<ToursModel>().HasIndex(t => t.Transfers_Id)
            .HasDatabaseName("IX_Tours_TransfersId");
        builder.Entity<ToursModel>().HasIndex(t => new { t.Tickets_Id, t.Transfers_Id })
            .HasDatabaseName("IX_Tours_TicketsTransfersId");

        builder.Entity<TransfersModel>().HasIndex(tf => tf.Name)
            .HasDatabaseName("IX_Transfers_Name");
        builder.Entity<TransfersModel>().HasIndex(tf => tf.Route)
            .HasDatabaseName("IX_Transfers_Route");

        builder.Entity<CurrencyRatesModel>().HasIndex(cr => cr.LetterCode)
            .HasDatabaseName("IX_CurrencyRates_LetterCode");
        builder.Entity<CurrencyRatesModel>().HasIndex(cr => cr.Currency)
            .HasDatabaseName("IX_CurrencyRates_Currency");
        builder.Entity<CurrencyRatesModel>().HasIndex(cr => cr.Rate)
            .HasDatabaseName("IX_CurrencyRates_Rate");

        builder.Entity<CurrencyRates_TicketsModel>().HasIndex(crt => crt.Tickets_Id)
            .HasDatabaseName("IX_CurrencyRatesTickets_TicketsId");
        builder.Entity<CurrencyRates_TicketsModel>().HasIndex(crt => crt.CurrencyRates_Id)
            .HasDatabaseName("IX_CurrencyRatesTickets_CurrencyRatesId");
        builder.Entity<CurrencyRates_TicketsModel>().HasIndex(crt => new { crt.Tickets_Id, crt.CurrencyRates_Id })
            .HasDatabaseName("IX_CurrencyRatesTickets_TicketsCurrencyRatesId");
    }
}