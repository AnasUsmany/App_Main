var uac_User = {

    CreateControls: function (model) {
        
        let createdDate = '';
        if (model !==null && model.CreatedOn !== undefined ) {
            createdDate = model.CreatedOn;
            
        }
        else {
            createdDate = new Date();
        }

        dxDynamicControls.dateBoxFor('dtDateCreated', { dateType: "date" }, 'calendar', null, null, null, false, '', '', function (e) { }, true);
        dxDynamicControls.dateBoxFor('dtHiredDate', { dateType: "date" }, 'calendar', null, null, null, false, '', '', function (e) { }, true);

        if (model !== null && model.UserId>0) {

            uac_User.loadJobTitle(model.JobTitleId);
            uac_User.loadJobStatus(model.JobStatusId);
            uac_User.loadCompanies(model.CompanyId);
            uac_User.loadRegions(model.UserRegions);
            uac_User.loadGroups(model.RoleId);
            uac_User.loadFacilities(model.UserFacilities);
            $('#passwordDiv').hide();
            uac_User.fillForm(model);
            
        }
        else {
            uac_User.loadJobTitle();
            uac_User.loadJobStatus();
            uac_User.loadCompanies();
            uac_User.loadRegions();
            uac_User.loadGroups();
            uac_User.loadFacilities();
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
    fillForm: function (user) {


        //user.ProfilePicGuid = $('#imagebase64').val();
        if (user.ProfilePicGuid !== null) {
            $('#img-upload').attr('src', '/Content/Images/ProfilePictures/' + user.ProfilePicGuid);
            $('#imagebase64').val(user.ProfilePicGuid);
        }


        $('#txtFirsName').val(user.FirstName);
        $('#txtLastName').val(user.LastName);
        $('#txtAddress1').val(user.Address1);
        $('#txtAddress2').val(user.Address2);
        $('#txtCity').val(user.City);
        $('#txtState').val(user.State);
        $('#txtZipCode').val(user.ZipCode);
        $('#txtHomePhone').val(user.HomePhone);
        $('#txtAltPhone').val(user.AltPhone);
        $('#txtMobilePhone').val(user.MobilePhone);
        $('#txtEmail').val(user.Email);
        $('#txtAltEmail').val(user.AltEmail);
        $('#txtNotes').val(user.Notes);
        $('#txtUserName').val(user.UserName).attr('disabled','disabled');
        $('#txtldapUserName').val(user.LdapUserName);
        $('#userFrom').val(user.userFrom);
        $('#IsAllowPic').prop('checked', user.IsAllowPICC);
        $('#txtEciPrimaryName').val(user.EciPrimaryName);
        $('#txtEciPrimaryPhone').val(user.EciPrimaryPhone);
        $('#txtEciPrimaryRelation').val(user.EciPrimaryRelation);
        $('#txtEciSecondaryName').val(user.EciSecondaryName);
        $('#txtEciSecondaryPhone').val(user.EciSecondaryPhone);
        $('#txtEciSecondaryRelation').val(user.EciSecondaryRealtion);
        $('#IsFacilityUser').prop('checked', user.IsFacUser);
        $('#IsActive').prop('checked', user.IsActive);

        uac_User.FacilityUserClicked();

    },
    loadJobTitle: function (selectedValues) {
        console.log(selectedValues);
        var group = {};
        group.isPayroll = true;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/UserAccess/GetJobTitle', uac_User.loadJobTitleSuccess, false, true, selectedValues);
    },
    loadJobTitleSuccess: function (response, selectedValues) {

        const { data } = response;
        var cmbJobTitleExpr = { placeHolder: "Choose Job Title", valueField: "JobTitleId", textField: "JobTitle", bool_ClearButton: false };
        dxDynamicControls.comboBoxFor('cmbJobTitle', { type: 'array', key: 'JobTitleId', data: data }, selectedValues, cmbJobTitleExpr, false, false, "", null, function (e) { });
    },
    loadJobStatus: function (selectedValues) {

        let xhr = ajaxHelper.ajaxGetJsonAndExtraParam('/JobStatus/GetJobStatus', uac_User.loadJobStatusSuccess, false, false, selectedValues);
    },
    loadJobStatusSuccess: function (response, selectedValues) {
        const { data } = response;
        var cmbStatusExpr = { placeHolder: "Choose Job Status", valueField: "JobStatusId", textField: "StatusName", bool_ClearButton: false };
        dxDynamicControls.comboBoxFor('cmbStatus', { type: 'array', key: 'JobStatusId', data: data }, selectedValues, cmbStatusExpr, false, false, "", null, function (e) { });
    },
    loadCompanies: function (selectedValues) {
        var group = {};
        group.isActive = true;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/Company/GetCompanies', uac_User.loadCompaniesSuccess, false, true, selectedValues);
    },
    loadCompaniesSuccess: function (response, selectedValues) {
        const { data } = response;
        var cmbCompanyExpr = { placeHolder: "Choose Company", valueField: "CompanyId", textField: "CompanyName", bool_ClearButton: false };
        dxDynamicControls.comboBoxFor('cmbCompany', { type: 'array', key: 'CompanyId', data: data }, selectedValues, cmbCompanyExpr, false, false, "", null, function (e) { });
    },
    loadRegions: function (selectedValues) {
        let newSelectedValues = [];
        if (selectedValues !== null && selectedValues !== undefined) {
            newSelectedValues = selectedValues.map(function (e) { return e.RegionId });
        }
        var group = {};
        group.isActive = true;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/Regions/GetRegions', uac_User.loadRegionsSuccess, false, true, newSelectedValues);
    },
    loadRegionsSuccess: function (response, selectedValues) {
        const { data } = response;
        var ddlRegionsExpr = { placeHolder: "Choose Region(s)", valueField: "RegionId", textField: "RegionTitle", bool_ClearButton: false };
        dxDynamicControls.TagBoxFor('ddlRegions', data ,selectedValues, ddlRegionsExpr, false, function (e) { });
    },
    loadGroups: function (selectedValues) {
        var group = {};
        group.isDeleted = false;
        let xhr = ajaxHelper.ajaxPostJsonDataAndExtraParam(JSON.stringify(group), '/UserAccess/GetGroups', uac_User.loadGroupsSuccess, false, true, selectedValues);
    },
    loadGroupsSuccess: function (response, selectedValues) {
        const { data } = response;
        var cmbGroupExpr = { placeHolder: "Choose Group", valueField: "RoleId", textField: "RoleName", bool_ClearButton: false };
        dxDynamicControls.comboBoxFor('cmbGroup', { type: 'array', key: 'RoleId', data: data }, selectedValues, cmbGroupExpr, false, false, "", null, function (e) { });
    },
    loadFacilities: function (selectedValues) {
        let newSelectedValues = [];
        if (selectedValues !== null && selectedValues !== undefined) {
            newSelectedValues = selectedValues.map(function (e) { return e.facilityid; });
        }
        let xhr = ajaxHelper.ajaxGetJsonAndExtraParam('/Facilities/GetAllFacility', uac_User.loadFacilitiesSuccess, false, true, newSelectedValues);
    },
    loadFacilitiesSuccess: function (response, selectedValues) {
        const { data } = response;
        var ddlFacilityExpr = { placeHolder: "Choose Facility(s)", valueField: "facilityid", textField: "facilityName", bool_ClearButton: false };
        dxDynamicControls.TagBoxFor('ddlFacilities', data, selectedValues, ddlFacilityExpr, false, function (e) { });
    },
    SaveUser: function () {
        let user = {};
        user.UserId = $('#UserId').val();
        user.ProfilePicGuid = $('#imagebase64').val();
        user.FirstName = $('#txtFirsName').val();
        user.LastName = $('#txtLastName').val();
        user.Address1 = $('#txtAddress1').val();
        user.Address2 = $('#txtAddress2').val();
        user.City = $('#txtCity').val();
        user.State = $('#txtState').val();
        user.ZipCode = $('#txtZipCode').val();
        user.HomePhone = $('#txtHomePhone').val();
        user.AltPhone = $('#txtAltPhone').val();
        user.MobilePhone = $('#txtMobilePhone').val();
        user.Email = $('#txtEmail').val();
        user.AltEmail = $('#txtAltEmail').val();
        user.Notes = $('#txtNotes').val();
        user.UserName = $('#txtUserName').val();
        user.Password = $('#txtPassword').val();
        user.LdapUserName = $('#txtldapUserName').val();
        user.userFrom = $('#userFrom').val();
        user.JobTitleId = $('#cmbJobTitle').dxSelectBox('instance').option('value');
        user.JobStatusId = $('#cmbStatus').dxSelectBox('instance').option('value');
        user.CompanyId = $('#cmbCompany').dxSelectBox('instance').option('value');
        user.IsAllowPICC = $('#IsAllowPic').prop('checked');
        user.EciPrimaryName = $('#txtEciPrimaryName').val();
        user.EciPrimaryPhone = $('#txtEciPrimaryPhone').val();
        user.EciPrimaryRelation = $('#txtEciPrimaryRelation').val();
        user.EciSecondaryName = $('#txtEciSecondaryName').val();
        user.EciSecondaryPhone = $('#txtEciSecondaryPhone').val();
        user.EciSecondaryRealtion = $('#txtEciSecondaryRelation').val();
        user.IsFacUser = $('#IsFacilityUser').prop('checked');
        user.IsActive = $('#IsActive').prop('checked');
        user.RoleId = $('#cmbGroup').dxSelectBox('instance').option('value');
        user.UserRegions = $('#ddlRegions').dxTagBox('instance').option('selectedItems');
        user.UserFacilities = $('#ddlFacilities').dxTagBox('instance').option('selectedItems');
        let xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(user), '/UserAccess/SaveUser', uac_User.saveUserSuccess, false, true);

    },
    saveUserSuccess: function (data) {

        
        ati_common.notify(data.msg, data.msgType);
        opener.location.reload();
        window.top.close();//
        
    },
    FacilityUserClicked: function () {
        if ($('#IsFacilityUser').prop('checked')) {
            $('#navtabEmpData').hide();
            $('#navtabPayrollData').hide();
            $('#IsAllowPic').prop('checked',false);
            $('#lblIsAllowPic').hide();
            $('#lblFacilitites').text('Facility(s) :');

        }
        else {
            $('#navtabEmpData').show();
            $('#navtabPayrollData').show();
            $('#lblIsAllowPic').show();
            $('#lblFacilitites').text('Assign Additional Facility Outside an Assigned Region :');
        }

    }
}