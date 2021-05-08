using App_Main.Contracts;
using App_Main.Models;
using App_Utils;
using App_ViewModels;
using App_ViewModels.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace App_Main.Controllers
{
    //[SessionExpire]
    public class AppAccessController : Controller
    {
        private readonly IAppAccess _AppAccess;
        public AppAccessController(IAppAccess AppAccess)
        {
            _AppAccess = AppAccess;
        }
        // GET: AppAccess
        #region modules
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult SaveModules(Modules model)
        {
            AjaxResponse response = new AjaxResponse();
            response = _AppAccess.SaveModule(model);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public JsonResult EditModule(int moduleId)
        {
            AjaxResponse response = new AjaxResponse();
            response.data = _AppAccess.GetModule(moduleId);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteModule(int moduleId,bool permanentDelete)
        {
            AjaxResponse response = new AjaxResponse();
            response = _AppAccess.DeleteModule(moduleId, permanentDelete);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetActiveModules(bool? isActive)
        {
            AjaxResponse response = new AjaxResponse();
            response.data = _AppAccess.GetActiveModules(isActive);
            response.isSession = true;
            response.msg = "success";
            response.msgType = 1;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        #endregion modules

        #region Actions
        public ActionResult Actions()
        {
            //create view and get data here //anas
            return View();
        }
        
        [HttpPost]
        public JsonResult GetActions(bool? isActive, bool isPublic)
        {
            AjaxResponse response = new AjaxResponse();

            response.data = _AppAccess.GetAllActions(isActive, isPublic);
            response.isSession = true;
            response.msg = "success";
            response.msgType = 1;

            return Json(response,JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveAction(Actions model)
        {
            AjaxResponse response = new AjaxResponse();
            response = _AppAccess.SaveAction(model);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult EditAction(int actionId)
        {
            AjaxResponse response = new AjaxResponse();
            response.data = _AppAccess.GetAction(actionId);
            response.isSession = true;
            response.msg = "success";
            response.msgType = 1;

            return Json(response, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult DeleteAction(int actionId, bool permanentDelete)
        {
            AjaxResponse response = new AjaxResponse();
            response = _AppAccess.DeleteAction(actionId, permanentDelete);
            response.isSession = true;
            return Json(response, JsonRequestBehavior.AllowGet);
        }


        #endregion Actions
    }
}