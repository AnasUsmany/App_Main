using App_Main.Contracts;
using App_Utils;
using App_ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace App_Main.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILogin _Login;
        public LoginController(ILogin login)
        {
            _Login = login;
        }
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> Loginclick(LoginViewModel model)
        {
            AjaxResponse data = new AjaxResponse();
            try
            {
                model.Password = EncryptDecrypt.Encrypt(model.Password);
                data = await _Login.Login(model);
                if (data.msgType == 1)
                {
                    CreateUserSession(data.returnId);
                }
            }
            catch (Exception ex)
            {
                Session.Clear();
                data.msg = "Login Error";
                data.msgType = 2;
                throw ex;

            }

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        private void CreateUserSession(int userId)
        {
            SessionObj session = _Login.GetUserSession(userId);
            Session["DITSession"] = session;
        }

        
        [HttpPost]
        public async Task<JsonResult> ResetPassword(string Email)
        {
            try
            {
                bool verified = await VerifyEmail(Email);
                if (!verified)
                {
                    return Json("Email not registered in IVAN", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    string newPassword = Guid.NewGuid().ToString("n").Substring(0, 8);

                    await _Login.UpdateUserPassword(Email, EncryptDecrypt.Encrypt(newPassword));

                    string Mailtext = "Hi," + Environment.NewLine;
                    Mailtext += "Your new IVAN password is:" + Environment.NewLine;
                    Mailtext += newPassword;

                    Helpers.SendMail(Email, "Reset Password Notification", Mailtext, false);
                    return Json("New password has been sent to your email.", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        private Task<bool> VerifyEmail(string email)
        {
            return _Login.VerifyEmail(email);
        }

        public ActionResult Logout()
        {
            Session.Clear();
            return RedirectToAction("Login");
        }
    }
}