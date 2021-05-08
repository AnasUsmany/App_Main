let login = {

    showmodal: function () {
        $('#forgotpasswordmodal').modal('show');
    },
    ResetPassword: function () {
        let email = {};
        email.Email = $('#txtEmail').val();
        dxDynamicControls.GetData_Post('Login/ResetPassword', JSON.stringify(email), login.ResetPasswordSuccess);
    },
    ResetPasswordSuccess: function (data) {
        alert(data);
    },
    btnLogin_click: function () {
        let email = {};
        let UserName = $('#txtUserName').val();
        let Password = $('#txtpassword').val();

        if (UserName === '') {
            ati_common.notify('Username is null', 2);
        }
        else if (Password === '') {
            ati_common.notify('Password is null', 2);
        }
        else {

            let fDate = new Date();
            fDate = fDate.getMonth() + 1 + '/' + fDate.getDate() + '/' + fDate.getFullYear() + " " + fDate.getHours() + ":" + fDate.getMinutes();
            
            email.UserName = UserName;
            email.Password = Password;
            email.LoginDate = fDate;
            dxDynamicControls.GetData_Post('Login/Loginclick', JSON.stringify(email), login.loginsuccess);
        }

    },
    loginsuccess: function (data) {
        ati_common.notify(data.msg, data.msgType);
        if (data.msgType === 1) {
            window.location.href = '/Dashboard/Index';
        }
    }


};