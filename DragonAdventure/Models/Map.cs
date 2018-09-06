using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Models {
    [Table("Map")]
    public class Map {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int? PlayerId { get; set; }
        public string Name { get; set; }
        public bool Wrap { get; set; }
        public string Ascii { get; set; }

        [ForeignKey("PlayerId")]
        public virtual ApplicationUser Player { get; set; }
    }

    public class MapVm : BaseVm {
        public int Id { get; set; }
        public int? PlayerId { get; set; }
        public string Name { get; set; }
        public bool Wrap { get; set; }
        public string[] Ascii { get; set; }

        public MapVm() : base() {}
        public MapVm(string error) : base(error) {}
        public MapVm(Map model) {
            Id       = model.Id;
            PlayerId = model.PlayerId;
            Name     = model.Name;
            Wrap     = model.Wrap;
            Ascii    = model.Ascii.Split('\n').ToArray();
        }
    }
}