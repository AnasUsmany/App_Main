using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace App_ViewModels
{
    public class LoginViewModel
    {
        [Column("UserName")]
        public string UserName { get; set; }
        [Column("Password")]
        public string Password { get; set; }
        [Column("LoginDate")]
        public DateTime LoginDate { get; set; }
    }
}