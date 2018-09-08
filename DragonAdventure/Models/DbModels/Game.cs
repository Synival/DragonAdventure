using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Models.DbModels {
    [Table("Game")]
    public class Game {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public DateTime CreatedOn { get; set; }

        [ForeignKey("PlayerId")]
        public virtual ApplicationUser Player { get; set; }
        public virtual GameState State { get; set; }
        public virtual List<Map> Maps { get; set; }
    }

    public class GameVm : BaseVm {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public DateTime CreatedOn { get; set; }

        public GameVm() : base() {}
        public GameVm(string error) : base(error) {}
        public GameVm(Game model) {
            Id           = model.Id;
            PlayerId     = model.PlayerId;
            CreatedOn    = model.CreatedOn;
        }
    }
}