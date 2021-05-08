using App_Utils;
using App_ViewModels;
using App_ViewModels.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_Data.Repository.Contracts
{
    public interface IAppAccessRepository
    {
        List<AppAccess> GetAllActions(bool? IsActive, bool IsPublic);

        AppAccess GetAction(int actionId);
        
        AjaxResponse SaveAction(Actions model);

        AjaxResponse DeleteAction(int ActionId,bool PermanentDelete);

        List<AppAccess> GetActiveModules(bool? isActive);

        AjaxResponse SaveModule(Modules model);

        AppAccess GetModule(int moduleId);

        AjaxResponse DeleteModule(int moduleId, bool permanentDelete);
    }
}
