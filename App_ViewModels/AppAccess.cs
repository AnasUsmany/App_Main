using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_ViewModels
{
    public class AppAccess
    {
        [Column("moduleId")]
        public int ModuleId { get; set; }
        [Column("moduleName")]
        public string ModuleName { get; set; }
        [Column("iconCode")]
        public string IconCode { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Column("actionId")]
        public int ActionId { get; set; }
        [Column("actionName")]
        public string ActionName { get; set; }
        [Column("actionTitle")]
        public string ActionTitle { get; set; }
        [Column("controllerName")]
        public string ControllerName { get; set; }
        [Column("sortNumber")]
        public int SortNumber { get; set; }
        [Column("isPublic")]
        public bool IsPublic { get; set; }
        [Column("isActive")]
        public bool IsActive { get; set; }
        [Column("createdDate")]
        public DateTime CreatedDate { get; set; }
        [Column("createdBy")]
        public int CreatedBy { get; set; }
        [Column("modifiedDate")]
        public DateTime ModifiedDate { get; set; }
        [Column("modifiedBy")]
        public int ModifiedBy { get; set; }
    }
}
