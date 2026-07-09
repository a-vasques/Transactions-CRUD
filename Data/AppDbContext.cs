using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TransactionsCRUDv2.Models;

namespace TransactionsCRUDv2.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options){}

        public DbSet<Person> Person {get; set;}
        public DbSet<Transaction> Transaction {get; set;}
    }
}