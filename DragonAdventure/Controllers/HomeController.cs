using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DragonAdventure.Models;

namespace DragonAdventure.Controllers {
    public class HomeController : Controller {
        public IActionResult Index()
            => View();

        public IActionResult About() {
            ViewData["Message"] = "About Dragon Adventure";
            return View();
        }

        public IActionResult Error()
            => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}