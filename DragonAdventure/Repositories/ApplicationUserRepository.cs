using DragonAdventure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Repositories {
    public class ApplicationUserRepository {
        private ApplicationDbContext _dbcontext = null;
        public ApplicationUserRepository(ApplicationDbContext dbcontext)
            { _dbcontext = dbcontext; }

    }
}
