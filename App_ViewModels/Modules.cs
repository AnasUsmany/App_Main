using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_ViewModels.Models
{
    public class Modules
    {
        [Column("ModuleId")]
        public int ModuleId { get; set; }
        [Column("ModuleName")]
        public string ModuleName { get; set; }
        [Column("IconCode")]
        public string IconCode { get; set; }
        [Column("Description")]
        public string Description { get; set; }
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
        [Column("Ip")]
        public string Ip { get; set; }
        [Column("Mac")]
        public string Mac { get; set; }
    }
}
