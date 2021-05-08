using App_Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace App_Main.App_Start
{
    public static class BundleExtension
    {
        public static Bundle WithLastModifiedToken(this Bundle sb)
        {
            sb.Transforms.Add(new LastModifiedBundleTransform());
            return sb;
        }

        public class LastModifiedBundleTransform : IBundleTransform
        {
            public void Process(BundleContext context, BundleResponse response)
            {
                foreach (var file in response.Files)
                {
                    string version = Config.appVersion;
                    file.IncludedVirtualPath = string.Concat(file.IncludedVirtualPath, "?v=", version);
                }
            }
        }
    }
}