var uac_User = {

    CreateControls: function (model) {
        debugger;
        if (model !== null && model.UserId>0) {

            
            uac_User.loadGroups(model.RoleId);
            $('.passwordDiv').hide();
            uac_User.fillForm(model);
            
        }
        else {
            
            uac_User.loadGroups();
            
        }
        setTimeout(function () {
            let viewMode = new URL(window.location.href).searchParams.get('View');
            if (viewMode) {
                var inputs = document.getElementsByTagName("INPUT");
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].disabled = true;
                }
                $('#cmbGroup').dxSelectBox('instance').option('readOnly', true);
            }
        }, 3000);
    },
    fillForm: function (user) {
        
        if (user.ProfilePicPath !== null) {
            $('#img-upload').attr('src', '/Content/Images/ProfilePictures/' + user.ProfilePicGuid);
            $('#imagebase64').val(user.ProfilePicPath);
        }


        $('#txtName').val(user.Name);
        $('#txtCity').val(user.City);
        $('#txtState').val(user.State);
        $('#txtZipCode').val(user.ZipCode);
        $('#txtMobilePhone').val(user.MobilePhone);
        $('#txtEmail').val(user.Email);
        $('#txtUserName').val(user.UserName).attr('disabled', 'disabled');
        $('#txtCompanyName').val(user.CompanyName);
        $('#IsAllowLogin').prop('checked', user.IsAllowLogin);
        $('#txtEciSecondaryRelation').val(user.EciSecondaryRealtion);
        $('#IsFacilityUser').prop('checked', user.IsFacUser);
        $('#IsActive').prop('checked', user.IsActive);
        

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
    SaveUser: function () {
        let user = {};
        user.UserId = $('#UserId').val();
        user.ProfilePicPath = $('#imagebase64').val();
        user.Name = $('#txtName').val();
        user.City = $('#txtCity').val();
        user.State = $('#txtState').val();
        user.ZipCode = $('#txtZipCode').val();
        user.CompanyName = $('#txtCompanyName').val();
        user.MobilePhone = $('#txtMobilePhone').val();
        user.Email = $('#txtEmail').val();
        user.UserName = $('#txtUserName').val();
        user.Password = $('#txtPassword').val();
        user.IsAllowLogin = $('#IsAllowLogin').prop('checked');
        user.IsActive = $('#IsActive').prop('checked');
        user.RoleId = $('#cmbGroup').dxSelectBox('instance').option('value');



        let xhr = ajaxHelper.ajaxPostJsonData(JSON.stringify(user), '/UserAccess/SaveUser', uac_User.saveUserSuccess, false, true);

    },
    saveUserSuccess: function (data) {

        
        ati_common.notify(data.msg, data.msgType);
        opener.location.reload();
        window.top.close();
        
    }
}