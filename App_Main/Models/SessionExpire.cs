using App_Utils;
using App_ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace App_Main.Models
{
    public class SessionExpire : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            string ActionName = filterContext.ActionDescriptor.ActionName;
            string ControllerName = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;


            SessionObj session = new SessionObj();
            if (session.currentSession != null)
            {
                //return;
                bool IsAjaxRequest = filterContext.HttpContext.Request.IsAjaxRequest();
                bool IsPartial = filterContext.IsChildAction;
                if (!IsAjaxRequest && !session.currentSession.isAppOwner)
                {
                    var findaction = (from a in session.currentSession.Actions
                                      where a.controllerName == ControllerName
                                      && a.actionName == ActionName
                                      select a
                                      ).FirstOrDefault();
                    if (findaction == null)
                    {
                        filterContext.HttpContext.Response.Redirect("~/Home/AccessDenied");
                    }
                }
            }
            else
            {
                if (ControllerName == "Home")
                {
                    return;
                }
                else
                {
                    filterContext.Result = new RedirectResult("~/Login");
                }
            }

        }


        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            try
            {

                Config config = new Config();
                SessionObj session = new SessionObj();

                string actionName = filterContext.RouteData.Values["action"].ToString().ToLower();
                string controller = filterContext.RouteData.Values["controller"].ToString().ToLower();

                if (session.currentSession != null)
                {
                    //System.Web.HttpContext.Current.Session["error"] = "Current user not found in DIT IVAN";
                    //filterContext.Result = new RedirectResult("~/Login");
                    // If AAD sends a single sign-out message to the app, end the user's session, but don't redirect to AAD for sign out.
                    //HttpContext.Current.GetOwinContext().Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
                    if (!session.currentSession.isAppOwner)
                    {
                        var findaction = (from a in session.currentSession.Actions
                                          where a.controllerName.ToLower() == controller
                                          && a.actionName.ToLower() == actionName
                                          select a
                                      ).FirstOrDefault();

                        if (findaction == null)
                        {
                            filterContext.HttpContext.Response.Redirect("~/Home/AccessDenied");
                            filterContext.Canceled = true;
                        }
                    }
                }
                else
                {
                    filterContext.Canceled = true;
                    filterContext.Result = new RedirectResult("~/Login");
                }

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}