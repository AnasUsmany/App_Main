using App_ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_Data.Repository.Contracts
{
    public interface ILoginRepository
    {
        Task<AjaxResponse> Login(LoginViewModel model);
        Task<bool> VerifyEmail(string Email);
        Task<int> UpdateUserPassword(string Email, string NewPassword);
        SessionObj GetUserSession(int userId);
    }
}
