using App_Data.Repository.Contracts;
using App_Utils;
using App_ViewModels;
using App_ViewModels.Models;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_Data.Repository
{
    public class UserAccessRepository : IUserAccessRepository
    {
        public SqlConnection con;
        public UserAccessRepository()
        {
            SetConnection();
        }
        private void SetConnection()
        {
            string constr = Config.ConnectionString;
            con = new SqlConnection(constr);

        }


        public List<Policy> getPolicies(bool isDeleted, bool isGrid)
        {

            try
            {

                var parameters = new { isDeleted, isGrid };
                con.Open();

                var lstActions = SqlMapper.Query<Policy>(con, "usp_uac_getPolicies", parameters, commandType: System.Data.CommandType.StoredProcedure);
                con.Close();

                return lstActions as List<Policy>;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public AjaxResponse deletePolicy(int policyid, bool permanentDelete)
        {
            AjaxResponse response = new AjaxResponse();
            try
            {
                var parameters = new { policyid, permanentDelete };
                con.Open();
                response = SqlMapper.QueryFirstOrDefault<AjaxResponse>(con, "usp_uac_deletePolicy", parameters, commandType: System.Data.CommandType.StoredProcedure);
                con.Close();

            }
            catch (Exception ex)
            {
                response.msgType = 2;
                response.msg = ex.Message;
            }
            return response as AjaxResponse;
        }

        public Policy getPolicyAndDetails(int policyid)
        {
            try
            {
                var parameters = new { policyid };
                con.Open();
                Policy model = new Policy();

                var PolicyAndDetails_resultsets = SqlMapper.QueryMultiple(con, "usp_uac_getPolicyAndDetails", parameters, commandType: System.Data.CommandType.StoredProcedure);
                if (parameters.policyid == 0)
                {
                    List<PolicyModules> lstModules = PolicyAndDetails_resultsets.Read<PolicyModules>().ToList();
                    List<PolicyActions> lstActions = PolicyAndDetails_resultsets.Read<PolicyActions>().ToList();
                    model.Modules = (lstModules);
                    model.Actions = (lstActions);

                }
                else
                {
                    Policy policy = PolicyAndDetails_resultsets.Read<Policy>().FirstOrDefault();
                    List<PolicyModules> lstModules = PolicyAndDetails_resultsets.Read<PolicyModules>().ToList();
                    List<PolicyActions> lstActions = PolicyAndDetails_resultsets.Read<PolicyActions>().ToList();
                    List<AllowedActionsByModule> lstAllowedActions = PolicyAndDetails_resultsets.Read<AllowedActionsByModule>().ToList();
                    model.Modules = (lstModules);
                    model.Actions = (lstActions);
                    model.AllowedActionsByModule = (lstAllowedActions);
                    model.PolicyId = policy.PolicyId;
                    model.PolicyName = policy.PolicyName;
                    model.Description = policy.Description;
                    model.IsActive = policy.IsActive;
                    model.IsDeleted = policy.IsDeleted;
                    model.CreatedBy = policy.CreatedBy;
                    model.CreatedDate = policy.CreatedDate;
                    model.UpdatedBy = policy.UpdatedBy;
                    model.UpdatedDate = policy.UpdatedDate;
                    model.MacAddress = policy.MacAddress;
                    model.Ip = policy.Ip;
                }

                con.Close();
                return model as Policy;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public AjaxResponse SavePolicy(Policy policy)
        {
            var parameters = new { policy.PolicyId, policy.PolicyName, policy.Description, policy.IsActive };
            AjaxResponse response = new AjaxResponse();
            con.Open();
            try
            {
                response = SqlMapper.QueryFirst<AjaxResponse>(con, "usp_uac_savePolicy", parameters, commandType: System.Data.CommandType.StoredProcedure);
                if (response.msgType == 1)
                {
                    if (policy.Modules != null && policy.Modules.Count > 0)
                    {
                        foreach (var modules in policy.Modules)
                        {
                            AllowModules(response.returnId, modules.ModuleId, con);
                        }
                    }
                    if (policy.Actions != null && policy.Actions.Count > 0)
                    {
                        foreach (var actions in policy.Actions)
                        {
                            AllowActions(response.returnId, actions.ModuleId, actions.ActionId, con);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                response.msgType = 3;
                response.msg = ex.Message;
            }
            con.Close();
            return response as AjaxResponse;
        }

        public static void AllowModules(int policyid, int moduleid, SqlConnection con)
        {
            var parameters = new { policyid, moduleid };

            SqlMapper.QueryFirstOrDefault(con, "usp_uac_policy_AllowModules", parameters, commandType: System.Data.CommandType.StoredProcedure);
        }
        public static void AllowActions(int policyid, int moduleid, int actionid, SqlConnection con)
        {
            var parameters = new { policyid, moduleid, actionid };

            SqlMapper.QueryFirstOrDefault(con, "usp_uac_policy_AllowActions", parameters, commandType: System.Data.CommandType.StoredProcedure);
        }

        public List<Roles> GetRoles(bool isDeleted)
        {
            int? roleid = null;
            var parameters = new { isDeleted, roleid };
            con.Open();
            try
            {

                var lstRoles = SqlMapper.Query<Roles>(con, "usp_uac_getRoles", parameters, commandType: System.Data.CommandType.StoredProcedure);
                con.Close();

                return lstRoles as List<Roles>;

            }
            catch (Exception ex)
            {
                con.Close();
                throw ex;
            }
        }

        public AjaxResponse SaveRoles(Roles Role)
        {
            var parameters = new { Role.RoleId, Role.RoleName, Role.IsActive};
            AjaxResponse response = new AjaxResponse();
            try
            {
                con.Open();
                response = SqlMapper.QueryFirst<AjaxResponse>(con, "usp_uac_saveGroup", parameters, commandType: System.Data.CommandType.StoredProcedure);
                int RoleId = response.returnId;
                if (response.msgType == 1)
                {
                    if (Role.Policies != null && Role.Policies.Count > 0)
                    {
                        foreach (var RolePolicy in Role.Policies)
                        {
                            RolePolicy.Roleid = RoleId;
                            var childparams = new { RolePolicy.Roleid, RolePolicy.Policyid };
                            SqlMapper.QueryFirstOrDefault(con, "usp_SaveRolePolicies", childparams, commandType: System.Data.CommandType.StoredProcedure);
                        }
                    }
                }
                con.Close();
                return response as AjaxResponse;
            }
            catch (Exception ex)
            {
                response.msg = ex.Message;
                response.msgType = 3;
                throw ex;
            }
        }

        public Roles GetRole(int roleid)
        {
            bool? isDeleted = null;
            var parameters = new { isDeleted, roleid };
            try
            {
                con.Open();
                var resultsets = SqlMapper.QueryMultiple(con, "usp_uac_getRoles", parameters, commandType: System.Data.CommandType.StoredProcedure);
                Roles roles = new Roles();
                Roles model = resultsets.Read<Roles>().FirstOrDefault();
                List<RolePolicy> lstPolicy = resultsets.Read<RolePolicy>().ToList();
                roles.Policies = lstPolicy;
                roles.RoleId = model.RoleId;
                roles.RoleName = model.RoleName;
                roles.IsActive = model.IsActive;
                roles.CreatedBy = model.CreatedBy;
                roles.CreatedDate = model.CreatedDate;
                roles.UpdatedBy = model.UpdatedBy;
                roles.UpdatedDate = model.UpdatedDate;
                roles.Mac = model.Mac;
                roles.Ip = model.Ip;
                con.Close();
                return roles as Roles;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public AjaxResponse DeleteGroup(int roleid, bool permanentDelete)
        {
            AjaxResponse response = new AjaxResponse();
            try
            {
                var parameters = new { roleid, permanentDelete };
                con.Open();
                response = SqlMapper.QueryFirstOrDefault<AjaxResponse>(con, "usp_uac_deleteGroup", parameters, commandType: System.Data.CommandType.StoredProcedure);
                con.Close();

            }
            catch (Exception ex)
            {
                response.msgType = 2;
                response.msg = ex.Message;
            }
            return response as AjaxResponse;
        }

        public async Task<List<ViewUsers>> GetUsers(bool? isActive, int take, int skip)
        {
            var parameters = new { isActive ,take,skip};
            try
            {
                con.Open();
                var lstUser = await SqlMapper.QueryAsync<ViewUsers>(con, "usp_GetUsers", parameters, commandType: System.Data.CommandType.StoredProcedure);
                con.Close();
                return lstUser as List<ViewUsers>;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public AjaxResponse SaveUser(Users model)
        {

            var parameters = new
            {
                model.UserId,
                model.ProfilePicPath,
                model.Name,
                model.City,
                model.State,
                model.MobilePhone,
                model.Email,
                model.UserName,
                model.Password,
                model.IsActive,
                model.CreatedBy,
                model.CreatedOn,
                model.Ip,
                model.Mac,
                model.IsAllowLogin
            };
            AjaxResponse response = new AjaxResponse();
            try
            {
                con.Open();
                response = SqlMapper.QueryFirst<AjaxResponse>(con, "usp_SaveUser", parameters, commandType: System.Data.CommandType.StoredProcedure);
                if (response.msgType == 1)
                {

                    UserRole role = new UserRole();
                    role.RoleId = model.RoleId;
                    role.UserId = response.returnId;
                    
                    DeleteInsert_UserGroup(role, con);
                    
                }
            }
            catch (Exception ex)
            {
                response.msgType = 3;
                response.msg = ex.Message;
            }
            con.Close();
            return response as AjaxResponse;

        }
        public static void DeleteInsert_UserGroup(UserRole model, SqlConnection con)
        {
            var parameters = new { model.UserId, model.RoleId };
            SqlMapper.QueryFirstOrDefault(con, "usp_DeleteInsertUserGroup", parameters, commandType: System.Data.CommandType.StoredProcedure);
        }
        

        public async Task<Users> getUserAndDetails(int UserId)
        {
            var parameters = new { UserId };
            try
            {
                con.Open();
                var lstUserAndDetails = await SqlMapper.QueryFirstOrDefaultAsync<Users>(con, "usp_getUserAndDetails", parameters, commandType: CommandType.StoredProcedure);
                con.Close();
                return lstUserAndDetails;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<AjaxResponse> DeleteUser(int userId, bool permanentDelete)
        {
            AjaxResponse response = new AjaxResponse();
            try
            {
                con.Open();
                var parameters = new { userId, permanentDelete };
                response = await SqlMapper.QueryFirstOrDefaultAsync<AjaxResponse>(con, "usp_DeleteUser", parameters, commandType: CommandType.StoredProcedure);
                con.Close();
            }
            catch(Exception ex)
            {
                response.msg = ex.Message;
                response.msgType = 3;
            }

            return response as AjaxResponse;
        }
    }
}
