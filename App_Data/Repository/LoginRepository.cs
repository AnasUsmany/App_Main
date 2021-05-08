using App_Data.Repository.Contracts;
using App_Utils;
using App_ViewModels;
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
    public class LoginRepository : ILoginRepository
    {
        #region config
        SqlConnection con;
        public LoginRepository()
        {
            SetConnection();
        }
        private void SetConnection()
        {
            string constr = Config.ConnectionString;
            con = new SqlConnection(constr);

        }

        #endregion config

        public async Task<AjaxResponse> Login(LoginViewModel model)
        {
            var Params = new { model.UserName, model.Password };
            try
            {
                await con.OpenAsync();
                var response = await SqlMapper.QueryFirstAsync<AjaxResponse>(con, "usp_uac_Login", Params, commandType: CommandType.StoredProcedure);
                con.Close();
                return response as AjaxResponse;
            }
            catch(Exception ex)
            {
                throw ex;
            }
            

        }

        public async Task<bool> VerifyEmail(string Email)
        {
            var Params = new { Email };
            try
            {
                await con.OpenAsync();
                var isEmail = await SqlMapper.QueryFirstAsync<bool>(con, "SELECT * from dbo.fn_CheckUserEmail(@Email)", Params, commandType: CommandType.Text);
                con.Close();
                return (bool)isEmail;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<int> UpdateUserPassword(string Email, string NewPassword)
        {
            var Params = new { Email,NewPassword };
            try
            {
                await con.OpenAsync();
                var returnid = await SqlMapper.ExecuteAsync(con, "usp_UpdateUserPassword", Params, commandType: CommandType.StoredProcedure);
                con.Close();
                return returnid;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public SessionObj GetUserSession(int userid)
        {
            var parameters = new { userid };
            SessionObj sessionObj = new SessionObj();
            try
            {
                con.Open();
                var SessionDetails = SqlMapper.QueryMultiple(con, "sp_uac_getValuesForSession", parameters, commandType: System.Data.CommandType.StoredProcedure);
                SessionObj obj = SessionDetails.Read<SessionObj>().FirstOrDefault();
                List<SessionModules> lstModules = SessionDetails.Read<SessionModules>().ToList();
                List<SessionActions> lstActions = SessionDetails.Read<SessionActions>().ToList();
                sessionObj = obj;
                sessionObj.Modules = lstModules;
                sessionObj.Actions = lstActions;
                con.Close();
                return sessionObj;
                
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
