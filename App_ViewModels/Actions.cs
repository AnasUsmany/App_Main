using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_ViewModels.Models
{
    public class Actions
    {
        [Column("ActionId")]
        public int ActionId { get; set; }
        [Column("ModuleId")]
        public int ModuleId { get; set; }
        [Column("ActionName")]
        public string ActionName { get; set; }
        [Column("ActionTitle")]
        public string ActionTitle { get; set; }
        [Column("ControllerName")]
        public string ControllerName { get; set; }
        [Column("Description")]
        public string Description { get; set; }
        [Column("IsPublic")]
        public bool IsPublic { get; set; }
        [Column("IsActive")]
        public bool IsActive { get; set; }
        [Column("SortNumber")]
        public int SortNumber { get; set; }
        [Column("CreatedDate")]
        public DateTime CreatedDate { get; set; }
        [Column("CreatedBy")]
        public int CreatedBy { get; set; }
        [Column("ModifiedDate")]
        public DateTime ModifiedDate { get; set; }
        [Column("ModifiedBy")]
        public int ModifiedBy { get; set; }
        //for view model
        [Column("ModuleName")]
        public string ModuleName { get; set; }
    }
}
