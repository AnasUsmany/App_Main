let uac_Roles = {

    getDataGrid: function () {
        let obj = {};
        obj["isDeleted"] = false;
        dxDynamicControls.GetData_Post('/UserAccess/GetGroups', JSON.stringify(obj),
            function (dataobject) {
                const { data } = dataobject;
                uac_Roles.createGrid(data);
            });
    },
    createGrid(data_roles) {

        let dgGroups = $("#dgRoles").dxDataGrid({
            dataSource: data_roles,
            keyExpr: "RoleId",
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
                { dataField: "RoleId", caption: "ID" },//, visible: false
                "RoleName",
                { dataField: "LdapGroupName", caption: "Ad Group Name" },
                { dataField: "IsActive", caption: "Active"},
                {
                    caption: "Action",
                    alignment: "center",
                    dataField: "RoleId",
                    cellTemplate: function (container, options) {
                        $("<div>")
                            .append(
                                $("<button>").click(function () {

                                uac_Roles.EditRole(options.value);
                                }).attr("type", "button").attr("id", options.value + "GroupsGridEdit").attr('class', 'grid-action-icon').html('<i class="fa fa-pencil-square-o iconbox" aria-hidden="true"></i>'))
                            .append(
                                $("<button>").click(function () {

                                if (confirm('Are you sure you want to delete this Role?')) {
                                    uac_Roles.DeleteGroup(options.value, false);
                                    }
                            }).attr("type", "button").attr("id", options.value + "GroupsGridDelete").attr('class', 'grid-action-icon deleteicon').html('<i class="fa fa-trash-o iconbox" aria-hidden="true"></i'))
                            .appendTo(container);
                    }
                }
            ]

        }).dxDataGrid('instance');


    },
    loadPolicies: function (selectedValues) {
        var group = {};
        group.isDeleted = false;
        group.isGrid = false;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/UserAccess/GetPolicies', uac_Roles.loadPoliciesSuccess, false, true, selectedValues);
    },
    loadPoliciesSuccess: function (response, selectedValues) {
        
        const { data } = response;
        var ddlPolicyExpr = { placeHolder: "Choose Policy(s)", valueField: "policyid", textField: "policyName", bool_ClearButton: false };
        dxDynamicControls.TagBoxFor('cmbPolicy', data, selectedValues, ddlPolicyExpr, false, function (e) {});
        
    },
    clearForm: function () {
        $('#RoleId').val('');
        $('#RoleName').val('');
        $('#LdapGroupName').val('');
        $("#cmbPolicy").dxTagBox('instance').option('value', []);
        $("#RoleFrom").val('');
        $('.modal-title').text('New Group');
    },
    saveRole: function() {
        let Role = {};
        Role.RoleId = $('#RoleId').val() === '' ? 0 : $('#RoleId').val();
        Role.RoleName = $('#RoleName').val();
        Role.LdapGroupName = $("#LdapGroupName").val();
        Role.IsActive = $("#IsActive").prop('checked');
        Role.RoleFrom = $("#RoleFrom").val();
        Role.policies = $("#cmbPolicy").dxTagBox('instance').option('selectedItems');
        let xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(Role), '/UserAccess/SaveGroup', uac_Roles.saveRoleSuccess, false, true);
    },
    saveRoleSuccess: function (data) {

        uac_Roles.getDataGrid();
        ati_common.notify(data.msg, data.msgType);
        uac_Roles.clearForm();
        $('#newGroup').modal('hide');
    },
    EditRole: function (roleid) {
        let Role = {};
        Role.RoleId = roleid;
        let xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(Role), '/UserAccess/GetGroup', uac_Roles.EditRoleSuccess, false, true);
    },
    EditRoleSuccess: function (dataobject) {
        debugger;
        const { data } = dataobject;
        $('#RoleId').val(data.RoleId);
        $('#RoleName').val(data.RoleName);
        $('#LdapGroupName').val(data.LdapGroupName);
        data.IsActive == true ? $("#IsActive").prop('checked') : $("#IsActive").prop('unchecked');
        let arrayobject = data.Policies;
        let result = arrayobject.map(a => a.policyid);
        $("#cmbPolicy").dxTagBox('instance').option('value', result);
        $("#RoleFrom").val(data.RoleFrom);
        $('.modal-title').text('Edit Group');
        $("#newGroup").modal('show');
    },
    DeleteGroup: function (roleid, permanentDelete) {
        let Role = {};
        Role.RoleId = roleid;
        Role.PermanentDelete = permanentDelete;
        let xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(Role), '/UserAccess/DeleteGroup', uac_Roles.DeleteGroupSuccess, false, true);
    },
    DeleteGroupSuccess: function (dataobject) {
        ati_common.notify(dataobject.msg, dataobject.msgType);
        uac_Roles.getDataGrid();
    }
}