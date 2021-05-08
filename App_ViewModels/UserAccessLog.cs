using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_ViewModels.Models
{
    public class UserAccessLog
    {
        [Column("logid")]
        public long logid { get; set; }
        [Column("userid")]
        public int userid { get; set; }
        [Column("loginStatus")]
        public LoginStatus loginStatus { get; set; }
        [Column("loginDate")]
        public DateTime loginDate { get; set; }
        [Column("ip")]
        public string ip { get; set; }
        [Column("mac")]
        public string mac { get; set; }
    }

    public enum LoginStatus
    {
        Login = 1,
        Logout = 2
    }

}
