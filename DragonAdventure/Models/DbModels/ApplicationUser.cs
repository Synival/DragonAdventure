using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace DragonAdventure.Models.DbModels {
    public class ApplicationUser : IdentityUser<int> {
        public virtual List<Game> Games { get; set; }
    }
}