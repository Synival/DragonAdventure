using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Models {
    public class BaseVm {
        public string Error { get; set; }
        public BaseVm() {}
        public BaseVm(string error) : this() {
            Error = error;
        }
    }
}