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
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DragonAdventure.Controllers {
    [Authorize, Route("[controller]/[action]")]
    public class MapController : AppController {
        private readonly MapRepository _mapRepository;

        public class GetMapListVm {
            public int Id { get; set; }
            public string Name { get; set; }
        }

        private ApplicationDbContext _dbcontext = null;
        public MapController(ApplicationDbContext dbcontext) {
            _dbcontext = dbcontext;
            _mapRepository = new MapRepository(dbcontext);
        }

        public List<GetMapListVm> GetList(string sort = null, int? gameId = null) {
            var query =
                ((gameId.HasValue)
                    ? _mapRepository.GetAll(PlayerId, gameId)
                    : _mapRepository.GetAll(PlayerId))
                .Select(x => new GetMapListVm() { Id = x.Id, Name = x.Name });
            if (sort == "id")
                query = query.OrderBy(x => x.Id);
            else if (sort == "name")
                query = query.OrderBy(x => x.Name);
            return query.ToList();
        }

        [Route("{name}")]
        public async Task<MapVm> GetByName(string name, int? gameId = null)
            => await ((gameId.HasValue)
                ? _mapRepository.GetVmByNameAsync(PlayerId, gameId, name)
                : _mapRepository.GetVmByNameAsync(PlayerId, name));

        [Route("{id}")]
        public async Task<MapVm> GetById(int id, int? gameId = null)
            => await ((gameId.HasValue)
                ? _mapRepository.GetVmByIdAsync(PlayerId, gameId, id)
                : _mapRepository.GetVmByIdAsync(PlayerId, id));
 
        public async Task<IActionResult> ViewAll() {
            var model = await _mapRepository.GetAll(PlayerId)
                .Select(x => new MapVm(x))
                .ToListAsync();
            return View(model);
        }

        [Route("{mapId}")]
        public async Task<IActionResult> ViewById(int mapId) {
            var model = await _mapRepository.GetVmByIdAsync(PlayerId, mapId);
            if (model.Error != null)
                return NotFound(model.Error);
            return View("View", model);
        }

        [Route("{name}")]
        public async Task<IActionResult> ViewByName(string name) {
            var model = await _mapRepository.GetVmByNameAsync(PlayerId, name);
            if (model.Error != null)
                return NotFound(model.Error);
            return View("View", model);
        }
    }
}