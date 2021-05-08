using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_ViewModels.Models
{
    public class Roles
    {
        [Column("RoleId")]
        public int RoleId { get; set; }

        [Column("RoleName")]
        public string RoleName { get; set; }
        
        [Column("IsActive")]
        public bool IsActive { get; set; }

        [Column("IsDeleted")]
        public bool IsDeleted { get; set; }

        [Column("CreatedBy")]
        public int CreatedBy { get; set; }

        [Column("CreatedDate")]
        public DateTime CreatedDate { get; set; }

        [Column("UpdatedBy")]
        public int UpdatedBy { get; set; }

        [Column("UpdatedDate")]
        public DateTime UpdatedDate { get; set; }

        [Column("Mac")]
        public string Mac{ get; set; }

        [Column("Ip")]
        public string Ip { get; set; }
        
        public List<RolePolicy> Policies { get; set; }
    }

    public class RolePolicy 
    {
        public int Rpid { get; set; }
        public int Roleid { get; set; }
        public int Policyid { get; set; }
        public string PolicyName { get; set; }
        public bool IsActive { get; set; }
        public string Description { get; set; }
        public bool IsDeleted { get; set; }
        public List<PolicyModules> Modules { get; set; }
        public List<PolicyActions> Actions { get; set; }
        public List<AllowedActionsByModule> AllowedActionsByModule { get; set; }
    }
    


}
