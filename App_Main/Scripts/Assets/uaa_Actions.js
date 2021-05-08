var actions = {
    getDataGrid: function () {
        let obj = {};
        obj["isActive"] = null;
        obj["isPublic"] = false;
        dxDynamicControls.GetData_Post('/AppAccess/GetActions', JSON.stringify(obj),
            function (data) {
                console.log(data);
                actions.CreateGrid(data.data);
            });
    },
    loadModules: function (selectedValues) {
        let folder = {};
        folder.isActive = true;
        dxDynamicControls.GetData_Post('/AppAccess/GetActiveModules', JSON.stringify(folder),
            function (data) {
                actions.loadModulesSuccess(data);
            });
    },
    loadModulesSuccess: function (moduleData) {
        
        const { data } = moduleData;
        let ModuleExpr = { placeHolder: "Select module", valueField: "moduleId", textField: "moduleName", bool_ClearButton: false };

        dxDynamicControls.comboBoxFor('cmbModule', { type: 'array', key: 'moduleId',  data }, 0, ModuleExpr, false, false, "", null, function (e) {
            let pSelectedVal = e.selectedItem != null ? e.selectedItem.moduleId : 0;
            //let pSelectedVal = e.selectedItem.moduleId||0;
        });

    },
    CreateGrid: function (dataobj) {
        $('#dgActions').dxDataGrid({
            dataSource: dataobj,
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
            export: { enabled: true, fileName: "App_Access" },
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
                { dataField: "actionId", caption: "ID" },//, visible: false
                { dataField: "moduleName", caption: "Module" },
                { dataField: "actionName", caption: "Name" },
                { dataField: "actionTitle", caption: "Title" },
                { dataField: "controllerName", caption: "Controller Name" },
                { dataField: "description", caption: "Description" },
                { dataField: "isPublic", caption: "Public" },
                { dataField: "isActive", caption: "Active" },
                {
                    caption: "Action",
                    alignment: "center",
                    cellTemplate: function (container, options) {
                        $("<div>")
                            .append(
                                $("<button>").click(function () {

                                    actions.editAction(options.key.actionId);
                                }).attr("type", "button").attr("id", options.value + "ActionsGridEdit").attr('class', 'grid-action-icon').html('<i class="fa fa-pencil-square-o iconbox" aria-hidden="true"></i>'))
                            .append(
                                $("<button>").click(function () {

                                    if (confirm('Are you sure you want to delete this Action?')) {
                                        actions.deleteAction(options.key.actionId, false);
                                    }
                                }).attr("type", "button").attr("id", options.value + "ActionsGridDelete").attr('class', 'grid-action-icon deleteicon').html('<i class="fa fa-trash-o iconbox" aria-hidden="true"></i'))
                            .appendTo(container);
                    }
                }
            ]
        }).dxDataGrid('instance');
    },
    refreshGrid: function () {
        //$('#btnDeleteSeleced').attr('disabled', 'disabled');
        actions.getDataGrid();
        $('#dgActions').dxDataGrid('instance').refresh();
    },
    clearForm: function () {
        $('#actionid').val('');
        $('#actionName').val('');
        $('#controllerName').val('');
        $('#actionTitle').val('');
        $("#cmbModule").dxSelectBox('instance').option('value', null);
        $('#description').val('');
        $('.modal-title').text('New Action');
        $('#isActive').prop('checked', false);
        $('#isPublic').prop('checked', false);
    },
    saveAction: function () {
        var action = {
            actionId: $('#actionid').val() === '' ? 0 : $('#actionid').val(),
            actionName: $('#actionName').val(),
            actionTitle: $('#actionTitle').val(),
            description: $("#description").val(),
            moduleId: $("#cmbModule").dxSelectBox('instance').option('value'),//get combobox value
            controllerName: $("#controllerName").val(),
            sortNumber: $("#sortNumber").val(),
            isActive: $("#isActive").prop('checked'),
            isPublic: $("#isPublic").prop('checked')

        };
        dxDynamicControls.GetData_Post('/AppAccess/SaveAction', JSON.stringify(action),
            function (data) {
                
                if (data.isSession) {
                    actions.saveActionSuccess(data);
                }
                else {
                    //alert('You have signed out of application');//these things will be in library level
                }
            }
        );

    },

    saveActionSuccess: function (data) {

        actions.refreshGrid();
        ati_common.notify(data.msg, data.msgType);
        if (data.msgType == 1) {
            actions.clearForm();
            $('#newAction').modal('hide');
        }
    },

    editAction: function (actionid) {
        let action = {};
        action["actionId"] = actionid;
        //debugger;
        dxDynamicControls.GetData_Post('/AppAccess/EditAction', JSON.stringify(action),
            function (data) {
                //debugger;
                if (data.data != undefined) {
                    actions.editActionSuccess(data.data);
                }
            }
        );
    },

    editActionSuccess: function (data) {
        $('#actionid').val(data.actionId);
        $('#controllerName').val(data.controllerName);
        $('#actionName').val(data.actionName);
        $('#actionTitle').val(data.actionTitle);
        $('#description').val(data.description);
        $("#isActive").prop('checked', data.isActive);
        $("#isPublic").prop('checked', data.isPublic);
        $('#sortNumber').val(data.sortNumber);
        $('#cmbModule').dxSelectBox('instance').option('value', data.moduleId);
        $('#newAction').modal('show');
    },

    deleteAction: function (actionId, permanentDelete) {
        var action = {};
        action.actionId = actionId;
        action.permanentDelete = permanentDelete;
        //var xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(action), '/AppAccess/DeleteAction', actions.deleteActionSuccess, false);
        dxDynamicControls.GetData_Post('/AppAccess/DeleteAction', JSON.stringify(action),
            function (response) {
                actions.deleteActionSuccess(response);
            }
        )


    },

    deleteActionSuccess: function (data) {
        ati_common.notify(data.msg, data.msgType);
        //modules.modules = $.grep(modules.modules, function (e) {
        //    return e.moduleid != data.data;
        //});
        //$('#confirm-delete').modal('hide');
        actions.refreshGrid();
    },


}