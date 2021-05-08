using App_Utils;
using App_ViewModels;
using App_ViewModels.Models;
using App_Main.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using App_Data.Repository.Contracts;

namespace App_Main.Models
{
    public class AppAccesModel : IAppAccess
    {
        private readonly IAppAccessRepository _appAccessRepository;
        public AppAccesModel(IAppAccessRepository appAccessRepository)
        {
            _appAccessRepository = appAccessRepository;
        }

        public AjaxResponse DeleteAction(int ActionId, bool PermanentDelete) => _appAccessRepository.DeleteAction(ActionId, PermanentDelete);

        public AjaxResponse DeleteModule(int moduleId, bool permanentDelete) => _appAccessRepository.DeleteModule(moduleId, permanentDelete);

        public AppAccess GetAction(int actionId) => _appAccessRepository.GetAction(actionId);

        public List<AppAccess> GetActiveModules(bool? isActive) => _appAccessRepository.GetActiveModules(isActive);
        

        public List<AppAccess> GetAllActions(bool? IsActive, bool IsPublic) => _appAccessRepository.GetAllActions(IsActive, IsPublic);

        public AppAccess GetModule(int moduleId) => _appAccessRepository.GetModule(moduleId);

        public AjaxResponse SaveAction(Actions model) => _appAccessRepository.SaveAction(model);

        public AjaxResponse SaveModule(Modules model) => _appAccessRepository.SaveModule(model);
    }
}