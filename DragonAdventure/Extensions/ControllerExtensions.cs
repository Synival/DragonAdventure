using DragonAdventure.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DragonAdventure.Extensions {
    public static class ControllerExtensions {
        public static int? GetCurrentUserId(this Controller controller) {
            var claim = controller.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
                return null;
            return int.Parse(claim.Value);
        }
    }
}