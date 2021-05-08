using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace App_ViewModels
{
    public class SessionObj
    {

        [Column("userid")]
        public int userid { get; set; }
        [Column("isAppOwner")]
        public bool isAppOwner { get; set; }
        [Column("firstName")]
        public string firstName { get; set; }
        [Column("lastName")]
        public string lastName { get; set; }
        [Column("userName")]
        public string userName { get; set; }
        [Column("ldapUserName")]
        public string ldapUserName { get; set; }
        [Column("ip")]
        public string ip { get; set; }
        [Column("email")]
        public string email { get; set; }
        [Column("currentURL")]
        public string currentURL { get; set; }
        [Column("profilePicGuid")]
        public string profilePicGuid { get; set; }
        [Column("roleName")]
        public string RoleName { get; set; }

        public List<SessionModules> Modules { get; set; }
        public List<SessionActions> Actions { get; set; }


        public virtual SessionObj currentSession
        {
            get
            {
                if (HttpContext.Current != null && HttpContext.Current.Session["DITSession"] != null)
                {
                    return (SessionObj)HttpContext.Current.Session["DITSession"];
                }
                else
                {
                    return null;
                }
            }

        }

    }

    public class SessionModules
    {
        [Column("moduleid")]
        public int moduleid { get; set; }
        [Column("moduleName")]
        public string moduleName { get; set; }
        [Column("iconCode")]
        public string iconCode { get; set; }
    }
    public class SessionActions
    {
        [Column("actionid")]
        public int actionid { get; set; }
        [Column("moduleid")]
        public int moduleid { get; set; }
        [Column("actionName")]
        public string actionName { get; set; }
        [Column("controllerName")]
        public string controllerName { get; set; }
        [Column("sortNumber")]
        public int sortNumber { get; set; }
        [Column("moduleName")]
        public string moduleName { get; set; }
        [Column("iconCode")]
        public string iconCode { get; set; }
        [Column("actionTitle")]
        public string actionTitle { get; set; }
    }
}