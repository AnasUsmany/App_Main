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
        public int moduleId { get; set; }
        [Column("moduleName")]
        public string moduleName { get; set; }
        [Column("iconCode")]
        public string iconCode { get; set; }
        [Column("description")]
        public string description { get; set; }
        [Column("actionId")]
        public int actionId { get; set; }
        [Column("actionName")]
        public string actionName { get; set; }
        [Column("actionTitle")]
        public string actionTitle { get; set; }
        [Column("controllerName")]
        public string controllerName { get; set; }
        [Column("sortNumber")]
        public int sortNumber { get; set; }
        [Column("isPublic")]
        public bool isPublic { get; set; }
        [Column("isActive")]
        public bool isActive { get; set; }
        [Column("createdDate")]
        public DateTime createdDate { get; set; }
        [Column("createdBy")]
        public int createdBy { get; set; }
        [Column("modifiedDate")]
        public DateTime modifiedDate { get; set; }
        [Column("modifiedBy")]
        public int modifiedBy { get; set; }
    }
}
