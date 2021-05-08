using App_Main.Contracts;
using App_Main.Models;
using App_Utils;
using App_ViewModels;
using App_ViewModels.Models;
using App_ViewModels.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace IVAN_MVC.Controllers
{
    //[SessionExpire]
    public class UserAccessController : Controller
    {
        private readonly IUserAccess _userAccess;
       

        public UserAccessController(IUserAccess userAccess)
        {
            _userAccess = userAccess;
        }
        // GET: UserAccess
        public ActionResult Index()
        {
            return View();
        }
        #region policy

        public ActionResult Policies()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetPolicies(bool isDeleted, bool isGrid)
        {
            AjaxResponse response = new AjaxResponse();
            response.data = _userAccess.getPolicies(isDeleted, isGrid);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Policy()
        {
            return View();
        }
        //[HttpPost]
        //public ActionResult RestorePolicy(int policyid)
        //{
        //    JsonResult result = new JsonResult();
        //    response = model.RestorePolicy(policyid);
        //    result.Data = response;
        //    result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
        //    return result;
        //}
        [HttpPost]
        public JsonResult SavePolicy(App_ViewModels.Models.Policy model)
        {
            AjaxResponse response = new AjaxResponse();
            response = _userAccess.SavePolicy(model);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult DeletePolicy(int policyid, bool permanentDelete)
        {
            AjaxResponse response = new AjaxResponse();
            response = _userAccess.deletePolicy(policyid, permanentDelete);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult NewPolicy()
        {
            AjaxResponse response = new AjaxResponse();
            response.data = _userAccess.GetPolicyAndDetails(0);
            response.isSession = true;

            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public ActionResult EditPolicy(int id)
        {
            App_ViewModels.Models.Policy model = new App_ViewModels.Models.Policy();
            model = _userAccess.GetPolicyAndDetails(id);
            return View("Policy", model);
        }


        #endregion policy

        #region Groups

        public ActionResult Groups()
        {
            return View();
        }
        public JsonResult GetGroups(bool isDeleted)
        {
            AjaxResponse response = new AjaxResponse();
            response.data = _userAccess.GetRoles(isDeleted);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveGroup(Roles model)
        {
            AjaxResponse response = new AjaxResponse();
            response = _userAccess.SaveRoles(model);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetGroup(int RoleId)
        {
            AjaxResponse response = new AjaxResponse();
            response.data = _userAccess.GetRole(RoleId);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteGroup(int RoleId, bool PermanentDelete)
        {
            AjaxResponse response = new AjaxResponse();
            response = _userAccess.DeleteGroup(RoleId, PermanentDelete);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        #endregion Groups

        #region Users
        public ActionResult Users()
        {
            return View();
        }

        public ActionResult NewUser()
        {
            return View();
        }

        public async Task<ActionResult> EditUser(int id)
        {
            Users model = new Users();
            model = await _userAccess.getUserAndDetails(id);
            return View("NewUser",model);
        }

        public async Task<JsonResult> GetUsers(DxLoadOptions filters, int TotalRows)
        {
            SessionObj session = (SessionObj)Session["DITSession"];
            List<ViewUsers> viewUsers = new List<ViewUsers>();
            DataSet oDS = new DataSet();
            
            if (filters.filter != null)
            {
                if (filters.filter.Count > 0)
                {
                    string where = string.Empty;
                    if (filters.filter != null)
                    {
                        foreach (GridFilter item in filters.filter)
                        {
                            if (where != string.Empty)
                            {
                                if (where.Contains(">=") || where.Contains("<="))
                                {
                                    //where += " AND ";
                                }
                                else
                                {
                                    where += " OR ";
                                }
                                //where += " OR ";
                            }
                            if (item.oprt == "contains")
                            {
                                where += item.columnName + " Like '%" + item.value + "%'";
                            }
                            else if (item.oprt == "=")
                            {
                                where += item.columnName + " = '" + item.value + "'";
                            }
                            else if (item.oprt == "<>")//anas
                            {
                                where += item.columnName + " <> '" + item.value + "'";
                            }
                            else if (item.oprt == ">=" || item.oprt == "<" || item.oprt == "<=")
                            {
                                string expr = item.oprt == "<" ? "<=" : item.oprt;
                                if (expr != "<" && expr != "<=")
                                {
                                    where += item.columnName + " " + expr + " '" + item.value.Substring(0, 10) + "'";
                                }
                            }
                        }
                    }

                    viewUsers = await _userAccess.GetUsers(null,TotalRows, 0);
                    DataTable oDT = common.ToDataTable<ViewUsers>(viewUsers);
                    DataRow[] rows = oDT.Select(where);
                    if (rows.Length > 0)
                    {
                        oDS.Tables.Add(rows.CopyToDataTable());
                    }
                    if (oDS.Tables.Count > 0)
                    {
                        viewUsers = common.ConvertToList<ViewUsers>(oDS.Tables[0]);
                    }
                    else
                    {
                        viewUsers.Clear();
                    }
                }
            }
            else
            {
                if (filters.sort != null && filters.sort.Count > 0)
                {
                    viewUsers = await _userAccess.GetUsers(null, filters.take, filters.skip);
                    DataTable dt = common.ToDataTable(viewUsers);
                    DataView dvData = new DataView(dt);
                    foreach (Sort item in filters.sort)
                    {
                        string sortcmd = item.selector;
                        if (item.desc)
                        {
                            sortcmd += " " + "desc";
                        }
                        else
                        {
                            sortcmd += " " + "asc";
                        }
                        dvData.Sort = sortcmd;
                    }
                    DataTable dtCopy = new DataTable();
                    dtCopy = dvData.ToTable();
                    oDS.Clear();
                    oDS.Tables.Add(dtCopy);
                    viewUsers = common.ConvertToList<ViewUsers>(oDS.Tables[0]);
                }
                else
                {
                    viewUsers = await _userAccess.GetUsers(null, filters.take, filters.skip);
                }
            }
            return Json(viewUsers, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveUser(Users model)
        {
            AjaxResponse response = new AjaxResponse();
            response = _userAccess.SaveUser(model);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> DeleteUser(int UserId)
        {
            AjaxResponse response = new AjaxResponse();
            
            response = await _userAccess.DeleteUser(UserId, false);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        #endregion Users

    }
}