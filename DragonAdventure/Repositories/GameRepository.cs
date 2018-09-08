using DragonAdventure.Data;
using DragonAdventure.Models.DbModels;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Repositories {
    public class GameRepository {
        private readonly ApplicationDbContext _dbcontext     = null;
        private readonly MapRepository        _mapRepository = null;
        public GameRepository(ApplicationDbContext dbcontext) {
            _dbcontext = dbcontext;
            _mapRepository = new MapRepository(_dbcontext);
        }

        public IQueryable<Game> GetAll(int? playerId)
            => _dbcontext.Games.Where(x => playerId == null || x.PlayerId == playerId);

        public Game GetById(int? playerId, int gameId)
            => GetAll(playerId).FirstOrDefault(x => x.Id == gameId);

        public GameState GetStateById(int? playerId, int gameId)
            => GetAll(playerId).Select(x => x.State).FirstOrDefault(x => x.GameId == gameId);

        public GameVm GetVmById(int? playerId, int gameId) {
            var game = GetById(playerId, gameId);
            return (game != null)
                ? new GameVm(game)
                : new GameVm($"Cannot find game with id #{gameId}'");
        }

        public GameStateVm GetStateVmById(int? playerId, int gameId) {
            var state = GetStateById(playerId, gameId);
            return (state != null)
                ? new GameStateVm(state)
                : new GameStateVm($"Cannot find game state with id #{gameId}'");
        }

        public GameWithStateVm GetVmWithStateById(int? playerId, int gameId) {
            var game = GetById(playerId, gameId);
            return (game != null)
                ? new GameWithStateVm(game, game.State)
                : new GameWithStateVm($"Cannot find game with id #{gameId}'");
        }

        public Game Create(GameVm vm) {
            var now = DateTime.UtcNow;

            var newGame = new Game() {
                PlayerId  = vm.PlayerId,
                CreatedOn = now,
            };
            _dbcontext.Add(newGame);
            _dbcontext.SaveChanges();

            var dq2 = _mapRepository.GetVmByName(null, "dq2");
            var newGameState = new GameState() {
                GameId      = newGame.Id,
                Timestamp   = now,
                Direction   = 0,
                MapId       = dq2.Id,
                MapXPrecise = dq2.Width / 2,
                MapYPrecise = dq2.Height / 2,
                MapX        = dq2.Width / 2,
                MapY        = dq2.Height / 2,
            };
            _dbcontext.Add(newGameState);
            _dbcontext.SaveChanges();
            return newGame;
        }

        public GameVm CreateVm(GameVm vm)
            => new GameVm(Create(vm));
    }
}