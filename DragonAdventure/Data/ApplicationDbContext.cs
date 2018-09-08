using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using DragonAdventure.Models.DbModels;

namespace DragonAdventure.Data {
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int> {
        public DbSet<Map>       Maps       { get; set; }
        public DbSet<Game>      Games      { get; set; }
        public DbSet<GameState> GameStates { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) {}

        protected override void OnModelCreating(ModelBuilder builder) {
            base.OnModelCreating(builder);
        }
    }
}