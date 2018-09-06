using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using DragonAdventure.Models;
using Microsoft.AspNetCore.Identity;

namespace DragonAdventure.Data {
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int> {
        public DbSet<Map> Map { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) {}

        protected override void OnModelCreating(ModelBuilder builder) {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
                .HasMany(x => x.MapList)
                .WithOne(x => x.Player);
        }
    }
}