using DragonAdventure.Data;
using DragonAdventure.Extensions;
using DragonAdventure.Models;
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
    public class GameController : AppController {
        private readonly GameRepository _gameRepository;

        private ApplicationDbContext _dbcontext = null;
        public GameController(ApplicationDbContext dbcontext) {
            _dbcontext = dbcontext;
            _gameRepository = new GameRepository(dbcontext);
        }

        public List<GameVm> GetAll()
            => _gameRepository
                .GetAll(PlayerId).ToList()
                .Select(x => new GameVm(x)).ToList();
 
        [Route("{gameId}")]
        public async Task<GameVm> GetById(int gameId)
            => await _gameRepository.GetVmByIdAsync(PlayerId, gameId);

        [Route("{gameId}")]
        public async Task<GameStateVm> GetStateById(int gameId)
            => await _gameRepository.GetStateVmByIdAsync(PlayerId, gameId);

        public async Task<List<GameWithStateVm>> GetAllWithState()
            => await _gameRepository.GetAllVmsWithState(PlayerId);

        [HttpPost]
        public async Task<GameVm> Create(GameVm vm) {
            if (vm == null)
                vm = new GameVm();
            vm.PlayerId = PlayerId.Value;
            return await _gameRepository.CreateVmAsync(vm);
        }

        [HttpPatch]
        public async Task<GameStateVm> UpdateState([FromBody] GameStateVm vm) {
            if (vm == null)
                return new GameStateVm("No state supplied");
            return await _gameRepository.UpdateStateVmAsync(PlayerId, vm);
        }

        [HttpDelete]
        [Route("{gameId}")]
        public async Task<bool> Delete(int gameId)
            => await _gameRepository.DeleteGameAsync(PlayerId, gameId);

        public async Task<IActionResult> Manage() {
            var games = await _gameRepository.GetAllVmsWithState(PlayerId);
            return View(games);
        }

        [Route("{gameId}")]
        public async Task<IActionResult> Play(int gameId) {
            var game = await _gameRepository.GetVmByIdAsync(PlayerId, gameId);
            if (game.Error != null)
                return NotFound(game.Error);
            ViewData["GameId"] = gameId;
            return View();
        }
    }
}