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
        public class GetMapListVm {
            public int Id { get; set; }
            public string Name { get; set; }
        }

        public List<GetMapListVm> GetList(string sort = null) {
            var query = MapRepository.MapList
                .Select(x => new GetMapListVm() { Id = x.Id, Name = x.Name });
            if (sort == "id")
                query = query.OrderBy(x => x.Id);
            else if (sort == "name")
                query = query.OrderBy(x => x.Name);
            return query.ToList();
        }

        public MapVm GetByName([Required] string name) {
            try { return MapRepository.GetByName(name); }
            catch (Exception e) { return new MapVm(e.Message); }
        }

        public MapVm GetById(int id) {
            try { return MapRepository.GetById(id); }
            catch (Exception e) { return new MapVm(e.Message); }
        }
    }
}