using DragonAdventure.Data;
using DragonAdventure.Models.DbModels;
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

        public Map GetByName(int? playerId, string name)
            => GetAll(playerId).FirstOrDefault(x => x.Name == name);

        public Map GetByName(int? playerId, int? gameId, string name)
            => GetAll(playerId, gameId).FirstOrDefault(x => x.Name == name);

        public Map GetById(int? playerId, int id)
            => GetAll(playerId).FirstOrDefault(x => x.Id == id);

        public Map GetById(int? playerId, int? gameId, int id)
            => GetAll(playerId, gameId).FirstOrDefault(x => x.Id == id);

        public MapVm GetVmByName(int? playerId, string name) {
            var map = GetByName(playerId, name);
            return (map != null)
                ? new MapVm(map)
                : new MapVm($"Cannot find map with name '{name}'");
        }

        public MapVm GetVmByName(int? playerId, int? gameId, string name) {
            var map = GetByName(playerId, gameId, name);
            return (map != null)
                ? new MapVm(map)
                : new MapVm($"Cannot find map with name '{name}' for game #{gameId}");
        }

        public MapVm GetVmById(int? playerId, int id) {
            var map = GetById(playerId, id);
            return (map != null)
                ? new MapVm(map)
                : new MapVm($"Cannot find map with id #{id}'");
        }

        public MapVm GetVmById(int? playerId, int? gameId, int id) {
            var map = GetById(playerId, gameId, id);
            return (map != null)
                ? new MapVm(map)
                : new MapVm($"Cannot find map with id #{id}' for game #{gameId}");
        }
    }
}