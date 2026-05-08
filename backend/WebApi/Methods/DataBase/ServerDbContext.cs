using Microsoft.EntityFrameworkCore;
using WebApi.Models.ModelsDataBase;

namespace WebApi.Methods.DataBase;

public sealed class ServerDbContext(DbContextOptions<ServerDbContext> options) : DbContext(options)
{
    public DbSet<AddressesModel> Addresses { get; set; }
    public DbSet<UsersModel> Clients { get; set; }
    public DbSet<CurrencyRates_TicketsModel> CurrencyRatesTickets { get; set; }
    public DbSet<CurrencyRatesModel> CurrencyRates { get; set; }
    public DbSet<TicketsModel> Tickets { get; set; }
    public DbSet<HotelsModel> Hotels { get; set; }
    public DbSet<HotelRoomsModel> HotelRooms { get; set; }
    public DbSet<PassportsModel> Passports { get; set; }
    public DbSet<ToursModel> Tours { get; set; }
    public DbSet<TransfersModel> Transfers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        #region IX_Users

        builder.Entity<UsersModel>().HasIndex(u => new { u.SurName, u.FirstName, u.MiddleName })
            .HasDatabaseName("IX_Users_FullName");
        builder.Entity<UsersModel>().HasIndex(u => u.SurName)
            .HasDatabaseName("IX_Users_SurName");
        builder.Entity<UsersModel>().HasIndex(u => u.FirstName)
            .HasDatabaseName("IX_Users_FirstName");
        builder.Entity<UsersModel>().HasIndex(u => u.MiddleName)
            .HasDatabaseName("IX_Users_MiddleName");
        builder.Entity<UsersModel>().HasIndex(u => u.PhoneNumber)
            .IsUnique()
            .HasDatabaseName("IX_Users_PhoneNumber");
        builder.Entity<UsersModel>().HasIndex(u => u.Email)
            .IsUnique()
            .HasDatabaseName("IX_Users_Email");
        builder.Entity<UsersModel>().HasIndex(u => u.Login)
            .IsUnique()
            .HasDatabaseName("IX_Users_Login");
        builder.Entity<UsersModel>().HasIndex(u => u.Gender)
            .HasDatabaseName("IX_Users_Gender");
        builder.Entity<UsersModel>().HasIndex(u => u.Birthday)
            .HasDatabaseName("IX_Users_Birthday");
        builder.Entity<UsersModel>().HasIndex(u => u.Age)
            .HasDatabaseName("IX_Users_Age");
        builder.Entity<UsersModel>().HasIndex(u => u.Position)
            .HasDatabaseName("IX_Users_Position");
        builder.Entity<UsersModel>().HasIndex(u => u.Role)
            .HasDatabaseName("IX_Users_Role");

        #endregion

        #region IX_Addresses

        builder.Entity<AddressesModel>().HasIndex(a => new { a.Country, a.City, a.Region, a.Street, a.House })
            .HasDatabaseName("IX_Addresses_FullAddress");
        builder.Entity<AddressesModel>().HasIndex(a => a.Country)
            .HasDatabaseName("IX_Addresses_Country");
        builder.Entity<AddressesModel>().HasIndex(a => a.City)
            .HasDatabaseName("IX_Addresses_City");
        builder.Entity<AddressesModel>().HasIndex(a => a.Region)
            .HasDatabaseName("IX_Addresses_Region");
        builder.Entity<AddressesModel>().HasIndex(a => a.Street)
            .HasDatabaseName("IX_Addresses_Street");
        builder.Entity<AddressesModel>().HasIndex(a => a.House)
            .HasDatabaseName("IX_Addresses_House");

        #endregion

        #region IX_Passports

        builder.Entity<PassportsModel>()
            .HasIndex(p => new { p.Seria, p.Number })
            .IsUnique()
            .HasDatabaseName("IX_Passports_Seria_Number");
        builder.Entity<PassportsModel>().HasIndex(p => p.Seria)
            .IsUnique()
            .HasDatabaseName("IX_Passports_Seria");
        builder.Entity<PassportsModel>().HasIndex(p => p.Number)
            .IsUnique()
            .HasDatabaseName("IX_Passports_Number");
        builder.Entity<PassportsModel>().HasIndex(p => p.Type)
            .HasDatabaseName("IX_Passports_Type");
        builder.Entity<PassportsModel>().HasIndex(p => p.IssuedBy)
            .HasDatabaseName("IX_Passports_IssuedBy");
        builder.Entity<PassportsModel>().HasIndex(p => p.DepartmentCode)
            .HasDatabaseName("IX_Passports_DepartmentCode");
        builder.Entity<PassportsModel>().HasIndex(p => p.DateOfIssue)
            .HasDatabaseName("IX_Passports_DateOfIssue");

