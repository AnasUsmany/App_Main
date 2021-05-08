var modules = {
    getDataGrid: function () {
        let folder = {};
        folder.isActive = null;
        dxDynamicControls.GetData_Post('/AppAccess/GetActiveModules', JSON.stringify(folder),
            function (data) {
                modules.CreateGrid(data);
            });
    },
    CreateGrid: function (data_modules) {
        const { data } = data_modules
        $('#dgModules').dxDataGrid({
            dataSource: data,
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
            export: { enabled: true, fileName: "App_Access_Modules" },
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
                { dataField: "moduleId", caption: "ID" },//, visible: false
                { dataField: "moduleName", caption: "Name" },
                { dataField: "description", caption: "Description" },
                { dataField: "isActive", caption: "Active" },
                {
                    caption: "Action",
                    alignment: "center",
                    cellTemplate: function (container, options) {
                        $("<div>")
                            .append(
                                $("<button>").click(function () {
                                    modules.editModule(options.key);
                                }).attr("type", "button").attr("id", options.key + "_EditIncompleteGrid").attr('class', 'grid-action-icon').html('<i class="fa fa-pencil-square-o iconbox" aria-hidden="true"></i>'))
                            .append(
                                $("<button>").click(function () {

                                    if (confirm('Are you sure you want to delete this Procedure?')) {
                                        modules.deleteModule(options.key, false);
                                    }
                                }).attr("type", "button").attr("id", options.key + "").attr('class', 'grid-action-icon deleteicon').html('<i class="fa fa-trash-o iconbox" aria-hidden="true"></i'))
                            .appendTo(container);
                    }
                }
            ]
        }).dxDataGrid('instance');
    },
    clearForm: function () {
        $('#moduleId').val('');
        $('#moduleName').val('');
        $('#iconCode').val('');
        $('#description').val('');
        $('.modal-title').text('New Module');
    },
    saveModule: function () {
        let module = {
            moduleId: $('#moduleId').val() == '' ? 0 : $('#moduleId').val(),
            moduleName: $('#moduleName').val(),
            iconCode: $('#iconCode').val(),
            description: $("#description").val(),
            sortNumber : $("#sortNumber").val(),
            isActive: $("#isActive").prop('checked')
        };

        dxDynamicControls.GetData_Post('/AppAccess/SaveModules', JSON.stringify(module),
            function (data) {
                modules.saveModulesSuccess(data);
            });
    },
    saveModulesSuccess: function (data) {

        modules.getDataGrid();
        ati_common.notify(data.msg, data.msgType);
        if (data.msgType == 1) {
            $('#newModule').modal('hide');
            modules.clearForm();
        }
    },
    refreshGrid: function () {
        $('#btnDeleteSeleced').attr('disabled', 'disabled');
        $('#dgModules').dxDataGrid('instance').refresh();
    },
    editModule: function (editdata_Module) {
        var module = {};
        module["moduleId"] = editdata_Module.moduleId;
        dxDynamicControls.GetData_Post('/AppAccess/EditModule', JSON.stringify(module), function (response) {
            modules.editModuleSuccess(response);
        })
    },

    editModuleSuccess: function (data) {

        data = data.data;
        $('#moduleId').val(data.moduleId);
        $('#moduleName').val(data.moduleName);
        $('#iconCode').val(data.iconCode);
        $('#description').val(data.description);
        $('#sortNumber').val(data.sortNumber);
        $("#isActive").prop('checked', data.isActive);
        $('#newModule').modal('show');

    },

    deleteModule: function (deletedata_module, permanentDelete) {
        var module = {};
        module.moduleId = deletedata_module.moduleId;
        module.permanentDelete = permanentDelete;
        dxDynamicControls.GetData_Post('/AppAccess/DeleteModule', JSON.stringify(module), function (response) {
            modules.deleteModuleSuccess(response);
        });
    },

    deleteModuleSuccess: function (data) {
        ati_common.notify(data.msg, data.msgType);
        modules.getDataGrid();
    },
    deleteMultiple: function () {
        var selectedItems = $('#gridModules').dxDataGrid('instance').getSelectedRowKeys();
        if (selectedItems.length == 0) {
            $('#confirm-delete').modal('hide');
            ati_common.notify("Please select modules to delete!", 3);
        }
        else {
            var module = {};
            module['modules'] = $('#gridModules').dxDataGrid('instance').getSelectedRowsData();;
            var xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(module), '/AppAccess/MultiDeleteModule', modules.deleteMultipleSuccess, false, true);
        }
    },

    deleteMultipleSuccess: function (data) {

        ati_common.notify(data.msg, data.msgType);
        //$('#confirm-delete').modal('hide');
        modules.refreshGrid();
    },


}