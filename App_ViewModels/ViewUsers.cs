using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_ViewModels
{
    public class ViewUsers
    {
        [Column("userid")]
        public int UserId { get; set; }
        [Column("userName")]
        public string UserName { get; set; }
        [Column("firstName")]
        public string FirstName { get; set; }
        [Column("lastName")]
        public string LastName { get; set; }
        [Column("email")]
        public string Email { get; set; }
        [Column("TotalRows")]
        public int TotalRows { get; set; }
        [Column("isActive")]
        public bool isActive { get; set; }
    }
}
