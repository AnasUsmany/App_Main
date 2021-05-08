var dit_uac_policy = {
    selectedActions: [],
    Actions: [],
    Modules: [],
    policies: [],
    deletedPolicies: [],
    checkedActionsCount: 0,
    PartiallYSelectedModules: [],
    getDataGrid: function (deletedIndicator) {
        let policy = {};
        policy.isDeleted = deletedIndicator;
        policy.isGrid = true;
        dxDynamicControls.GetData_Post('/UserAccess/GetPolicies', JSON.stringify(policy),
            function (dataobj) {
                const { data } = dataobj;
                dit_uac_policy.CreateGrid(data);
            });
    },
    CreateGrid: function (data) {
        
        $('#dgPolicies').dxDataGrid({
            dataSource: data,
            keyExpr: 'policyid',
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
            export: { enabled: true, fileName: "User_Access_Policies" },
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
            selection: {
                mode: "multiple"
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
                { dataField: 'policyid', caption: "ID", sortOrder: 'desc', width: "8%", alignment: "left" },
                { dataField: "policyName", caption: "Policy Name" },
                { dataField: "description", caption: "Description" },
                { dataField: "isActive", caption: "Active" },
                {
                    caption: "Action",
                    alignment: "center",
                    cellTemplate: function (container, options) {
                        $("<div>")
                            .append(
                                $("<button>").click(function () {
                                    window.open('/UserAccess/EditPolicy/' + options.key);
                                }).attr("type", "button").attr("id", options.key + "ActionsGridEdit").attr('class', 'grid-action-icon').html('<i class="fa fa-pencil-square-o iconbox" aria-hidden="true"></i>'))
                            .append(
                                $("<button>").click(function () {

                                    if (confirm('Are you sure you want to delete this Policy ?')) {
                                        dit_uac_policy.deletePolicy(options.key, false);
                                    }
                                }).attr("type", "button").attr("id", options.key + "ActionsGridDelete").attr('class', 'grid-action-icon deleteicon').html('<i class="fa fa-trash-o iconbox" aria-hidden="true"></i'))
                            .appendTo(container);
                    }
                }
            ]
        }).dxDataGrid('instance');
    },
    init: function (model) {
        var policyid = $('#policyid').val();
        if (policyid == "" || policyid == '0') {
            dit_uac_policy.bindTabsNew();
        }
        else {
            dit_uac_policy.bindTabsOnEdit(model);
        }

        //____________________Tabs Click___________________________________
        $(document).on('click', '.policyTabs', function () {
            
            dit_uac_policy.openTab(this);
        });

        


        //_______________All modules Check Box Click__________________________
        $('#dvTab').on('change', '.chkBox_Modules', function () {
            
            var selector = '#hidCheckedModules';
            dit_uac_policy.fillHidSelModules(selector, this);
            dit_uac_policy.rmvActionsOnModulesDeselect(this);
            if ($(this).is(":checked"))
                dit_uac_policy.pushActionsOnModuleSelection($(this).attr("moduleid"))
        });

        //_______________Individual modules Check Box Click__________________________
        $('#dvTab').on('change', '.chkBox', function () {
            debugger;
            var actionid = $(this).attr('actionid');
            var selector = '#hidCheckedActions';
            var moduleid = $('#tabs .active').attr('moduleid');
            dit_uac_policy.SelectActionsByModule(this, moduleid);
            dit_uac_policy.checkModulesForFullControl(moduleid)
        });

        
    },

    bindTabsNew: function () {
        var xhr = ajaxHelper.ajaxGetJson('/UserAccess/NewPolicy', dit_uac_policy.bindTabsNewSuccess, false, true);
    },

    bindTabsNewSuccess: function (data) {
        
        var modules = data.modules;
        dit_uac_policy.Actions = data.actions;
        dit_uac_policy.Modules = data.modules;
        $("#tabs ul").append('<li class = "policyTabs active" name = "AllModules"><a><i class="fa fa-accordian" aria-hidden="true"></i><span>All Modules</span></a></li>');
        for (var i = 0; i < modules.length; i++) {
            $("#tabs ul").append('<li class = "policyTabs" moduleid = "' + modules[i].moduleid + '"><a><i class = "' + modules[i].iconCode + '"></i><span>' + modules[i].moduleName + '</span></a></li>');
        }
        dit_uac_policy.bindAllModules(modules);
        
    },

    bindTabsOnEdit: function (model) {
        if (model.policyid != "" && model.policyid != 0) {
            var temp = [];
            var partiallySelModules = [];
            dit_uac_policy.Actions = model.actions;
            dit_uac_policy.Modules = model.modules;
            var modules = model.modules;
            var actions = model.actions;
            var actionCountModuleWise = model.allowedActionsByModule;
            $("#tabs ul").append('<li class = "policyTabs list-group-item " name = "AllModules"><a><i class="fa fa-accordian" aria-hidden="true"></i><span>All Modules</sapn></a></li>');
            //______________Create Tabs___________________________
            for (var i = 0; i < modules.length; i++) {
                //$("#tabs ul").append('<li class = "policyTabs" moduleid = "' + modules[i].moduleid + '"><a>' + modules[i].moduleName + '</a></li>');
                $("#tabs ul").append('<li class = "policyTabs list-group-item" moduleid = "' + modules[i].moduleid + '"><a><i class = "' + modules[i].iconCode + '"></i><span>' + modules[i].moduleName + '</span></a></li>');

                if (modules[i].pmid != 0) {
                    temp.push(modules[i].moduleid);
                }
            }
            if (actionCountModuleWise != null) {
                for (var i = 0; i < actionCountModuleWise.length; i++) {
                    if (actionCountModuleWise[i].allowedActions < actionCountModuleWise[i].totalActions) {
                        dit_uac_policy.PartiallYSelectedModules.push(actionCountModuleWise[i].moduleid);
                    }
                }
            }

            $('#hidCheckedModules').val(temp.join(','))
            dit_uac_policy.bindAllModules(modules);

            //__________________set selected action of a policy on Eidt_____________
            temp = [];
            var actions = model.actions;
            for (var i = 0; i < actions.length; i++) {
                if (actions[i].paid != 0) {
                    temp.push(actions[i]);
                }
            }
            dit_uac_policy.selectedActions = temp;
        }
    },

    openTab: function (thisTab) {
        
        var name = $(thisTab).attr('name');
        var moduleid = $(thisTab).attr('moduleid');
        $('.policyTabs').removeClass('active');
        $(thisTab).addClass('active');
        if (name == 'AllModules') {
            var modules = dit_uac_policy.Modules;
            if (modules != "") {
                modules = modules;
                dit_uac_policy.bindAllModules(modules);
            }
        }
        else {
            dit_uac_policy.bindActionsByModule(moduleid);
        }
    },

    getData: function (deletedIndicator) {
        var getPolicies = new DevExpress.data.CustomStore({
            load: function () {
                var d = new $.Deferred();
                $.ajax({
                    url: '/UserAccess/GetPolicies',
                    async: false,
                    type: 'post',
                    data: { isDeleted: deletedIndicator, isGrid: true },
                    success: function (result) {
                        if (!deletedIndicator) {
                            dit_uac_policy.deletedPolicies = result;
                        }
                        else {
                            dit_uac_policy.policies = result;
                        }
                        d.resolve(
                            result
                        );
                    },
                    error: function () {
                        d.reject("Data Loading Error");
                    },
                    timeout: 5000
                });
                return d.promise();
            }
        });
        return getPolicies;
    },
    
    bindAllModules: function (data) {
        
        $('#dvTab').dxDataGrid({
            width: '100%',
            dataSource: data,   //______Set Data for Grid
            columns: [
                {
                    width: '3%',
                    cellTemplate: function (container, options) {
                        $("<div>")
                            .append($('<label class="checkbox-inline i-checks"><input type="checkbox" moduleid=' + options.key.moduleid +
                                ' class="chkBox_Modules" ><i></i></label>'))
                            .appendTo(container);

                    },
                }, { dataField: 'moduleid', visible: false, sortOrder: 'desc' }, 'moduleName', 'description'
            ],
            showColumnLines: false,
            rowAlternationEnabled: true,
            loadPanel: { enabled: true },
            paging: { pageSize: 20 },//_____set Default Page Size
            pager: { allowedPageSizes: [20, 40, 60, 80], showNavigationButtons: true, showPageSizeSelector: true, },//_____set Pager Properties
            searchPanel: { width: 250, placeholder: "Search", visible: true },
            onContentReady: function (e) { _setModulesChecked(); _setModulesPartiallySelected(); } //Select Rows if already selected or in Edit Mode
        }).dxDataGrid("instance");

        //__________Keep selected All Modules on Load__________________
        function _setModulesChecked() {
            
            var selectedRows = $('#hidCheckedModules').val().split(',');
            if ($('#hidCheckedModules').val() != '') {
                for (var i = 0; i < selectedRows.length; i++) {
                    if (selectedRows[i] != "")
                        $('input[moduleid=' + selectedRows[i] + ']').attr('checked', true);
                }
            }
        }

        function _setModulesPartiallySelected() {
            var elm, moduleid;
            
            $('.chkBox_Modules').each(function (i, e) {
                elm = this;
                
                $.each(dit_uac_policy.PartiallYSelectedModules, function (j, partailMod) {
                    
                    moduleid = $(elm).attr('moduleid');
                    moduleid = parseInt(moduleid);
                    if (moduleid == partailMod) {
                        //$(elm).parents('label').addClass('ui-chckdot');
                        $(elm).prop("indeterminate", true);
                        //anas
                    }
                });
            });
        }
    },

    bindActionsByModule: function (moduleid) {
        
        var data = new Array();
        var selectAll = "";
        var actions = dit_uac_policy.Actions;

        var checkedModules = $('#hidCheckedModules').val().split(',');
        if (actions != undefined && actions != null) {
            for (var i = 0; i < actions.length; i++) {
                if (actions[i].moduleid == moduleid) {
                    data.push(actions[i]);
                    for (var j = 0; j < checkedModules.length; j++) {
                        if (checkedModules[j] == moduleid) {
                            selectAll = "checked"
                            _checkAndPushAction(actions[i].actionid, actions[i].moduleid);
                            //_checkAndPushAction(actions[i].actionid, actions[i].moduleid, actions[i].isQuickActionLink);
                        }
                    }
                }
            }
        }

        $('#dvTab').dxDataGrid('instance').option("columns",[]);

        $('#dvTab').dxDataGrid(
            {
                width: '100%',
                dataSource: data,   //______Set Data for Grid       
                columns: [
                    {
                        width: '3%',
                        cellTemplate: function (container, options) {
                            
                            $("<div>").append(
                                $('<label class="checkbox-inline i-checks"><input type="checkbox"  moduleid=' + options.key.moduleid + ' ' + selectAll + ' actionid=' + options.key.actionid + ' class="chkBox"><i></i> </label>')
                            ).appendTo(container);
                        },
                    },
                    { dataField: 'actionid', visible: false }, 'actionName', 'actionTitle', 'description'
                ],
                showColumnLines: false,
                rowAlternationEnabled: true,
                loadPanel: { enabled: true },
                paging: { pageSize: 10 },//_____set Default Page Size
                pager: { allowedPageSizes: [10, 25, 50, 100], showNavigationButtons: true, showPageSizeSelector: true },//_____set Pager Properties
                searchPanel: { width: 250, placeholder: "Search", visible: false },
                onContentReady: function (e) { _setActionsChecked(moduleid); } //Select Rows if already selected or in Edit Mode
            }).dxDataGrid("instance");

        function _checkAndPushAction(actionid, moduleid, isQuickActionLink) {

            var found = dit_uac_policy.selectedActions.some(function (el) {
                return el.moduleid === moduleid && el.actionid === actionid;
            });
            if (!found) {
                dit_uac_policy.selectedActions.push({ actionid: actionid, moduleid: moduleid });
                //dit_uac_policy.selectedActions.push({ actionid: actionid, moduleid: moduleid, isQuickActionLink: isQuickActionLink });
            }
        }

        //__________Keep selected Individual modules on Load__________________
        function _setActionsChecked(moduleid) {

            var selectedActions = dit_uac_policy.selectedActions;
            if (selectedActions.length > 0) {
                for (var i = 0; i < selectedActions.length; i++) {
                    $('input[actionid=' + selectedActions[i].actionid + ']').attr('checked', true);
                }
            }
        }
    },

    pushActionsOnModuleSelection: function (moduleid) {
        
        var moduleid = parseInt(moduleid);
        var temp = $.grep(dit_uac_policy.Actions, function (e) {
            return e.moduleid === moduleid;
        });
        $(temp).each(function (i, e) {
            var found = dit_uac_policy.selectedActions.some(function (el) {
                return el.moduleid === e.moduleid && el.actionid === e.actionid;
            });
            if (!found) {
                dit_uac_policy.selectedActions.push({ actionid: e.actionid, moduleid: e.moduleid});
                //dit_uac_policy.selectedActions.push({ actionid: e.actionid, moduleid: e.moduleid, isQuickActionLink: e.isQuickActionLink });
            }
        });
    },

    fillHidSelModules: function (selector, checkBox) {
        if ($(checkBox).is(":checked")) {
            if ($(selector).val() != "") {
                $(selector).val($(selector).val() + ',' + $(checkBox).attr('moduleid'))
            }
            else {
                $(selector).val($(checkBox).attr('moduleid'));
            }
        }
        else {
            var idToRemove = $(checkBox).attr('moduleid');
            if ($(selector).val() != "") {

            }
            var commaCheck = $(selector).val().lastIndexOf(idToRemove);
            if (commaCheck == 0) {
                temp = $(selector).val().replace(idToRemove + ",", "");
                temp = temp.replace(idToRemove, "");
            }
            else {
                temp = $(selector).val().replace("," + idToRemove, "");
                temp = temp.replace(idToRemove, "");
            }
            $(selector).val(temp);
        }
    },

    rmvActionsOnModulesDeselect: function (checkBox) {
        var moduleid = $(checkBox).attr('moduleid');
        dit_uac_policy.selectedActions = $.grep(dit_uac_policy.selectedActions, function (e) {
            return e.moduleid != moduleid;
        });
    },

    SelectActionsByModule: function (checkBox, moduleid) {

        if ($(checkBox).is(":checked")) {
            createJSON(checkBox);
        }
        else {
            createJSON(checkBox);
            //____remove from selected Modules if any actions is deselected after selecting All Modules for 'FULL Control'
            idToRemove = moduleid;
            commaCheck = $('#hidCheckedModules').val().lastIndexOf(idToRemove);
            if (commaCheck == 0) {
                temp = $('#hidCheckedModules').val().replace(idToRemove + ",", "");
                temp = temp.replace(idToRemove, "");
            }
            else {
                temp = $('#hidCheckedModules').val().replace("," + idToRemove, "");
                temp = temp.replace(idToRemove, "");
            }
            $('#hidCheckedModules').val(temp);
        }

        function createJSON(checkBox) {
            var currentRow = $(checkBox).closest("tr");
            //var isQuickActionLinkValue = $(currentRow).find(".isQuickActionLink").is(":checked") == true ? 'true' : 'false';
            if ($(checkBox).is(":checked")) {
                dit_uac_policy.selectedActions.push({
                    actionid: $(checkBox).attr("actionid"),
                    moduleid: $(checkBox).attr("moduleid")
                });
            }
            else {
                for (var i = 0; i < dit_uac_policy.selectedActions.length; i++) {
                    if (dit_uac_policy.selectedActions[i].moduleid == $(checkBox).attr("moduleid") && dit_uac_policy.selectedActions[i].actionid == $(checkBox).attr("actionid")) {
                        dit_uac_policy.selectedActions.splice(i, 1);
                    }
                }
            }
        }
    },

    savePolicy: function () {
        
        var policy = {};
        policy.policyid = $('#policyid').val() === '' ? 0 : $('#policyid').val()
        policy.policyName = $("#policyName").val();
        policy.description = $("#description").val();
        policy.isActive = $("#isActive").prop("checked");
        policy.modules = dit_uac_policy.getModules($("#hidCheckedModules").val().split(','));
        policy.actions = dit_uac_policy.selectedActions;
        var xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(policy), '/UserAccess/SavePolicy', dit_uac_policy.savePolicySuccess, false, true);
    },

    savePolicySuccess: function (data) {
        if (data.msgType == 1)
            $("#policyid").val(data.data);

        ati_common.notify(data.msg, data.msgType);
    },

    checkModulesForFullControl: function (moduleid) {
        debugger;
        dit_uac_policy.checkedActionsCount++;
        var totalRows = $('#dvTab').dxDataGrid('instance').totalCount();
        var checkedRowCount = $('.chkBox:checked').length;
        var checkedModule = $("#hidCheckedModules").val().split(',');
        if (totalRows == checkedRowCount) {
            dit_uac_policy.checkedActionsCount = 0;
            checkedModule.push(moduleid);
            //dit_uac_policy.selectedActions = $.grep(dit_uac_policy.selectedActions, function (e) {                
            //    return e.moduleid != moduleid;
            //});

            dit_uac_policy.PartiallYSelectedModules = dit_uac_policy.PartiallYSelectedModules.filter(function (obj) {
                return obj.moduleid == moduleid;
            });

            $("#hidCheckedModules").val(checkedModule.join(','));
        }
        else if (checkedRowCount < totalRows) {
            var found = $.inArray(parseInt(moduleid), dit_uac_policy.PartiallYSelectedModules);
            if (found == -1)
                dit_uac_policy.PartiallYSelectedModules.push(parseInt(moduleid));
        }
    },

    deletePolicy: function (policyid, permanentDelete) {

        var policy = {};
        policy.policyid = policyid;
        policy.permanentDelete = permanentDelete;
        var xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(policy), '/UserAccess/DeletePolicy', dit_uac_policy.deletePolicySuccess, false, true);
    },

    deletePolicySuccess: function (data) {

        if (data.msgType == 3 && data.msg == 'Show Popup') {
            $("#confirm-view-policy-usage").modal("show");
            $("#btnShowUsage").attr('policyid', data.data);
        }
        else {
            ati_common.notify(data.msg, data.msgType);
            dit_uac_policy.policies = $.grep(dit_uac_policy.policies, function (e) {
                return e.policyid != data.returnId;
            });
        }
        $('#confirm-delete').modal('hide');
        dit_uac_policy.refreshGrid();
    },
    showModelUsage: function (policyid) {

        var model = {};
        model.policyid = policyid || $("#policyid").val();
        var xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(model), "/UserAccess/ShowPolicyUsagePopup/", function (response) {
            $("#confirm-view-policy-usage").modal("hide");
            $("#model-usage").modal("show");
            $("#model-usage .modal-body").html(response);
        }, false, false);
    },
    bindPolicyUsageGrids: function (policyid) {

        var model = {};
        model.policyid = policyid;
        var xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(model), '/UserAccess/GetPolicyUsage/', function (response) {
            _bindUsageGrids(response.data);
        }, false, true);

        function _bindUsageGrids(data) {
            //;
            var userColumns = [
                { dataField: 'userid', sortOrder: 'desc', caption: "ID", width: "6%", alignment: "left" },
                { dataField: "userName", caption: "Name" },
                {
                    caption: "Edit",
                    alignment: "center",
                    width: "10%",
                    cellTemplate: function (container, options) {

                        var url = '<a  target= "_blank" href="/UserAccess/EditUser/' + options.key.userid + '"><i title="Edit" class="ti-pencil" aria-hidden="true"></i></a>';
                        //$("<div>").append($()).appendTo(container);
                        $("<div>").append($(url)).appendTo(container);
                    }
                }];
            var groupcolumns = [
                { dataField: 'groupid', sortOrder: 'desc', caption: "ID", width: "6%", alignment: "left" },
                { dataField: "groupName", caption: "Name" },
                {
                    caption: "Edit",
                    alignment: "center",
                    width: "10%",
                    cellTemplate: function (container, options) {
                        $("<div>").append($('<a target= "_blank" href="/UserAccess/Groups"><i title="Edit" class="ti-pencil" aria-hidden="true"></i></a>')).appendTo(container);
                    }
                }];

            $('#userGrid').dxDataGrid({ dataSource: data.userList, columns: userColumns, showBorders: true });
            $('#groupGrid').dxDataGrid({ dataSource: data.grouplist, columns: groupcolumns, showBorders: true });

        }
    },
    refreshGrid: function () {
        //$('#dgPolicies').dxDataGrid('instance').option('datasource', dit_uac_policy.policies);
        //$('#dgPolicies').dxDataGrid('instance').refresh();
        dit_uac_policy.getDataGrid(false);
    },

    getModulesWithAction: function (modules) {
        for (var i = 0; i < modules.length; i++) {
            dit_uac_policy.selectedActions = $.grep(dit_uac_policy.selectedActions, function (e) {
                return e.moduleid != modules[i];
            });
        }

        return dit_uac_policy.selectedActions;
    },


    getModules: function (modules) {
        if (modules != "") {
            var objModules = [];
            for (var i = 0; i < modules.length; i++) {
                if ($.inArray(modules[i], objModules) == -1) {
                    objModules.push({ moduleid: modules[i] });
                }
            }
            return objModules;
        }
        else {
            return null;
        }
    },

    

    partialSelectionsCheckBoxHandler: function (elm) {
        var moduleid = $(elm).attr("moduleid");
        if ($(elm).parent('label').hasClass("ui-chckdot")) {
            $(elm).parent('label').removeClass("ui-chckdot");
            dit_uac_policy.PartiallYSelectedModules = $.grep(dit_uac_policy.PartiallYSelectedModules, function (e) {
                return e != parseInt(moduleid);
            });
        }
    }



}