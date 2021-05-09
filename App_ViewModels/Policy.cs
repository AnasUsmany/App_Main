using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_ViewModels.Models
{
    public class Policy
    {
        [Column("PolicyId")]
        public int PolicyId { get; set; }

        [Column("PolicyName")]
        public string PolicyName { get; set; }

        [Column("Description")]
        public string Description { get; set; }

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

        [Column("MacAddress")]
        public string MacAddress { get; set; }

        [Column("Ip")]
        public string Ip { get; set; }

        public List<PolicyModules> Modules { get; set; }

        public List<PolicyActions> Actions { get; set; }

        public List<AllowedActionsByModule> AllowedActionsByModule { get; set; }
        
    }

    public class PolicyModules
    {
        [Column("PmId")]
        public int PmId { get; set; }
        [Column("ModuleId")]
        public int ModuleId { get; set; }
        [Column("PolicyId")]
        public int PolicyId { get; set; }
        [Column("ModuleName")]
        public string ModuleName { get; set; }
        [Column("IconCode")]
        public string IconCode { get; set; }
    }

    public class PolicyActions
    {
        [Column("PaId")]
        public int PaId { get; set; }
        [Column("Actionid")]
        public int ActionId { get; set; }
        [Column("Moduleid")]
        public int ModuleId { get; set; }
        [Column("Policyid")]
        public int PolicyId { get; set; }
        [Column("ActionName")]
        public string ActionName { get; set; }
        [Column("ActionTitle")]
        public string ActionTitle { get; set; }
        [Column("ControllerName")]
        public string ControllerName { get; set; }
        [Column("Description")]
        public string Description { get; set; }
        [Column("IsActive")]
        public bool IsActive { get; set; }
    }

    public class AllowedActionsByModule
    {
        [Column("PolicyId")]
        public int PolicyId { get; set; }
        [Column("ModuleId")]
        public int ModuleId { get; set; }
        [Column("AllowedActions")]
        public int AllowedActions { get; set; }
        [Column("TotalActions")]
        public int TotalActions { get; set; }
    }
}
