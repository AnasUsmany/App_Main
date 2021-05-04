using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_ViewModels
{

    public class AjaxResponse
    {
        public object data { get; set; }
        public string msg { get; set; }
        public int msgType { get; set; }
        public int returnId { get; set; }
        public bool isSession { get; set; }
    }
}