        #endregion

        #region IX_Hotels

        builder.Entity<HotelsModel>().HasIndex(h => h.Name)
            .HasDatabaseName("IX_Hotels_Name");
        builder.Entity<HotelsModel>().HasIndex(h => h.Stars)
            .HasDatabaseName("IX_Hotels_Stars");
        builder.Entity<HotelsModel>().HasIndex(h => h.Details)
            .HasDatabaseName("IX_Hotels_Details");
        builder.Entity<HotelsModel>().HasIndex(h => h.ImageHotel)
            .HasDatabaseName("IX_Hotels_ImageHotel");

        #endregion

        #region IX_HotelRooms

        builder.Entity<HotelRoomsModel>().HasIndex(hr => hr.NameRoom)
            .HasDatabaseName("IX_HotelRooms_NameRoom");
        builder.Entity<HotelRoomsModel>().HasIndex(hr => hr.ImageRoom)
            .HasDatabaseName("IX_HotelRooms_ImageRoom");
        builder.Entity<HotelRoomsModel>().HasIndex(hr => hr.Details)
            .HasDatabaseName("IX_HotelRooms_Details");
        builder.Entity<HotelRoomsModel>().HasIndex(hr => hr.Floor)
            .HasDatabaseName("IX_HotelRooms_Floor");

        #endregion

        #region IX_Tickets

        builder.Entity<TicketsModel>()
            .HasIndex(t => new { t.DepartureTime, t.ArrivalTime })
            .HasDatabaseName("IX_Tickets_Times");
        builder.Entity<TicketsModel>().HasIndex(t => t.Price)
            .HasDatabaseName("IX_Tickets_Price");
        builder.Entity<TicketsModel>().HasIndex(t => t.DateSale)
            .HasDatabaseName("IX_Tickets_DateSale");

        #endregion

        #region IX_Tours

        builder.Entity<ToursModel>().HasIndex(t => t.Name)
            .HasDatabaseName("IX_Tours_Name");
        builder.Entity<ToursModel>()
            .HasIndex(t => new { t.StartDot, t.EndDot })
            .HasDatabaseName("IX_Tours_Route");
        builder.Entity<ToursModel>().HasIndex(t => t.Details)
            .HasDatabaseName("IX_Tours_Details");
        builder.Entity<ToursModel>().HasIndex(t => t.ImageTour)
            .HasDatabaseName("IX_Tours_ImageTour");
        builder.Entity<ToursModel>().HasIndex(t => t.Description)
            .HasDatabaseName("IX_Tours_Description");
        builder.Entity<ToursModel>().HasIndex(t => t.HotTour)
            .HasDatabaseName("IX_Tours_HotTour");
        builder.Entity<ToursModel>().HasIndex(t => t.Price)
            .HasDatabaseName("IX_Tours_Price");

        #endregion

        #region IX_Transfers

        builder.Entity<TransfersModel>().HasIndex(tf => tf.Name)
            .HasDatabaseName("IX_Transfers_Name");
        builder.Entity<TransfersModel>().HasIndex(tf => tf.Arrival)
            .HasDatabaseName("IX_Transfers_Arrival");
        builder.Entity<TransfersModel>().HasIndex(tf => tf.Departure)
            .HasDatabaseName("IX_Transfers_Departure");

        #endregion

        #region IX_CurrencyRates

        builder.Entity<CurrencyRatesModel>().HasIndex(cr => cr.LetterCode)
            .HasDatabaseName("IX_CurrencyRates_LetterCode");
        builder.Entity<CurrencyRatesModel>().HasIndex(cr => cr.Currency)
            .HasDatabaseName("IX_CurrencyRates_Currency");
        builder.Entity<CurrencyRatesModel>().HasIndex(cr => cr.Rate)
            .HasDatabaseName("IX_CurrencyRates_Rate");
        builder.Entity<CurrencyRatesModel>().HasIndex(cr => cr.DateReceipt)
            .HasDatabaseName("IX_CurrencyRates_DateReceipt");

        #endregion

        #region IX_CurrencyRates_Tickets

        builder.Entity<CurrencyRates_TicketsModel>().HasIndex(crt => crt.TicketsId)
            .HasDatabaseName("IX_CurrencyRatesTickets_TicketsId");
        builder.Entity<CurrencyRates_TicketsModel>().HasIndex(crt => crt.CurrencyRatesId)
            .HasDatabaseName("IX_CurrencyRatesTickets_CurrencyRatesId");
        builder.Entity<CurrencyRates_TicketsModel>().HasIndex(crt => new { crt.TicketsId, crt.CurrencyRatesId })
            .HasDatabaseName("IX_CurrencyRatesTickets_TicketsCurrencyRatesId");

        #endregion
    }
}