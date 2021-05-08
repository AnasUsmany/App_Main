let fac = {

    getDataGrid: function () {


        let visibility = false;
        if ($('#btnAdd').length > 0) {
            visibility = true;
        }
        let columns = [
            {
                dataField: "facilityName", width: "20%", dataType: "string", caption: "Facility",
                cellTemplate: function (container, options) {
                    let html = '';
                    if (!options.key.isFacSetup && options.key.Status !== "Inactive") {
                        html = '<i style="color:red;" class="fa fa-exclamation"></i>';
                    }
                    $("<div>")
                        .append($("<p>").html(html + ' ' + options.value))
                        .appendTo(container);
                    $(container).attr('style', 'cursor: pointer;');
                    container.click(function () {
                        var addr = options.key.companyAddr;
                        window.open("https://maps.google.com/maps?daddr=" + addr, "_blank");
                    });
                }
            }
            , { dataField: "parentName", dataType: "string", caption: "Parent", width: "20%" }
            , { dataField: "regionTitle", dataType: "string", caption: "Region", width: "8%" }
            , { dataField: "acronym", dataType: "string", caption: "Acronym", width: "8%" }
            , { dataField: "mainPhone", dataType: "string", caption: "Phone#", width: "8%" }
            , {
                dataField: "qbPriceLevelRefFullName", dataType: "string", caption: "Price Level", showInColumnChooser: visibility, visible: visibility, width: "8%"
            },
            {
                dataField: "frequencyName", dataType: "string", caption: "Invoice Frequency", showInColumnChooser: visibility, visible: visibility, width: "8%"
            },
            {
                dataField: "Status", dataType: "string", width: "10%",
                cellTemplate: function (container, options) {
                    var tr = options.component.getRowElement(options.row.rowIndex);
                    if (options.value === "Inactive") {
                        var bgcolor = "background-color:darkgray !important;";
                        tr.attr("style", bgcolor);
                    }
                    $("<div>")
                        .append($("<p>", { "text": options.value }))
                        .appendTo(container);
                }
            },
            {
                caption: "Action",
                dataField: "facilityid",
                alignment: "center",
                width: "10%",
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    $("<div>")
                        .append(
                            $("<button>").click(function () {
                            //window open
                            window.open('/Facilities/EditFacility/' + options.value);

                            }).attr("type", "button").attr("id", options.key + "ActionsGridEdit").attr('class', 'grid-action-icon').html('<i class="fa fa-pencil-square-o iconbox" aria-hidden="true"></i>'))
                        .append(
                            $("<button>").click(function () {

                                if (confirm('Are you sure you want to delete this Facility?')) {
                                    fac.DeleteFacility(options.value);
                                }
                            }).attr("type", "button").attr("id", options.key + "ActionsGridDelete").attr('class', 'grid-action-icon deleteicon').html('<i class="fa fa-trash-o iconbox" aria-hidden="true"></i'))
                        .appendTo(container);
                }
            }

        ];
        fac.fillGrid("dgFacilities", columns, '/Facilities/GetFacilitiesForGrid');
    },
    fillGrid: function (gridElemIdWithoutHash, gridCols, getDataUrl) {
        let Obj = {};
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
                console.log(loadOptions);
                Obj["TotalRows"] = $("#" + gridElemIdWithoutHash).dxDataGrid('instance').totalCount();
                Obj["filters"] = args;
                dxDynamicControls.GetData_Post(getDataUrl, JSON.stringify(Obj), function (response, argue) {
                   
                    if (argue === "success") {
                        if (response.length > 0) {
                            oDataTable = response;//JSON.parse(response);
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

        return $("#" + gridElemIdWithoutHash).dxDataGrid({
            dataSource: {
                store: _dataSource
            },
            showBorders: true,
            allowColumnResizing: true,
            columnAutoWidth: false,
            wordWrapEnabled: false,
            showScrollbar: false,
            columnFixing: {
                enabled: true
            },
            remoteOperations: {
                sorting: true,
                paging: true,
                filtering: true,
                allowSearch: true
            },
            rowAlternationEnabled: false,
            filterRow: { visible: true, allowFilter: true },
            searchPanel: { width: 280, visible: false, placeholder: "Search...", allowSearch: true },
            showColumnLines: false,
            showRowLines: true,
            loadPanel: { enabled: true },

            paging: { pageSize: 100, showInfo: true },
            //pager: {
            //    showPageSizeSelector: true,
            //    allowedPageSizes: [100,150],
            //    showInfo: true
            //},
            columns: gridCols

        }).dxDataGrid("instance");
    },
    RefreshGrid: function (gridId) {
        $('#' + gridId).dxDataGrid('instance').refresh();
    },
    DeleteFacility: function (FacilityId) {
        let obj = {};
        obj.FacilityId = FacilityId;
        dxDynamicControls.GetData_Post('/Facilities/DeleteFacility', JSON.stringify(obj), fac.DeleteFacilitySuccess);
    },
    DeleteFacilitySuccess: function (data) {
        if (data.msgType !== null) {
            ati_common.notify(data.msg, data.msgType);
            fac.RefreshGrid("dgFacilities");
        }
        else {
            ati_common.notify("Request did not procesed, please try again.", 3);
        }
    }

}