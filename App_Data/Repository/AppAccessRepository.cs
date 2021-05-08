using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using App_ViewModels;
using App_Data.Repository.Contracts;
using System.Reflection;
using System.Data;
using App_ViewModels.Models;
using App_Utils;

namespace App_Data.Repository
{
    public class AppAccessRepository : IAppAccessRepository
    {
        public SqlConnection con;

        public AppAccessRepository()
        {
            SetConnection();
        }

        //To Handle connection related activities
        private void SetConnection()
        {
            string constr = Config.ConnectionString;
            con = new SqlConnection(constr);

        }
        
        public List<AppAccess> GetAllActions(bool? isActive, bool isPublic)
        {
            try
            {
                
                var parameters = new { isActive, isPublic };
                con.Open();
                
                var lstActions = SqlMapper.Query<AppAccess>(con, "usp_uaa_GetActions", parameters,commandType: System.Data.CommandType.StoredProcedure);
                con.Close();

                return lstActions as List<AppAccess>;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public AppAccess GetAction(int actionId)
        {
            var parameters = new { actionId};
            con.Open();

            AppAccess actions = SqlMapper.QueryFirstOrDefault<AppAccess>(con, "usp_uaa_GetAction", parameters, commandType: System.Data.CommandType.StoredProcedure);
            con.Close();

            return actions;// as AppAccess;

        }

        public List<AppAccess> GetActiveModules(bool? isActive)
        {
            var parameters = new { isActive };
            con.Open();

            var actions = SqlMapper.Query<AppAccess>(con, "usp_uaa_getActiveModules", parameters, commandType: System.Data.CommandType.StoredProcedure);
            con.Close();

            return actions as List<AppAccess>;
        }

        public AjaxResponse SaveAction(Actions model)
        {
            model.CreatedDate = DateTime.Now;
            model.CreatedBy = 1;
            var parameters = new { model.ActionId,model.ModuleId,model.ActionName, model.ActionTitle,model.ControllerName,model.Description,model.IsActive,model.IsPublic,model.SortNumber,model.CreatedBy,model.CreatedDate };
            con.Open();
            
            AjaxResponse response = new AjaxResponse();
            try
            {
                response = SqlMapper.QueryFirst<AjaxResponse>(con, "usp_uaa_saveAction", parameters, commandType: System.Data.CommandType.StoredProcedure);
                
            }
            catch(Exception ex)
            {
                response.msgType = 2;
                response.msg = ex.Message;
            }
            
            con.Close();

            return response;
        }

        public AjaxResponse DeleteAction(int ActionId, bool PermanentDelete)
        {
            var parameters = new { ActionId, PermanentDelete };
            con.Open();
            AjaxResponse response = new AjaxResponse();
            try
            {
                response = SqlMapper.QueryFirst<AjaxResponse>(con, "usp_uaa_deleteAction", parameters, commandType: System.Data.CommandType.StoredProcedure);

            }
            catch (Exception ex)
            {
                response.msgType = 2;
                response.msg = ex.Message;
            }

            con.Close();

            return response;


        }

        public AjaxResponse SaveModule(Modules model)
        {
            model.CreatedDate = DateTime.Now;
            model.CreatedBy = 1;//sessionuserid
            var parameters = new {model.ModuleId, model.ModuleName, model.IconCode, model.Description, model.IsActive, model.SortNumber, model.CreatedBy, model.CreatedDate };
            con.Open();

            AjaxResponse response = new AjaxResponse();
            try
            {
                response = SqlMapper.QueryFirst<AjaxResponse>(con, "usp_uaa_saveModule", parameters, commandType: System.Data.CommandType.StoredProcedure);

            }
            catch (Exception ex)
            {
                response.msgType = 2;
                response.msg = ex.Message;
            }

            con.Close();

            return response;
        }

        public AppAccess GetModule(int moduleId)
        {
            try
            {
                var param = new {  moduleId };
                con.Open();
                var response = SqlMapper.QueryFirst<AppAccess>(con, "usp_uaa_getModules", param,commandType: CommandType.StoredProcedure);
                con.Close();
                return response as AppAccess;

            }
            catch(Exception ex)
            {
                con.Close();
                throw ex;
            }
        }

        public AjaxResponse DeleteModule(int moduleId, bool permanentDelete)
        {
            AjaxResponse response = new AjaxResponse();
            try
            {
                var param = new { moduleId,permanentDelete };
                con.Open();
                response = SqlMapper.QueryFirst<AjaxResponse>(con, "usp_uaa_deleteModule", param, commandType: CommandType.StoredProcedure);
                con.Close();
                return response;

            }
            catch (Exception ex)
            {
                response.msgType = 2;
                response.msg = ex.Message;
                con.Close();
                throw ex;
            }
        }
    }
}
