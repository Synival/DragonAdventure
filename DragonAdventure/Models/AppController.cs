using DragonAdventure.Extensions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Models {
    public class AppController : Controller {
        protected int? _playerId = null;
        protected int? PlayerId { get {
            if (_playerId == null)
                _playerId = this.GetCurrentUserId();
            return _playerId;
        }}
    }
}