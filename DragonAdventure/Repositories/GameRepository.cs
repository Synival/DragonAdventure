using DragonAdventure.Data;
using DragonAdventure.Models.DbModels;
using Microsoft.EntityFrameworkCore;
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

        public async Task<Game> GetByIdAsync(int? playerId, int gameId)
            => await GetAll(playerId).FirstOrDefaultAsync(x => x.Id == gameId);

        public async Task<GameState> GetStateByIdAsync(int? playerId, int gameId)
            => await GetAll(playerId).Select(x => x.State).FirstOrDefaultAsync(x => x.GameId == gameId);

        public async Task<GameVm> GetVmByIdAsync(int? playerId, int gameId) {
            var game = await GetByIdAsync(playerId, gameId);
            return (game != null)
                ? new GameVm(game)
                : new GameVm($"Cannot find game with id #{gameId}");
        }

        public async Task<GameStateVm> GetStateVmByIdAsync(int? playerId, int gameId) {
            var state = await GetStateByIdAsync(playerId, gameId);
            return (state != null)
                ? new GameStateVm(state)
                : new GameStateVm($"Cannot find game state with id #{gameId}'");
        }

        public async Task<List<GameWithStateVm>> GetAllVmsWithState(int? playerId)
            => (await GetAll(playerId)
                .Select(x => new { Game = x, State = x.State })
                .ToListAsync())
                .Select(x => new GameWithStateVm(x.Game, x.State))
                .ToList();

        public async Task<GameWithStateVm> GetVmWithStateByIdAsync(int? playerId, int gameId) {
            var game = await GetByIdAsync(playerId, gameId);
            return (game != null)
                ? new GameWithStateVm(game, game.State)
                : new GameWithStateVm($"Cannot find game with id #{gameId}'");
        }

        public async Task<Game> CreateAsync(GameVm vm) {
            var now = DateTime.UtcNow;

            var newGame = new Game() {
                PlayerId  = vm.PlayerId,
                CreatedOn = now,
            };
            _dbcontext.Add(newGame);
            await _dbcontext.SaveChangesAsync();

            var dq2 = await _mapRepository.GetVmByNameAsync(null, "dq2");
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
            await _dbcontext.SaveChangesAsync();
            return newGame;
        }

        public async Task<GameVm> CreateVmAsync(GameVm vm)
            => new GameVm(await CreateAsync(vm));

        public async Task<GameState> UpdateStateAsync(int? playerId, GameStateVm vm) {
            var state = await GetStateByIdAsync(playerId, vm.GameId);
            if (state == null)
                return null;
            if (state.Timestamp > vm.Timestamp || state.FrameCount > vm.FrameCount)
                return state;

            state.Timestamp   = DateTime.UtcNow;
            state.Direction   = vm.Direction;
            state.MapId       = vm.MapId;
            state.MapX        = vm.MapX;
            state.MapY        = vm.MapY;
            state.MapXPrecise = vm.MapXPrecise;
            state.MapYPrecise = vm.MapYPrecise;
            state.FrameCount  = vm.FrameCount;
            state.StepCount   = vm.StepCount;
            state.BattleCount = vm.BattleCount;
            _dbcontext.Update(state);
            _dbcontext.SaveChanges();

            return state;
        }

        public async Task<GameStateVm> UpdateStateVmAsync(int? playerId, GameStateVm vm) {
            var state = await UpdateStateAsync(playerId, vm);
            if (state == null)
                return new GameStateVm($"Can't update state with game id #{vm.GameId}");
            return new GameStateVm(state);
        }

        public async Task<bool> DeleteGameAsync(int? playerId, int gameId) {
            var game = await GetByIdAsync(playerId, gameId);
            if (game == null)
                return false;
            _dbcontext.Games.Remove(game);
            await _dbcontext.SaveChangesAsync();
            return true;
        }
    }
}