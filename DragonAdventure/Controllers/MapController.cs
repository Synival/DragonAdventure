using DragonAdventure.Data;
using DragonAdventure.Models;
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

        public List<GetMapListVm> GetList(string sort = null) {
            var query = _mapRepository.GetAll()
                .Select(x => new GetMapListVm() { Id = x.Id, Name = x.Name });
            if (sort == "id")
                query = query.OrderBy(x => x.Id);
            else if (sort == "name")
                query = query.OrderBy(x => x.Name);
            return query.ToList();
        }

        public MapVm GetByName([Required] string name)
            => _mapRepository.GetVmByName(name);

        public MapVm GetById(int id)
            => _mapRepository.GetVmById(id);
    }
}