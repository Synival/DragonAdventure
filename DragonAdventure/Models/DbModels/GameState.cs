using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Models.DbModels {
    [Table("GameState")]
    public class GameState {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int GameId { get; set; }
        public DateTime Timestamp { get; set; }

        public long FrameCount { get; set; }
        public long StepCount { get; set; }
        public int BattleCount { get; set; }

        public int? Direction { get; set; }
        public int? MapId { get; set; }
        public float? MapXPrecise { get; set; }
        public float? MapYPrecise { get; set; }
        public int? MapX { get; set; }
        public int? MapY { get; set; }

        [ForeignKey("GameId")]
        public virtual Game Game { get; set; }
        [ForeignKey("MapId")]
        public virtual Map Map { get; set; }
    }

    public class GameStateVm : BaseVm {
        public int Id { get; set; }
        public int GameId { get; set; }
        public DateTime Timestamp { get; set; }

        public long FrameCount { get; set; }
        public long StepCount { get; set; }
        public int BattleCount { get; set; }

        public int? Direction { get; set; }
        public int? MapId { get; set; }
        public float? MapXPrecise { get; set; }
        public float? MapYPrecise { get; set; }
        public int? MapX { get; set; }
        public int? MapY { get; set; }

        public long SecondsPlayed { get; set; }
        public string MapName { get; set; }

        public GameStateVm() : base() {}
        public GameStateVm(string error) : base(error) {}
        public GameStateVm(GameState model) {
            Id            = model.Id;
            GameId        = model.GameId;
            Timestamp     = model.Timestamp;
            FrameCount    = model.FrameCount;
            StepCount     = model.StepCount;
            BattleCount   = model.BattleCount;
            Direction     = model.Direction;
            MapId         = model.MapId;
            MapXPrecise   = model.MapXPrecise;
            MapYPrecise   = model.MapYPrecise;
            MapX          = model.MapX;
            MapY          = model.MapY;
            SecondsPlayed = model.FrameCount / 60;
            MapName       = model.Map.Name;
        }
    }

    public class GameWithStateVm : BaseVm {
        public GameVm Game { get; set; }
        public GameStateVm State { get; set; }

        public GameWithStateVm() : base() {}
        public GameWithStateVm(string error) : base(error) {}

        public GameWithStateVm(Game game, GameState state = null) {
            if (state == null)
                state = game.State;
            Game  = new GameVm(game);
            State = new GameStateVm(state);
        }
    }
}