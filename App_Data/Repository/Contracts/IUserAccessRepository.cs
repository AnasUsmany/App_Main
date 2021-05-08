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
    public interface IUserAccessRepository
    {
        List<Policy> getPolicies(bool isDeleted, bool isGrid);

        AjaxResponse deletePolicy(int policyId,bool permanentDelete);

        Policy getPolicyAndDetails(int policyid);

        AjaxResponse SavePolicy(Policy policy);

        List<Roles> GetRoles(bool isDeleted);

        AjaxResponse SaveRoles(Roles Role);

        Roles GetRole(int roleid);

        AjaxResponse DeleteGroup(int roleId, bool permanentDelete);

        Task<List<ViewUsers>> GetUsers(bool? isActive,int take,int skip);

        AjaxResponse SaveUser(Users model);

        Task<Users> getUserAndDetails(int UserId);

        Task<AjaxResponse> DeleteUser(int userId, bool permanentDelete);
    }
}
