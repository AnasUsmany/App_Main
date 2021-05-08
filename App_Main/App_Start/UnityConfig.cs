using App_Data.Repository;
using App_Data.Repository.Contracts;
using App_Main.Contracts;
using App_Main.Models;
using System.Web.Mvc;
using Unity;
using Unity.Mvc5;

namespace App_Main
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();

            container.RegisterType<IAppAccessRepository, AppAccessRepository>();
            container.RegisterType<IAppAccess, AppAccesModel>();

            container.RegisterType<IUserAccessRepository, UserAccessRepository>();
            container.RegisterType<IUserAccess, UserAccessModel>();

            container.RegisterType<ILoginRepository, LoginRepository>();
            container.RegisterType<ILogin, LoginModel>();

            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
        }
    }
}