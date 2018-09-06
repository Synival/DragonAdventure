using DragonAdventure.Data;
using DragonAdventure.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Repositories {
    public class MapRepository {
        private ApplicationDbContext _dbcontext = null;
        public MapRepository(ApplicationDbContext dbcontext)
            { _dbcontext = dbcontext; }

        public Map GetByName(string name)
            => _dbcontext.Map.FirstOrDefault(x => x.Name == name);

        public Map GetById(int id)
            => _dbcontext.Map.FirstOrDefault(x => x.Id == id);

        public MapVm GetVmByName(string name) {
            var map = GetByName(name);
            return (map != null) ? new MapVm(map) : new MapVm($"Cannot find map with name '{name}'");
        }

        public MapVm GetVmById(int id) {
            var map = GetById(id);
            return (map != null) ? new MapVm(map) : new MapVm($"Cannot find map with id #{id}'");
        }

        public IQueryable<Map> GetAll()
            => _dbcontext.Map.AsQueryable();
    }
}