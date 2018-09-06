using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Models {
    public class MapVm {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public string Name { get; set; }
        public bool Wrap { get; set; }
        public string[] Ascii { get; set; }

        public string Error { get; set; }

        public MapVm() {}
        public MapVm(string error) : this()
            { Error = error; }
    }
}