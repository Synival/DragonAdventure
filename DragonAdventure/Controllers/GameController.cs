using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Controllers {
    [Authorize, Route("[controller]/[action]")]
    public class GameController : Controller {
        public string GetGames() {
            return "You have no games, lol";
        }
    }
}
