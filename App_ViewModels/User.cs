using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_ViewModels.Models
{
    public class Users
    {
        [Column("UserId")]
        public int UserId { get; set; }
        [Column("ProfilePicPath")]
        public string ProfilePicPath { get; set; }
        [Column("Name")]
        public string Name { get; set; }
        [Column("City")]
        public string City { get; set; }
        [Column("State")]
        public string State { get; set; }
        [Column("Country")]
        public string Country { get; set; }
        [Column("PostalCode")]
        public string PostalCode { get; set; }
        [Column("MobilePhone")]
        public string MobilePhone { get; set; }
        [Column("Email")]
        public string Email { get; set; }
        [Column("UserName")]
        public string UserName { get; set; }
        [Column("Password")]
        public string Password { get; set; }
        [Column("IsAppOwner")]
        public bool IsAppOwner { get; set; }
        [Column("IsActive")]
        public bool IsActive { get; set; }
        [Column("IsDeleted")]
        public bool IsDeleted { get; set; }
        [Column("CompanyName")]
        public string CompanyName { get; set; }
        [Column("IsAllowLogin")]
        public bool IsAllowLogin { get; set; } 
        [Column("CreatedBy")]
        public int CreatedBy { get; set; }
        [Column("CreatedOn")]
        public DateTime CreatedOn { get; set; }
        [Column("UpdatedBy")]
        public int UpdatedBy { get; set; }
        [Column("UpdatedOn")]
        public DateTime UpdatedOn { get; set; }
        [Column("Ip")]
        public string Ip { get; set; }
        [Column("Mac")]
        public string Mac { get; set; }
        [Column("RoleId")]
        public int RoleId { get; set; }
        public UserRole UserRole { get; set; }
        [Column("BillerId")]//for self join
        public int BillerId { get; set; }
        [Column("CustomerGroupId")]
        public int CustomerGroupId { get; set; }
        public CustomerGroup CustomerGroup { get; set; }
    }
    
    public class CustomerGroup
    {
        [Column("CustomerGroupId")]
        public int CustomerGroupId { get; set; }
        [Column("CustomerGroupName")]
        public string CustomerGroupName { get; set; }
    }
    public class UserRole
    {
        [Column("UrId")]
        public int UrId { get; set; }
        [Column("UserId")]
        public int UserId { get; set; }
        [Column("RoleId")]
        public int RoleId { get; set; }
        [Column("RoleName")]
        public string RoleName { get; set; }
    }
    
}
