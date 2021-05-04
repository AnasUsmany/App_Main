using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_Utils
{
    public class Config
    {
        public static string appVersion
        {
            get
            {
                return ConfigurationManager.AppSettings["AppVersion"].ToString();
            }
        }

        public static string ConnectionString
        {
            get
            {
                return ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
            }
        }
        
        public static string EncryptionKey
        {
            get
            {
                return ConfigurationManager.AppSettings["EncKey"].ToString();
            }
        }
        public static string ErrorLogPath
        {
            get
            {
                return ConfigurationManager.AppSettings["ErrorLogPath"].ToString();
            }
        }
    }
}
