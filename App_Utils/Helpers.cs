using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace App_Utils
{
    public class Helpers
    {
        public static bool SendMail(string emailTo, string subject, string body, bool BodyHTML)
        {
            var fromAddress = new MailAddress("usmanzahid1999@gmail.com");
            var toAddress = new MailAddress(emailTo);
            bool ret = false;
            try
            {
                var smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 25,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress.Address, "Alabala@1999")
                };
                using (var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = BodyHTML
                })
                {
                    smtp.Send(message);
                }
                ret = true;
            }
            catch (Exception ex)
            {
                ret = false;
                string ErrorFile = Config.ErrorLogPath +Guid.NewGuid().ToString() + ".txt";
                File.WriteAllText(ErrorFile, ex.Message + Environment.NewLine + ex.StackTrace);
            }
            return ret;

        }
    }
}
