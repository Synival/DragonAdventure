using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Models.DbModels {
    [Table("Map")]
    public class Map {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int? GameId { get; set; }
        public string Name { get; set; }
        public bool Wrap { get; set; }
        public string Ascii { get; set; }

        [ForeignKey("GameId")]
        public virtual Game Game { get; set; }
    }

    public class MapVm : BaseVm {
        public int Id { get; set; }
        public int? GameId { get; set; }
        public string Name { get; set; }
        public bool Wrap { get; set; }
        public string[] Ascii { get; set; }

        public int? PlayerId { get; set; }
        public char[,] Tiles { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }

        public MapVm() : base() {}
        public MapVm(string error) : base(error) {}
        public MapVm(Map model) {
            Id       = model.Id;
            GameId   = model.GameId;
            Name     = model.Name;
            Wrap     = model.Wrap;
            Ascii    = model.Ascii.Split('\n').ToArray();
            PlayerId = (model.GameId == null) ? (int?) null : model.Game.PlayerId;
            Width    = Ascii.Max(x => x.Length);
            Height   = Ascii.Length;
            Tiles    = new char[Width, Height];

            for (var y = 0; y < Height; y++)
                for (var x = 0; x < Ascii[y].Length; x++)
                    Tiles[y, x] = Ascii[y][x];
        }
    }
}