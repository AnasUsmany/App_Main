using App_Data;
using App_Data.Repository.Contracts;
using App_Utils;
using App_ViewModels.Models;
using App_Main.Contracts;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using App_ViewModels;

namespace App_Main.Models
{
    public class UserAccessModel : IUserAccess
    {
        private readonly IUserAccessRepository _userAccessRepository;
        public UserAccessModel(IUserAccessRepository userAccessRepository)
        {
            _userAccessRepository = userAccessRepository;
        }

        public AjaxResponse deletePolicy(int policyId, bool permanentDelete) => _userAccessRepository.deletePolicy(policyId, permanentDelete);

        public List<Policy> getPolicies(bool isDeleted, bool isGrid) => _userAccessRepository.getPolicies(isDeleted, isGrid);

        public Policy GetPolicyAndDetails(int policyid) => _userAccessRepository.getPolicyAndDetails(policyid);

        public AjaxResponse SavePolicy(Policy policy) => _userAccessRepository.SavePolicy(policy);

        public List<Roles> GetRoles(bool isDeleted) => _userAccessRepository.GetRoles(isDeleted);

        public AjaxResponse SaveRoles(Roles Role) => _userAccessRepository.SaveRoles(Role);

        public Roles GetRole(int roleid) => _userAccessRepository.GetRole(roleid);

        public AjaxResponse DeleteGroup(int roleId, bool permanentDelete) => _userAccessRepository.DeleteGroup(roleId, permanentDelete);

        public async Task<List<ViewUsers>> GetUsers(bool? isActive,int take,int skip) => await _userAccessRepository.GetUsers(isActive,take,skip);

        public AjaxResponse SaveUser(Users model)
        {
            try
            {
                if (!string.IsNullOrEmpty(model.ProfilePicPath))
                {
                    if (!model.ProfilePicPath.Contains(".png"))
                    {
                        Guid ProfilePicGUID = Guid.NewGuid();
                        string filepath = HttpContext.Current.Server.MapPath(Config.ProfilePicPath) + ProfilePicGUID.ToString() + ".png";
                        File.WriteAllBytes(filepath, Convert.FromBase64String(model.ProfilePicPath));
                        model.ProfilePicPath = ProfilePicGUID + ".png";
                    }
                }
                if (!string.IsNullOrEmpty(model.Password))
                {
                    model.Password = EncryptDecrypt.Encrypt(model.Password);
                }

                AjaxResponse response = new AjaxResponse();
                model.CreatedBy = 1;
                model.CreatedOn = DateTime.Now;
                response = _userAccessRepository.SaveUser(model);
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Users> getUserAndDetails(int UserId) => await _userAccessRepository.getUserAndDetails(UserId);

        public async Task<AjaxResponse> DeleteUser(int userId, bool permanentDelete) => await _userAccessRepository.DeleteUser(userId, permanentDelete);
    }
}