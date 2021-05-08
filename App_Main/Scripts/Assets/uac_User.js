let Users = {

    getDataGrid: function () {
        let folder = {};
        folder.isActive = null;
        let columns = [
            { dataField: "UserId", caption: "ID", visible: false },//
            { dataField: "UserName", caption: "Name" },
            { dataField: "Email", caption: "Email" },
            { dataField: "IsActive", caption: "Active" },
            {
                caption: "Action",
                alignment: "center",
                cellTemplate: function (container, options) {
                    $("<div>")
                        .append(
                            $("<button>").click(function () {
                                window.open('/UserAccess/EditUser/' + options.key);
                            }).attr("type", "button").attr("id", options.key + "_EditIncompleteGrid").attr('class', 'grid-action-icon').html('<i class="fa fa-pencil-square-o iconbox" aria-hidden="true"></i>'))
                        .append(
                            $("<button>").click(function () {

                                if (confirm('Are you sure you want to delete this User?')) {
                                    Users.DeleteUser(options.key);
                                }
                            }).attr("type", "button").attr("id", options.key + "").attr('class', 'grid-action-icon deleteicon').html('<i class="fa fa-trash-o iconbox" aria-hidden="true"></i'))
                        .appendTo(container);
                }
            }
        ];
        Users.CreateGrid("dgUsers", columns, '/UserAccess/GetUsers');

    },
    CreateGrid: function (gridElemIdWithoutHash, gridCols, getDataUrl) {
        //
        
        var take = 100;
        var oDataTable;
        let IsMobile = false;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            IsMobile = true;
        }
        var _dataSource = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var deferred = $.Deferred(), args = {};
                if (loadOptions.filter) {
                    args.filter = [];
                    var arr = loadOptions.filter;
                    var index = 0;
                    $.each(arr, function (i, e) {
                        if (Array.isArray(e)) {
                            args.filter[index] = {};
                            args.filter[index].columnName = e[0];
                            args.filter[index].oprt = e[1];
                            args.filter[index].value = e[2];
                            args.filter[index].columnIndex = e.columnIndex;
                            index++;
                        }
                        else {
                            if (e !== "and" && e !== "or") {
                                args.filter[0] = {};
                                args.filter[0].columnName = arr[0];
                                args.filter[0].oprt = arr[1];
                                args.filter[0].value = arr[2];
                                return false;
                            }
                        }
                    });
                }
                args.skip = loadOptions.skip || 0;
                args.take = loadOptions.take || take;
                if (loadOptions.sort) {
                    args.sort = [];
                    var sortarr = loadOptions.sort;
                    args.sort = sortarr;
                }
                
                let Obj = {};
                Obj["filters"] = args;
                Obj["TotalRows"] = $("#" + gridElemIdWithoutHash).dxDataGrid('instance').totalCount();
                
                dxDynamicControls.GetData_Post(getDataUrl, JSON.stringify(Obj), function (response, argue) {
                    if (argue === "success") {
                        if (response.length > 0) {
                            oDataTable = response;
                            deferred.resolve(oDataTable, { totalCount: oDataTable[0].TotalRows });
                            
                        }
                        else {
                            oDataTable = JSON.parse('[]');
                            deferred.resolve(oDataTable, { totalCount: 0 });
                        }
                    }
                    else {
                        deferred.reject("Data Loading Error");
                    }
                });
                
                return deferred.promise();
            }
        });
        $("#" + gridElemIdWithoutHash).dxDataGrid({
            dataSource: {
                store: _dataSource
            },
            keyExpr: 'UserId',
            showBorders: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            columnChooser: {
                enabled: false,
                mode: 'select'
            },
            columnFixing: {
                enabled: true
            },
            filterRow: { visible: true, allowFilter: true },
            export: { enabled: false, fileName: "Users" },
            onExporting: function (e) {
                e.component.beginUpdate();
                e.component.columnOption("Action", "visible", false);
            },
            onExported: function (e) {
                e.component.columnOption("Action", "visible", true);
                e.component.endUpdate();
            },
            rowAlternationEnabled: true,
            remoteOperations: {
                sorting: true,
                paging: true,
                filtering: true,
                allowSearch: true
            },
            showColumnLines: false,
            showRowLines: true,
            loadPanel: { enabled: true },
            paging: { pageSize: 100 },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [25, 50, 100],
                showInfo: true
            },
            searchPanel: { width: 280, placeholder: "Search", visible: false },

            
            columns: gridCols
        }).dxDataGrid('instance');
    },
    DeleteUser: function (UserId) {
        let User = {};
        User.UserId = UserId;
        let xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(User), '/UserAccess/DeleteUser', Users.DeleteUserSuccess, false, true);
    },
    DeleteUserSuccess: function (dataobject) {
        ati_common.notify(dataobject.msg, dataobject.msgType);
        Users.getDataGrid();
    }

}