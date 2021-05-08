using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App_ViewModels
{
    public class DxLoadOptions
    {
        public List<GridFilter> filter { get; set; }
        public List<Sort> sort { get; set; }
        public bool requireTotalCount { get; set; }
        public int skip { get; set; }
        public int take { get; set; }
        public string orderby { get; set; }
        public string searchExpr { get; set; }
        public string searchOperation { get; set; }
        public string searchValue { get; set; }
    }
    public class Sort
    {
        public string selector { get; set; }
        public bool desc { get; set; }
    }
    public class GridFilter
    {
        public string columnName { get; set; }
        public string oprt { get; set; }
        public string value { get; set; }
        public int columnIndex { get; set; }
    }
}
