using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Models.ManageViewModels {
    public class EnableAuthenticatorViewModel {
        [Required, DataType(DataType.Text), Display(Name = "Verification Code")]
        [StringLength(7, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        public string Code { get; set; }

        [ReadOnly(true)]
        public string SharedKey { get; set; }

        public string AuthenticatorUri { get; set; }
    }
}
