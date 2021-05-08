let emp = {
    CreateControls: function () {
        emp.loadRegions([]);
        emp.loadCompanies([]);
        emp.getDataGrid();
    },
    loadCompanies: function (selectedValues) {
        var group = {};
        group.isActive = true;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/Company/GetCompanies', emp.loadCompaniesSuccess, false, true, selectedValues);
    },
    loadCompaniesSuccess: function (response, selectedValues) {
        const { data } = response;
        var cmbCompanyExpr = { placeHolder: "Choose Company", valueField: "CompanyId", textField: "CompanyName", bool_ClearButton: false };
        let txtCompany = data.map(function (e) { return e.CompanyId; });

        dxDynamicControls.TagBoxFor('ddlCompany', data, txtCompany, cmbCompanyExpr, false, function (e) {
            let pVal = e.value.length > 0 ? e.value : null;
            let companies = pVal !== null ? pVal.join() : "";
            emp.CompanyChange(companies);
        });
    },
    CompanyChange: function (CompanyIds) {
        let sendobj = {};
        sendobj.CompanyIds = CompanyIds;
        dxDynamicControls.GetData_Post('/Regions/GetRegionsByCompanyIds', JSON.stringify(sendobj), function (response) {
            const { data } = response;
            $('#ddlRegion').dxTagBox('instance').option("dataSource", data);
            $('#ddlRegion').dxTagBox('instance').option("value", data.map(function (e) { return e.RegionId; }));
        });
    },
    loadRegions: function (selectedValues) {
        let newSelectedValues = [];
        if (selectedValues !== null) {
            newSelectedValues = selectedValues.map(function (e) { return e.RegionId; });
        }
        var group = {};
        group.isActive = true;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/Regions/GetRegions', emp.loadRegionsSuccess, false, true, newSelectedValues);
    },
    loadRegionsSuccess: function (response, selectedValues) {
        const { data } = response;
        var ddlRegionsExpr = { placeHolder: "Choose Region(s)", valueField: "RegionId", textField: "RegionTitle", bool_ClearButton: false };
        selectedValues = data.map(function (e) { return e.RegionId; });
        dxDynamicControls.TagBoxFor('ddlRegion', data, selectedValues, ddlRegionsExpr, false, function (e) { });
    },
    Search: function () {
        let sendobj = {};
        sendobj.Company = $('#ddlCompany').dxTagBox('instance').option("value").join();
        sendobj.Region = $('#ddlRegion').dxTagBox('instance').option("value").join();
        dxDynamicControls.GetData_Post('/Employees/GetEmployeesByCompanyAndRegions', JSON.stringify(sendobj), function (response) {
            $('#dgEmployees').dxDataGrid('instance').option("dataSource", response);
           
        });
    },
    getDataGrid: function () {
        
        dxDynamicControls.GetData_GET('/Employees/GetAllEmployees',  emp.CreateGrid);

        
    },
    CreateGrid: function (data) {
        //
        $('#dgEmployees').dxDataGrid({
            dataSource: data,
            keyExpr: 'UserId',
            showBorders: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            columnChooser: {
                enabled: true,
                mode: 'select'
            },
            columnFixing: {
                enabled: true
            },
            export: { enabled: true, fileName: "Users" },
            onExporting: function (e) {
                e.component.beginUpdate();
                e.component.columnOption("Action", "visible", false);
            },
            onExported: function (e) {
                e.component.columnOption("Action", "visible", true);
                e.component.endUpdate();
            },
            rowAlternationEnabled: false,
            remoteOperations: {
                sorting: true,
                paging: true
            },
            showColumnLines: false,
            showRowLines: true,
            wordWrapEnabled:true,
            loadPanel: { enabled: true },
            paging: { pageSize: 50 },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [25, 50, 100],
                showInfo: true
            },
            searchPanel: { width: 280, placeholder: "Search", visible: true },

            onToolbarPreparing: function (e) {
                var toolbarItems = e.toolbarOptions.items;
                var searchPanel = $.grep(toolbarItems, function (item) {
                    return item.name === "searchPanel";
                })[0];
                searchPanel.location = "before";
            },
            columns: [

                { dataField: "FirstName", width: '10%'},
                { dataField: "LastName", width: '10%' },
                { dataField: "regionTitle", caption: "Location(s)", width: '50%' },
                { dataField: "roleName", width: '10%'},
                { dataField: "IsActive", caption: "Active", width: '10%' },
                {
                    caption: "Action",
                    width: '10%',
                    alignment: "center",
                    cellTemplate: function (container, options) {
                        $("<div>")
                            .append(
                                $("<button>").click(function () {
                                window.open('/UserAccess/EditUser/' + options.key + '?View=1');
                                }).attr("type", "button").attr("id", options.key + "_EditIncompleteGrid").attr('class', 'grid-action-icon').html('<i class="fa fa-eye iconbox" aria-hidden="true"></i>'))
                           .appendTo(container);
                    }
                }
            ]
        }).dxDataGrid('instance');
    },
    toggleFilter: function () {
        $('#empfilter').toggle();
    }
}