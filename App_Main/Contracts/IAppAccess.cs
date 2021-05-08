using App_Utils;
using App_ViewModels;
using App_ViewModels.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace App_Main.Contracts
{
    public interface IAppAccess
    {
        List<AppAccess> GetAllActions(bool? IsActive,bool IsPublic);

        AppAccess GetAction(int actionId);
        
        AjaxResponse SaveAction(Actions model);

        AjaxResponse DeleteAction(int ActionId, bool PermanentDelete);

        List<AppAccess> GetActiveModules(bool? isActive);

        AjaxResponse SaveModule(Modules model);

        AppAccess GetModule(int moduleId);

        AjaxResponse DeleteModule(int moduleId, bool PermanentDelete);
    }
}