using App_Data.Repository;
using App_Data.Repository.Contracts;
using App_Main.Contracts;
using App_ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace App_Main.Models
{
    public class LoginModel:ILogin
    {
        private readonly ILoginRepository _loginRepository;
        public LoginModel(ILoginRepository loginRepository)
        {
            _loginRepository = loginRepository;
        }

        public SessionObj GetUserSession(int userId) => _loginRepository.GetUserSession(userId);

        public async Task<AjaxResponse> Login(LoginViewModel model) => await _loginRepository.Login(model);

        public async Task<int> UpdateUserPassword(string Email, string NewPassword) => await _loginRepository.UpdateUserPassword(Email, NewPassword);

        public async Task<bool> VerifyEmail(string Email) => await _loginRepository.VerifyEmail(Email);
    }
}