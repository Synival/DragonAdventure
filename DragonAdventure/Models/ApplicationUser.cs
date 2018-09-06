using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace DragonAdventure.Models {
    public class ApplicationUser : IdentityUser<int> {
        [ForeignKey("PlayerId")]
        public virtual List<Map> MapList { get; set; }
    }
}