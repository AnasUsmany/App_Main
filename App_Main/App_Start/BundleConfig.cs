using App_Main.App_Start;
using System.Web;
using System.Web.Optimization;

namespace App_Main
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));
            bundles.Add(new ScriptBundle("~/bundles/dxjs").Include(
                      "~/Scripts/dx.all.js"
                      ));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      //"~/Scripts/popper.js",
                      "~/Scripts/toastr.min.js"//,
                      //"~/Scripts/bootsrap-datetimePicker.min.js",
                      //"~/Scripts/daterangepicker.min.js",
                      //"~/Scripts/moment.min.js"
                      
                      ));

            bundles.Add(new ScriptBundle("~/bundles/commonjs").Include(
                      "~/Scripts/plugins/dxDynamicControls.js",
                      "~/Scripts/plugins/ajaxHelper.js",
                      "~/Scripts/plugins/ati_common.js"
                      ).WithLastModifiedToken());


            #region common css
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/toastr.min.css",
                      "~/Content/Site.css")
            );


            bundles.Add(new StyleBundle("~/Content/dxcss").Include(
                      "~/Content/dx.common.css",
                      "~/Content/dx.light.css"

                      ));

            bundles.Add(new StyleBundle("~/Content/sitecss").Include(
                      "~/Content/Assets/style.css"

                      ));

            #endregion comomon css
        }
    }
}
