/// <reference path="ati_common.js" />

var ajaxHelper = {
    allXhrRequests: [],
    ajaxPostJsonData: function (jsonData, url, successFunc, isAsync) {
        var xhr = $.ajax({
            type: 'POST',
            url: url,
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            async: isAsync,
            data: jsonData,
            cache: false,
            success: function (data) {
                if ((data) && (data.isSession !== null)) {
                    if (data.isSession === false) {
                        if (data.data === "Login Failed") {
                            successFunc(data);
                        }
                        else {
                            ati_common.showModal("mdlSessionExpire");
                        }
                    }
                    else {
                        successFunc(data);
                    }
                }
            },
            error: function (jqXHR, exception) {
                var msg = ati_common.ajaxError(jqXHR, exception);
                ati_common.notify(msg, 2);
            }
        });
        return xhr;
    },
    ajaxPostJsonDataAndExtraParam: function (jsonData, url, successFunc, isPopup, isAsync, successParam) {
        var xhr = $.ajax({
            type: 'POST',
            url: url,
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            async: isAsync,
            data: jsonData,
            cache: false,
            success: function (data) {
                //debugger;
                if ((data) && (data.isSession != null)) {
                    if (data.isSession == false) {
                        ati_common.showModal("mdlSessionExpire");
                    }
                    else {
                        successFunc(data, successParam);
                    }
                }
            },
            error: function (jqXHR, exception) {
                var msg = ati_common.ajaxError(jqXHR, exception);
                ati_common.notify(msg, 2);
            }
        });
        return xhr;
    },
    ajaxGetJson: function (url, successFunc, isPopup, isAsync) {
        var xhr = $.ajax({
            type: 'GET',
            async: isAsync,
            url: url,
            datatype: 'json',
            cache: false,
            success: function (data) {
                //debugger;
                if ((data) && (data.isSession != null)) {
                    if (data.isSession == false) {
                        ati_common.showModal("mdlSessionExpire");
                    }
                    else {
                        successFunc(data.data);
                    }
                }
            },
            error: function (jqXHR, exception) {
                var msg = ati_common.ajaxError(jqXHR, exception);
                ati_common.notify(msg, 2);
            }
        });
        return xhr;
    },
    ajaxGetHtml: function (url, successFunc, isPopup, isAsync, successParam) {

        $.ajax({
            type: 'GET',
            async: true,
            url: '/Login/AjaxSessionCheck',
            datatype: 'json',
            cache: false,
            success: function (data) {
                if (!data) {
                    ati_common.showModal("mdlSessionExpire");
                    return false;
                }
                else {
                    $.get(url, function (data) {
                        return data;
                    }).done(function (data) {
                        successFunc(data);
                    }).fail(function (e, v) {
                    });
                }
            }
        });
    },
    ajaxGetJsonAndExtraParam: function (url, successFunc, isPopup, isAsync, successParam) {
        var xhr = $.ajax({
            type: 'GET',
            async: isAsync,
            url: url,
            datatype: 'json',
            cache: false,
            success: function (data) {
               // debugger;
                if ((data) && (data.isSession != null)) {
                    if (data.isSession == false) {
                        ati_common.showModal("mdlSessionExpire");
                    }
                    else {
                        successFunc(data, successParam);
                    }
                }
            },
            error: function (jqXHR, exception) {
                var msg = ati_common.ajaxError(jqXHR, exception);
                ati_common.notify(msg, 2);
            }
        });
        return xhr;
    },
    ajaxPostSerializeData: function (serializedData, url, successFunc, isPopup, isAsync) {
        var xhr = $.ajax({
            type: 'POST',
            url: url,
            async: isAsync,
            data: serializedData,
            cache: false,
            success: function (data) {
                //debugger;
                if ((data) && (data.isSession != null)) {
                    if (data.isSession == false) {
                        ati_common.showModal("mdlSessionExpire");
                    }
                    else {
                        successFunc(data);
                    }
                }
            },
            error: function (jqXHR, exception) {
                var msg = ati_common.ajaxError(jqXHR, exception);
                ati_common.notify(msg, 2);
            }
        });
        return xhr;
    },
    //ajaxGetHtml: function (url, successFunc, isPopup, isAsync, successParam) {
    //    var xhr = $.ajax({
    //        type: 'GET',
    //        async: isAsync,
    //        url: url,
    //        dataType: 'html',
    //        contentType: 'application/json; charset=utf-8',
    //        success: function (data) {
    //            debugger;
    //            successFunc(data, successParam);
    //        },
    //        error: function (jqXHR, exception) {
    //            var msg = ati_common.ajaxError(jqXHR, exception);
    //            ati_common.notify(msg, 2);
    //        }
    //    });
    //    return xhr;
    //},

    //Usage: example
    //var fileData = new FormData();
    //var files = fileControl.files;
    //fileData.append( files[0].name, files[0] );
    ajaxPostFileData: function (fileData, url, successFunc, isPopup, isAsync) {
        var xhr = $.ajax({
            url: url,
            type: "POST",
            contentType: false, // Not to set any content header  
            processData: false, // Not to process data  
            async: isAsync,
            data: fileData,
            success: function (data) {
                //debugger;
                if ((data) && (data.isSession != null)) {
                    if (data.isSession == false) {
                        ati_common.showModal("mdlSessionExpire");
                    }
                    else {
                        successFunc(data);
                    }
                }
            },
            error: function (jqXHR, exception) {
                var msg = ati_common.ajaxError(jqXHR, exception);
                ati_common.notify(msg, 2);
            }
        });
        return xhr;
    },
    ajaxPostImage: function (url, formdata, successFunc) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.send(formdata);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var picGuid = xhr.responseText.replace('"', '');
                picGuid = picGuid.substr(0, picGuid.indexOf('"'));
                successFunc(picGuid);
            }
        };
    }
};