using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DragonAdventure.Models;
using DragonAdventure.Data;

namespace DragonAdventure.Controllers {
    public class HomeController : Controller {
        public IActionResult Index()
            => View();
        public IActionResult About()
            => View();
        public IActionResult Contact()
            => View();
        public IActionResult Error(string message = null)
            => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}