using DragonAdventure.Data;
using DragonAdventure.Models.DbModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Repositories {
    public class MapRepository {
        private readonly ApplicationDbContext _dbcontext = null;
        public MapRepository(ApplicationDbContext dbcontext)
            { _dbcontext = dbcontext; }

        public IQueryable<Map> GetAll(int? playerId)
            => _dbcontext.Maps.Where(x => x.GameId == null || x.Game.PlayerId == playerId);

        public IQueryable<Map> GetAll(int? playerId, int? gameId)
            => GetAll(playerId).Where(x => x.GameId == null || x.GameId == gameId);

        public async Task<Map> GetByNameAsync(int? playerId, string name)
            => await GetAll(playerId).FirstOrDefaultAsync(x => x.Name == name);

        public async Task<Map> GetByNameAsync(int? playerId, int? gameId, string name)
            => await GetAll(playerId, gameId).FirstOrDefaultAsync(x => x.Name == name);

        public async Task<Map> GetByIdAsync(int? playerId, int id)
            => await GetAll(playerId).FirstOrDefaultAsync(x => x.Id == id);

        public async Task<Map> GetByIdAsync(int? playerId, int? gameId, int id)
            => await GetAll(playerId, gameId).FirstOrDefaultAsync(x => x.Id == id);

        public async Task<MapVm> GetVmByNameAsync(int? playerId, string name) {
            var map = await GetByNameAsync(playerId, name);
            return (map != null)
                ? new MapVm(map)
                : new MapVm($"Cannot find map with name '{name}'");
        }

        public async Task<MapVm> GetVmByNameAsync(int? playerId, int? gameId, string name) {
            var map = await GetByNameAsync(playerId, gameId, name);
            return (map != null)
                ? new MapVm(map)
                : new MapVm($"Cannot find map with name '{name}' for game #{gameId}");
        }

        public async Task<MapVm> GetVmByIdAsync(int? playerId, int id) {
            var map = await GetByIdAsync(playerId, id);
            return (map != null)
                ? new MapVm(map)
                : new MapVm($"Cannot find map with id #{id}'");
        }

        public async Task<MapVm> GetVmByIdAsync(int? playerId, int? gameId, int id) {
            var map = await GetByIdAsync(playerId, gameId, id);
            return (map != null)
                ? new MapVm(map)
                : new MapVm($"Cannot find map with id #{id}' for game #{gameId}");
        }
    }
}