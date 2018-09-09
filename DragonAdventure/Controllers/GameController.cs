using DragonAdventure.Data;
using DragonAdventure.Extensions;
using DragonAdventure.Models.DbModels;
using DragonAdventure.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Controllers {
    [Authorize, Route("[controller]/[action]")]
    public class GameController : Controller {
        private readonly GameRepository _gameRepository;

        private ApplicationDbContext _dbcontext = null;
        public GameController(ApplicationDbContext dbcontext) {
            _dbcontext = dbcontext;
            _gameRepository = new GameRepository(dbcontext);
        }

        public List<GameVm> GetAll() {
            var playerId = this.GetCurrentPlayerId();
            return _gameRepository
                .GetAll(playerId).ToList()
                .Select(x => new GameVm(x)).ToList();
        }

        [Route("{gameId}")]
        public async Task<GameVm> GetById(int gameId) {
            var playerId = this.GetCurrentPlayerId();
            return await _gameRepository.GetVmByIdAsync(playerId, gameId);
        }

        [Route("{gameId}")]
        public async Task<GameStateVm> GetStateById(int gameId) {
            var playerId = this.GetCurrentPlayerId();
            return await _gameRepository.GetStateVmByIdAsync(playerId, gameId);
        }

        public async Task<List<GameWithStateVm>> GetAllWithState() {
            var playerId = this.GetCurrentPlayerId();
            return (await _gameRepository
                .GetAll(playerId)
                .Select(x => new { Game = x, State = x.State })
                .ToListAsync())
                .Select(x => new GameWithStateVm(x.Game, x.State))
                .ToList();
        }

        [HttpPost]
        public async Task<GameVm> Create(GameVm vm) {
            if (vm == null)
                vm = new GameVm();
            vm.PlayerId = this.GetCurrentPlayerId().Value;
            return await _gameRepository.CreateVmAsync(vm);
        }

        [HttpPatch]
        public async Task<GameStateVm> UpdateState([FromBody] GameStateVm vm) {
            if (vm == null)
                return new GameStateVm("No state supplied");
            var playerId = this.GetCurrentPlayerId().Value;
            return await _gameRepository.UpdateStateVmAsync(playerId, vm);
        }

        public IActionResult Manage()
            => View();

        [Route("{gameId}")]
        public IActionResult Play(int gameId) {
            ViewData["GameId"] = gameId;
            return View();
        }
    }
}