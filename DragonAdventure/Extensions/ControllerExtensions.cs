using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DragonAdventure.Extensions {
    public static class ControllerExtensions {
        public static int? GetCurrentPlayerId(this Controller controller) {
            var claim = controller.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
                return null;
            return int.Parse(claim.Value);
        }
    }
}