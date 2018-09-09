using DragonAdventure.Data;
using DragonAdventure.Extensions;
using DragonAdventure.Models.DbModels;
using DragonAdventure.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Controllers {
    [Authorize, Route("[controller]/[action]")]
    public class MapController : Controller {
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
            var playerId = this.GetCurrentPlayerId();
            var query =
                ((gameId.HasValue)
                    ? _mapRepository.GetAll(playerId, gameId)
                    : _mapRepository.GetAll(playerId))
                .Select(x => new GetMapListVm() { Id = x.Id, Name = x.Name });
            if (sort == "id")
                query = query.OrderBy(x => x.Id);
            else if (sort == "name")
                query = query.OrderBy(x => x.Name);
            return query.ToList();
        }

        [Route("{name}")]
        public async Task<MapVm> GetByName(string name, int? gameId = null) {
            var playerId = this.GetCurrentPlayerId();
            return await ((gameId.HasValue)
                ? _mapRepository.GetVmByNameAsync(playerId, gameId, name)
                : _mapRepository.GetVmByNameAsync(playerId, name));
        }

        [Route("{id}")]
        public async Task<MapVm> GetById(int id, int? gameId = null) {
            var playerId = this.GetCurrentPlayerId();
            return await ((gameId.HasValue)
                ? _mapRepository.GetVmByIdAsync(playerId, gameId, id)
                : _mapRepository.GetVmByIdAsync(playerId, id));
        }
    }
}