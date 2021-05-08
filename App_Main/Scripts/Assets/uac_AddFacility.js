var uac_Facility = {

    CreateControls: function (model) {
        let createdDate = '';
        if (model !== null && model.CreatedOn !== undefined) {
            createdDate = model.CreatedOn;

        }
        else {
            createdDate = new Date();
        }

        dxDynamicControls.dateBoxFor('dtDateAfter', { dateType: "date" }, 'calendar', null, null, null, false, '', '', function (e) { });
        dxDynamicControls.dateBoxFor('dtHiredDate', { dateType: "date" }, 'calendar', null, null, null, false, '', '', function (e) { }, true);

        if (model !== null && model.facilityid > 0) {

            uac_Facility.loadCompanies(model.qbCompanyid);
            uac_Facility.loadRegions(model.regionid);
            uac_Facility.CreateGrid([]);///yahan kam krna hai contacts ka data jaega
            uac_Facility.loadInvoiceFrequency(model.invoiceFrequencyID);
            uac_Facility.fillForm(model);

        }
        else {
            uac_Facility.loadJobTitle();
            uac_Facility.loadJobStatus();
            uac_Facility.loadCompanies();
            uac_Facility.loadRegions();
            uac_Facility.loadGroups();
            let d = model || [];
            uac_Facility.CreateGrid([]);///yahan kam krna hai contacts ka data jaega
            uac_Facility.loadInvoiceFrequency();
            uac_Facility.CreateGridBonusPayRule([]);
        }
        setTimeout(function () {
            let viewMode = new URL(window.location.href).searchParams.get('View');
            if (viewMode) {
                var inputs = document.getElementsByTagName("INPUT");
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].disabled = true;
                }
                $('#cmbJobTitle').dxSelectBox('instance').option('readOnly', true);
                $('#cmbStatus').dxSelectBox('instance').option('readOnly', true);
                $('#cmbCompany').dxSelectBox('instance').option('readOnly', true);
                $('#cmbGroup').dxSelectBox('instance').option('readOnly', true);
                $('#ddlRegions').dxTagBox('instance').option('readOnly', true);
            }
        }, 3000);
    },
    fillForm: function (Facility) {
        console.log(Facility);
        $('.card').show();
        $('#lblfacilityname').html(Facility.facilityName);
        $('#lblstate').html(Facility.qbState);
        $('#lblAddress1').html(Facility.qbAddress1);

        $('#FacilityId').val(Facility.facilityid);
        $('#isParentFacility').prop('checked', Facility.isParentFacility);
        $('#txtFacilityName').val(Facility.facilityName);
        $('#txtCustomerType').val(Facility.qbCustTypeRefFullName);
        $('#txtJobType').val(Facility.qbJobTypeRefFullName);
        $('#txtMainPhone').val(Facility.mainPhone);
        $('#txtAcronym').val(Facility.acronym);
        function fillDateAfter(datetotime) {
            if (!datetotime) {
                return "";
            }
            else {
                var date = new Date(parseInt(datetotime.substr(6)));
                return date;
            }

        }
        $('#dtDateAfter').dxDateBox('instance').option('value', fillDateAfter(Facility.dateAfter));
        $('#txtMessage').val(Facility.emrMessage);
        $('#txtRadiology').val(Facility.radiology);
        $('#txtSupplies').val(Facility.supplies);
        $('#txtPaperwork').val(Facility.paperwork);
        $('#txtNotes').val(Facility.notes);
        $('#isDisplayResults').prop('checked', Facility.isDisplayResult);
        $('#isActive').prop('checked', Facility.qbIsActive);
        $('#isServiceHold').prop('checked', Facility.isServiceHold);
        $('#txtQuickBooksName').val(Facility.qbQuickbookName);
        $('#txtContactLastName').val(Facility.qbCusLastName);
        $('#txtContactFirstName').val(Facility.qbCusFirstName);
        $('#txtContactPhoneNumber').val(Facility.qbPhoneNumber);
        $('#txtAddress1').val(Facility.qbAddress1);
        $('#txtAddress2').val(Facility.qbAddress2);
        $('#txtCity').val(Facility.qbCity);
        $('#txtState').val(Facility.qbState);
        $('#txtZipCode').val(Facility.qbZipcode);


        $('#txtAPContact').val(Facility.qbContact);
        $('#txtTitle').val(Facility.qbJobTitle);
        //Facility.unknown = $('#txtPhone').val(); 
        $('#txtAltPhone').val(Facility.qbAltContact);
        $('#txtFax').val(Facility.qbFax);
        $('#txtPriceLevel').val(Facility.qbPriceLevelRefFullName);
        $('#txtSalesRep').val(Facility.qbSalesRepRefFullName);
        $('#IsInvoiceParent').prop('checked', Facility.isInvoiceToParent);
        $('#txtPONumber').val(Facility.poNumber);
        $('#txtPreferredDeliveryMethod').val(Facility.qbPreferredDeliveryMethod);
        $('#txtEmail').val(Facility.qbEmail);
        function DoAction(datetotime) {
            if (!datetotime) {
                return "";
            }
            else {
                var date = new Date(parseInt(datetotime.substr(6)));
                var h = date.getHours();
                var m = date.getMinutes();
                var s = date.getSeconds();
                if (h < 10) h = '0' + h;
                if (m < 10) m = '0' + m;
                if (s < 10) s = '0' + s;
                dateString = h + ':' + m;
                return dateString;
            }
       
        }

        $('#dtMondayTimeStart').val(DoAction(Facility.operatingHours.mondayStart));
        $('#dtMondayTimeEnd').val(DoAction(Facility.operatingHours.mondayEnd));

        $('#dtTuesdayTimeStart').val(DoAction(Facility.operatingHours.tuesdayStart));
        $('#dtTuesdayTimeEnd').val(DoAction(Facility.operatingHours.tuesdayEnd));

        $('#dtWednesdayTimeStart').val(DoAction(Facility.operatingHours.wednesdayStart));
        $('#dtWednesdayTimeEnd').val(DoAction(Facility.operatingHours.wednesdayEnd));

        $('#dtThursdayTimeStart').val(DoAction(Facility.operatingHours.thursdayStart));
        $('#dtThursdayTimeEnd').val(DoAction(Facility.operatingHours.thursdayEnd));

        $('#dtFridayTimeStart').val(DoAction(Facility.operatingHours.fridayStart));
        $('#dtFridayTimeEnd').val(DoAction(Facility.operatingHours.fridayEnd));

        $('#dtSaturdayTimeStart').val(DoAction(Facility.operatingHours.saturdayStart));
        $('#dtSaturdayTimeEnd').val(DoAction(Facility.operatingHours.saturdayEnd));

        $('#dtSundayTimeStart').val(DoAction(Facility.operatingHours.sundayStart));
        $('#dtSundayTimeEnd').val(DoAction(Facility.operatingHours.sundayEnd));
        $("#dgEmployees").dxDataGrid('instance').option('dataSource', Facility.faciityContacts);

        

    },
    //ParseDateAndGetMinutes: function (Facility.operatingHours.mondayStart) {
    //    var date = new Date(parseInt(Facility.operatingHours.mondayStart.substr(6)));
    //    console.log(date);


    //    var h = date.getHours();
    //    var m = date.getMinutes();
    //    var s = date.getSeconds();
    //    if (h < 10) h = '0' + h;
    //    if (m < 10) m = '0' + m;
    //    if (s < 10) s = '0' + s;
    //    dateString = h + ':' + m;
    //    debugger;
    //    return dateString;
    //},
    loadJobTitle: function (selectedValues) {
        console.log(selectedValues);
        var group = {};
        group.isPayroll = true;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/UserAccess/GetJobTitle', uac_Facility.loadJobTitleSuccess, false, true, selectedValues);
    },
    loadJobTitleSuccess: function (response, selectedValues) {

        const { data } = response;
        var cmbJobTitleExpr = { placeHolder: "Choose Job Title", valueField: "JobTitleId", textField: "JobTitle", bool_ClearButton: false };
        dxDynamicControls.comboBoxFor('cmbJobTitle', { type: 'array', key: 'JobTitleId', data: data }, selectedValues, cmbJobTitleExpr, false, false, "", null, function (e) { });
    },
    loadJobStatus: function (selectedValues) {

        let xhr = ajaxHelper.ajaxGetJsonAndExtraParam('/JobStatus/GetJobStatus', uac_Facility.loadJobStatusSuccess, false, false, selectedValues);
    },
    loadJobStatusSuccess: function (response, selectedValues) {
        const { data } = response;
        var cmbStatusExpr = { placeHolder: "Choose Job Status", valueField: "JobStatusId", textField: "StatusName", bool_ClearButton: false };
        dxDynamicControls.comboBoxFor('cmbStatus', { type: 'array', key: 'JobStatusId', data: data }, selectedValues, cmbStatusExpr, false, false, "", null, function (e) { });
    },
    loadCompanies: function (selectedValues) {
        var group = {};
        group.isActive = true;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/Company/GetCompanies', uac_Facility.loadCompaniesSuccess, false, true, selectedValues);
    },
    loadCompaniesSuccess: function (response, selectedValues) {

        const { data } = response;
        var cmbCompanyExpr = { placeHolder: "Choose Company", valueField: "CompanyId", textField: "CompanyName", bool_ClearButton: false };
        dxDynamicControls.comboBoxFor('cmbCompany', { type: 'array', key: 'CompanyId', data: data }, selectedValues, cmbCompanyExpr, false, false, "", null, function (e) { });
    },
    loadRegions: function (selectedValues) {
        var group = {};
        group.isActive = true;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/Regions/GetRegions', uac_Facility.loadRegionsSuccess, false, true, selectedValues);
    },
    loadRegionsSuccess: function (response, selectedValues) {
        const { data } = response;
        var ddlRegionsExpr = { placeHolder: "Choose Region", valueField: "RegionId", textField: "RegionTitle", bool_ClearButton: false };
        //dxDynamicControls.TagBoxFor('ddlRegions', data, selectedValues, ddlRegionsExpr, false, function (e) { });
        dxDynamicControls.comboBoxFor('ddlRegions', { type: 'array', key: 'frequencyid', data: data }, selectedValues, ddlRegionsExpr, false, false, "", null, function (e) { });
    },
    loadInvoiceFrequency: function (selectedValues) {
        debugger;
        var group = {};
        group.isActive = true;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/InvoiceFrequency/GetInvoiceFrequencies', uac_Facility.loadInvoiceFrequencySuccess, false, true, selectedValues);
    },
    loadInvoiceFrequencySuccess: function (response, selectedValues) {
        const { data } = response;
        var ddlInvoiceFrequencyExpr = { placeHolder: "Choose Invoice Frequency", valueField: "frequencyid", textField: "frequencyName", bool_ClearButton: false };
        dxDynamicControls.comboBoxFor('ddlInvoiceFrequency', { type: 'array', key: 'frequencyid', data: data }, selectedValues, ddlInvoiceFrequencyExpr, false, false, "", null, function (e) { });
    },
    loadGroups: function (selectedValues) {
        var group = {};
        group.isDeleted = false;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/UserAccess/GetGroups', uac_Facility.loadGroupsSuccess, false, true, selectedValues);
    },
    loadGroupsSuccess: function (response, selectedValues) {
        const { data } = response;
        var cmbGroupExpr = { placeHolder: "Choose Group", valueField: "RoleId", textField: "RoleName", bool_ClearButton: false };
        dxDynamicControls.comboBoxFor('cmbGroup', { type: 'array', key: 'RoleId', data: data }, selectedValues, cmbGroupExpr, false, false, "", null, function (e) { });
    },
    SaveFacility: function () {
        let Facility = {};
        Facility.facilityid = $('#facilityid').val();
        Facility.isParentFacility = $('#isParentFacility').prop('checked');
        Facility.facilityName = $('#txtFacilityName').val();
        Facility.qbCustTypeRefFullName = $('#txtCustomerType').val();
        Facility.qbJobTypeRefFullName = $('#txtJobType').val();
        Facility.mainPhone = $('#txtMainPhone').val();
        Facility.acronym = $('#txtAcronym').val();
        Facility.dateAfter = $('#dtDateAfter').dxDateBox('instance').option('value');
        Facility.emrMessage = $('#txtMessage').val();
        Facility.radiology = $('#txtRadiology').val();
        Facility.supplies = $('#txtSupplies').val();
        Facility.paperwork = $('#txtPaperwork').val();
        Facility.notes = $('#txtNotes').val();
        Facility.isDisplayResult = $('#isDisplayResults').prop('checked');
        Facility.qbIsActive = $('#isActive').prop('checked');
        Facility.isServiceHold = $('#isServiceHold').prop('checked');
        Facility.qbCompanyid = $('#cmbCompany').dxSelectBox('instance').option('value');
        Facility.qbQuickbookName = $('#txtQuickBooksName').val();
        Facility.qbCusLastName = $('#txtContactLastName').val();
        Facility.qbCusFirstName = $('#txtContactFirstName').val();
        Facility.qbPhoneNumber = $('#txtContactPhoneNumber').val();
        Facility.qbAddress1 = $('#txtAddress1').val();
        Facility.qbAddress2 = $('#txtAddress2').val();
        Facility.qbCity = $('#txtCity').val();
        Facility.qbState = $('#txtState').val();
        Facility.qbZipcode = $('#txtZipCode').val();
        Facility.regionid = $('#ddlRegions').dxSelectBox('instance').option('value');
        Facility.qbEmail = $('#txtEmail').val();
        Facility.qbContact = $('#txtAPContact').val(); 
        Facility.qbJobTitle = $('#txtTitle').val(); 
        //Facility.unknown = $('#txtPhone').val(); 
        Facility.qbAltContact = $('#txtAltPhone').val(); 
        Facility.qbFax = $('#txtFax').val(); 
        Facility.qbPriceLevelRefFullName = $('#txtPriceLevel').val(); 
        Facility.qbSalesRepRefFullName = $('#txtSalesRep').val(); 
        Facility.isInvoiceToParent = $('#IsInvoiceParent').prop('checked');
        Facility.poNumber = $('#txtPONumber').val(); 
        Facility.invoiceFrequencyID = $('#ddlInvoiceFrequency').dxSelectBox('instance').option('value');
        Facility.qbPreferredDeliveryMethod = $('#txtPreferredDeliveryMethod').val(); 

        let OperatingHours = {};
        OperatingHours.mondayStart = $('#dtMondayTimeStart').val(); 
        OperatingHours.mondayEnd = $('#dtMondayTimeEnd').val();

        OperatingHours.TuesdayStart = $('#dtTuesdayTimeStart').val(); 
        OperatingHours.TuesdayEnd = $('#dtTuesdayTimeEnd').val(); 

        OperatingHours.WednesdayStart = $('#dtWednesdayTimeStart').val(); 
        OperatingHours.WednesdayEnd = $('#dtWednesdayTimeEnd').val(); 

        OperatingHours.ThursdayStart = $('#dtThursdayTimeStart').val(); 
        OperatingHours.ThursdayEnd = $('#dtThursdayTimeEnd').val(); 

        OperatingHours.FridayStart = $('#dtFridayTimeStart').val(); 
        OperatingHours.FridayEnd = $('#dtFridayTimeEnd').val(); 

        OperatingHours.SaturdayStart = $('#dtSaturdayTimeStart').val(); 
        OperatingHours.SaturdayEnd = $('#dtSaturdayTimeEnd').val(); 

        OperatingHours.SundayStart = $('#dtSundayTimeStart').val(); 
        OperatingHours.SundayEnd = $('#dtSundayTimeEnd').val();


        //if (OperatingHours.mondayStart === "" || OperatingHours.mondayEnd === "") {
        //    OperatingHours.isMonday = false;
        //}
        //else if (OperatingHours.mondayStart !== "" || OperatingHours.mondayEnd === "") {
        //    alert("Fill both textboxes ather wise empty those");
        //}
        //else if (OperatingHours.mondayStart === "" || OperatingHours.mondayEnd !== "") {
        //    alert("Fill both textboxes ather wise empty those");
        //}
        //else if (OperatingHours.mondayStart !== "" || OperatingHours.mondayEnd !== "") {
        //    OperatingHours.isTuesday = true;
        //}

        //if (OperatingHours.TuesdayStart === "" || OperatingHours.TuesdayEnd === "") {
        //    OperatingHours.isTuesday = false;
        //}
        //else if (OperatingHours.TuesdayStart != "" || OperatingHours.TuesdayEnd === "") {
        //    alert("Fill both textboxes ather wise empty those");
        //}
        //else if (OperatingHours.TuesdayStart === "" || OperatingHours.TuesdayEnd != "") {
        //    alert("Fill both textboxes ather wise empty those");
        //}
        //else if (OperatingHours.TuesdayStart !== "" || OperatingHours.TuesdayEnd !== "") {
        //    OperatingHours.isTuesday = true;
        //}
        //if (Facility.facilityName === "") {
        //    alert("Please fill Facility Name");
        //}
        //else if (Facility.qbCustTypeRefFullName === "") {
        //    alert("Please fill Customer Type");
        //}
        //else if (Facility.qbJobTypeRefFullName === "") {
        //    alert("Please fill Job Type");
        //}
        if (Facility.mainPhone === "") {
            alert("Please fill Main Phone");
        }
        else if (Facility.acronym === "") {
            alert("Please fill Acronym");
        }
        //else if (Facility.dateAfter === null) {
        //    alert("Please Fill After Date");
        //}
        //else if (Facility.emrMessage === "") {
        //    alert("Please Fill Message");
        //}
        //else if (Facility.radiology === "") {
        //    alert("Please Fill Radio");
        //}
        //else if (Facility.supplies === "") {
        //    alert("Please Fill Supply");
        //}
        //else if (Facility.paperwork === "") {
        //    alert("Please Fill Paper Work");
        //}
        //else if (Facility.notes === "") {
        //    alert("Please Fill Paper Notes");
        //}
        else if (Facility.qbQuickbookName === "") {
            alert("Please Fill QuickBook Name");
        }
        //else if (Facility.qbCusLastName === "") {
        //    alert("Please Fill Customer Last Name");
        //}
        //else if (Facility.qbCusFirstName === "") {
        //    alert("Please Fill Customer First Name");
        //}
        else if (Facility.qbPhoneNumber === "") {
            alert("Please Fill Phone Number");
        }
        else if (Facility.qbAddress1 === "") {
            alert("Please Fill Address 1");
        }
        //else if (Facility.qbAddress2 === "") {
        //    alert("Please Fill Address 2");
        //}
        else if (Facility.qbCity === "") {
            alert("Please Fill City");
        }
        else if (Facility.qbCompanyid === null) {
            alert("Please Fill City");
        }
        //else if (Facility.qbState === "") {
        //    alert("Please Fill State");
        //}
        else if (Facility.qbZipcode === "") {
            alert("Please Fill Zip Code");
        }
        else if (Facility.regionid === "") {
            alert("Please Select Region");
        }
        //else if (Facility.qbContact === "") {
        //    alert("Please Fill Contact");
        //}
        //else if (Facility.qbJobTitle === "") {
        //    alert("Please Fill Job Title");
        //}
        //else if (Facility.qbAltContact === "") {
        //    alert("Please Fill Alt Contact");
        //}
        //else if (Facility.qbFax === "") {
        //    alert("Please Fill Fax");
        //}
        //else if (Facility.qbPriceLevelRefFullName === "") {
        //    alert("Please Fill Price Level");
        //}
        //else if (Facility.qbSalesRepRefFullName === "") {
        //    alert("Please Fill Sales Rep");
        //}
        //else if (Facility.poNumber === "") {
        //    alert("Please Fill PO Number");
        //}
        //else if (Facility.qbPreferredDeliveryMethod === "") {
        //    alert("Please Fill Delivery Method");
        //}
        else {
            let GridData = $("#dgEmployees").dxDataGrid('instance').option('dataSource');
            let SendObj = {};
            SendObj.Facility = Facility;
            SendObj.OperatingHours = OperatingHours;
            SendObj.faciityContacts = GridData;
            Facility.FacilityFacilities = [];
            let xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(SendObj), '/Facilities/SaveFacility', uac_Facility.saveFacilitySuccess, false, true);
            
        }
        

        
    },
    saveFacilitySuccess: function (data) {


        ati_common.notify(data.msg, data.msgType);
        opener.location.reload();
        window.top.close();//

    },
    FacilityUserClicked: function () {
        if ($('#IsFacilityUser').prop('checked')) {
            $('#navtabEmpData').hide();
            $('#navtabPayrollData').hide();
            $('#IsAllowPic').prop('checked', false);
            $('#lblIsAllowPic').hide();
            $('#lblFacilitites').text('Facility(s) :');

        }
        else {
            $('#navtabEmpData').show();
            $('#navtabPayrollData').show();
            $('#lblIsAllowPic').show();
            $('#lblFacilitites').text('Assign Additional Facility Outside an Assigned Region :');
        }

    },
    CreateGrid: function (data) {
        
        $('#dgEmployees').dxDataGrid({
            dataSource: data,
            keyExpr: 'facilityid',
            editing: {
                mode:'row',
                allowAdding : true,
                allowUpdating : true,
                allowDeleting : true
            },
            showBorders: true,
            allowColumnResizing: true,
            columnAutoWidth: true,
            columnFixing: {
                enabled: true
            },
            export: { enabled: false, fileName: "Users" },
            rowAlternationEnabled: false,
            remoteOperations: {
                sorting: true,
                paging: true
            },
            showColumnLines: false,
            showRowLines: true,
            wordWrapEnabled: true,
            loadPanel: { enabled: true },
            paging: { pageSize: 50 },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [25, 50, 100],
                showInfo: true
            },
            searchPanel: { width: 280, placeholder: "Search", visible: false },
            columns: [

                { dataField: "firstName", width: '25%' },
                { dataField: "lastName", width: '25%' },
                { dataField: "jobTitle", caption: "Job Title", width: '25%' },
                { dataField: "contact", width: '25%' }
                
            ]
        }).dxDataGrid('instance');
    },
    CreateGridBonusPayRule: function (data) {
        //const buses = [
        //    { busID: 1, plates: "123456" },
        //    { busID: 2, plates: "AB-1234" },
        //    { busID: 3, plates: "CD-9876" }
        //];
        //$("#dgBonusPayRule").dxDataGrid({
        //    dataSource: data,
        //    showBorders: true,
        //    keyExpr: "PayRollID",
        //    selectedRowKeys: valobj,
        //    paging: {
        //        enabled: false,
        //        pageSize: 50
        //    },
        //    editing: {
        //        mode: "cell",
        //        allowUpdating: true
        //    },
        //    selection: {
        //        mode: "multiple"
        //    },
        //    //onSelectionChanged: function(data) {
        //    //   deleteButton.option("disabled", !data.selectedRowsData.length);
        //    // }, 
        //    columns: [
        //        {
        //            dataField: "ItemInventoryName",
        //            caption: "Associate Item Inventory",
        //            allowEditing: false, width: 150
        //        },
        //        {
        //            dataField: "QBBillingItemId",
        //            caption: "Item Name",
        //            width: 125,

        //            customizeText: function (cellInfo) {
        //                if (cellInfo.value == null) {
        //                    return "Select a Value";
        //                }
        //                else {
        //                    return cellInfo.value;
        //                }
        //            },
        //            editorOptions: {
        //                valueChangeEvent: "input"
        //            },
        //            lookup: {
        //                dataSource: ddlObj.BillintItems,
        //                displayExpr: "Name",
        //                valueExpr: "QBItems_id"
        //            }
        //        },
        //        {
        //            dataField: "QBAHBillingItemId",
        //            caption: "A/H Billing Item",
        //            width: 125,

        //            customizeText: function (cellInfo) {
        //                if (cellInfo.value == null) {
        //                    return "Select a Value";
        //                }
        //                else {
        //                    return cellInfo.value;
        //                }
        //            },
        //            editorOptions: {
        //                valueChangeEvent: "input"
        //            },
        //            lookup: {
        //                dataSource: ddlObj.AHBillingItem,
        //                displayExpr: "Name",
        //                valueExpr: "QBItems_id"

        //            }
        //        }
        //    ]
        //}).dxDataGrid("instance");
        //$('#dgBonusPayRule').dxDataGrid({
        //    dataSource: data,
        //    keyExpr: 'facilityid',
        //    editing: {
        //        mode: 'cell',
        //        allowAdding: true,
        //        allowUpdateing: true,
        //        allowDeleting: true
        //    },
        //    showBorders: true,
        //    allowColumnResizing: true,
        //    columnAutoWidth: true,
        //    columnChooser: {
        //        enabled: true,
        //        mode: 'select'
        //    },
        //    columnFixing: {
        //        enabled: true
        //    },
        //    export: { enabled: true, fileName: "Users" },
        //    onExporting: function (e) {
        //        e.component.beginUpdate();
        //        e.component.columnOption("Action", "visible", false);
        //    },
        //    onExported: function (e) {
        //        e.component.columnOption("Action", "visible", true);
        //        e.component.endUpdate();
        //    },
        //    rowAlternationEnabled: false,
        //    remoteOperations: {
        //        sorting: true,
        //        paging: true
        //    },
        //    showColumnLines: false,
        //    showRowLines: true,
        //    wordWrapEnabled: true,
        //    loadPanel: { enabled: true },
        //    paging: { pageSize: 50 },
        //    pager: {
        //        showPageSizeSelector: true,
        //        allowedPageSizes: [25, 50, 100],
        //        showInfo: true
        //    },
        //    searchPanel: { width: 280, placeholder: "Search", visible: true },

        //    onToolbarPreparing: function (e) {
        //        var toolbarItems = e.toolbarOptions.items;
        //        var searchPanel = $.grep(toolbarItems, function (item) {
        //            return item.name === "searchPanel";
        //        })[0];
        //        searchPanel.location = "before";
        //    },
        //    onEditorPreparing: function (e) {
        //        if (e.dataField === "Procedures" && e.parentType === "dataRow") {
        //            e.editorName = "dxTagBox";
        //            e.editorOptions.dataSource = [];
        //            e.editorOptions.displayExpr = "title"; 
        //            e.editorOptions.valueExpr = "id";
                    

        //        }
        //        if (e.dataField === "TravelBonus" && e.parentType === "dataRow") {
        //            e.editorOptions.disabled = e.row.data && e.row.data.FirstName === "";
        //        }
        //    },
        //    columns: [
            
        //        {
        //            dataField: "Procedures", width: '50%', lookup: {
        //                dataSource: buses,
        //                valueExpr: "busID",
        //                displayExpr: "plates"
        //            } },
        //        {
        //            dataField: "TravelBonus", width: '10%', lookup: {
        //                dataSource: buses,
        //                valueExpr: "busID",
        //                displayExpr: "plates"
        //            } },
        //        {
        //            caption: "Action",
        //            width: '10%',
        //            alignment: "center",
        //            cellTemplate: function (container, options) {
        //                $("<div>")
        //                    .append(
        //                        $("<button>").click(function () {
        //                            window.open('/UserAccess/EditUser/' + options.key + '?View=1');
        //                        }).attr("type", "button").attr("id", options.key + "_EditIncompleteGrid").attr('class', 'grid-action-icon').html('<i class="fa fa-eye iconbox" aria-hidden="true"></i>'))
        //                    .appendTo(container);
        //            }
        //        }
        //    ]
        //}).dxDataGrid('instance');
    }
}