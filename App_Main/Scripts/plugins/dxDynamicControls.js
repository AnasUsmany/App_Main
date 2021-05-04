var dxDynamicControls = {
    textBoxFor: function (pControlID, txt_Value, bool_ShowClearButton, bool_ReadOnly, maskString, maskRules_RegExpr, bool_IsRequired, requiredMessage, validationGroupName) {
        if (bool_IsRequired) {
            $("#" + pControlID).dxTextBox({
                value: txt_Value,
                showClearButton: bool_ShowClearButton,
                readOnly: bool_ReadOnly,
                mask: maskString,
                maskRules: maskRules_RegExpr
            }).dxValidator({
                validationRules: [{
                    type: "required",
                    message: requiredMessage
                }],
                validationGroup: validationGroupName
            });
        }
        else {
            $("#" + pControlID).dxTextBox({
                value: txt_Value,
                showClearButton: bool_ShowClearButton,
                readOnly: bool_ReadOnly,
                mask: maskString,
                maskRules: maskRules_RegExpr
            });
        }
    },
    textAreaFor: function (pControlID, txt_Value, bool_ShowClearButton, bool_ReadOnly) {
        $("#" + pControlID).dxTextArea({
            value: txt_Value,
            showClearButton: bool_ShowClearButton,
            readOnly: bool_ReadOnly
        });
    },
    buttonFor: function (pControlID, btnText, validationGroupName, cssColorType, fOnClick) {
        $("#" + pControlID).dxButton({
            validationGroup: validationGroupName,
            text: btnText,
            type: cssColorType,
            onClick: function validate(params) {
                fOnClick(params);
            }
        });
    },
    checkBoxFor: function (pControlID, bool_Value, fOnValueChanged) {
        $("#" + pControlID).dxCheckBox({
            value: bool_Value,
            onValueChanged: function (e) {
                if (fOnValueChanged != null) {
                    fOnValueChanged(e);
                }
            }
        });
    },
    dateBoxFor: function (pControlID, dateAttr, datePickerType,minRange, maxRange, pValue, bool_IsRequired, requiredMessage, validationGroupName, fOnValueChanged, bool_readOnly) {
        if (bool_readOnly == null || bool_readOnly == undefined) {
            bool_readOnly = false;
        }
        if (bool_IsRequired) {
            if (dateAttr.dateType == "date") {
                return $("#" + pControlID).dxDateBox({
                    type: dateAttr.dateType,
                    min: minRange,
                    max: maxRange,
                    value: pValue,
                    readOnly: bool_readOnly,
                    dateSerializationFormat: "MM/dd/yyyy",
                    disabled: bool_readOnly,
                    displayFormat: "MM/dd/yyyy",
                    placeholder: "MM/DD/YYYY",
                    useMaskBehavior: true,
                    pickerType: datePickerType,
                    onValueChanged: function (e) {
                        if (fOnValueChanged != null) {
                            fOnValueChanged(e);
                        }
                    }
                }).dxValidator({
                    validationRules: [{
                        type: "required",
                        message: requiredMessage
                    }],
                    validationGroup: validationGroupName
                }).dxDateBox('instance');
            }
            else if (dateAttr.dateType == "time") {
                return $("#" + pControlID).dxDateBox({
                    type: dateAttr.dateType,
                    displayFormat: dateAttr.format,
                    value: pValue,
                    readOnly: bool_readOnly,
                    disabled: bool_readOnly,
                    //displayFormat: "HH:mm",
                    placeholder: "00:00",
                    useMaskBehavior: true,
                    onValueChanged: function (e) {
                        if (fOnValueChanged != null) {
                            fOnValueChanged(e);
                        }
                    }
                }).dxValidator({
                    validationRules: [{
                        type: "required",
                        message: requiredMessage
                    }],
                    validationGroup: validationGroupName
                }).dxDateBox('instance');
            }
        }
        else {
            if (dateAttr.dateType == "date") {
                return $("#" + pControlID).dxDateBox({
                    type: dateAttr.dateType,
                    min: minRange,
                    max: maxRange,
                    value: pValue,
                    readOnly: bool_readOnly,
                    dateSerializationFormat: "MM/dd/yyyy",
                    displayFormat: "MM/dd/yyyy",
                    placeholder: "MM/DD/YYYY",
                    useMaskBehavior: true,
                    pickerType: datePickerType,
                    onValueChanged: function (e) {
                        if (fOnValueChanged != null) {
                            fOnValueChanged(e);
                        }
                    }
                }).dxDateBox('instance');
            }
            else if (dateAttr.dateType == "time") {
                return $("#" + pControlID).dxDateBox({
                    type: dateAttr.dateType,
                    displayFormat: dateAttr.format,
                    value: pValue,
                    readOnly: bool_readOnly,
                    placeholder: "00:00",
                    useMaskBehavior: true,
                    onValueChanged: function (e) {
                        if (fOnValueChanged != null) {
                            fOnValueChanged(e);
                        }
                    }
                }).dxDateBox('instance');
            }
        }

    },

    dateTimeBoxFor: function (pControlID, dateAttr, datePicketType,minRange, maxRange, pValue, bool_IsRequired, requiredMessage, validationGroupName, fOnValueChanged, bool_readOnly) {
        if (bool_readOnly == null || bool_readOnly == undefined) {
            bool_readOnly = false;
        }
        if (bool_IsRequired) {

            return $("#" + pControlID).dxDateBox({
                type: dateAttr.dateType,
                min: minRange,//new Date(2000, 0, 1),
                max: maxRange,//new Date(2029, 11, 31),
                value: pValue,//new Date()
                readOnly: bool_readOnly,
                disabled: bool_readOnly,
                dateSerializationFormat: "MM/dd/yyyy HH:mm",
                displayFormat: "MM/dd/yyyy HH:mm",
                useMaskBehavior: true,
                pickerType: datePicketType,
                onValueChanged: function (e) {
                    if (fOnValueChanged != null) {
                        fOnValueChanged(e);
                    }
                }
            }).dxValidator({
                validationRules: [{
                    type: "required",
                    message: requiredMessage
                }],
                validationGroup: validationGroupName
            }).dxDateBox('instance');

        }
        else {

            return $("#" + pControlID).dxDateBox({
                type: dateAttr.dateType,
                min: minRange,//new Date(2000, 0, 1),
                max: maxRange,//new Date(2029, 11, 31),
                value: pValue,//new Date()
                readOnly: bool_readOnly,
                dateSerializationFormat: "MM/dd/yyyy HH:mm",
                displayFormat: "MM/dd/yyyy HH:mm",
                useMaskBehavior: true,
                pickerType: datePicketType,
                onValueChanged: function (e) {
                    if (fOnValueChanged != null) {
                        fOnValueChanged(e);
                    }
                }

            }).dxDateBox('instance');
        }
    },

    initValidator: function (pControlID, pType, pMessage, validationGroupName) {
        $('#' + pControlID).dxValidator({
            validationRules: [{
                type: pType,
                message: pMessage
            }],
            validationGroup: validationGroupName
        })
    },
    comboBoxFor: function (pControlID, items, selectedItemIndex, obj_expressions, bool_readOnly, bool_IsRequired, requiredMessage, validationGroupName, fOnSelectionChanged, acceptCustomValue) {
        //console.log(acceptCustomValue);	
        if (typeof acceptCustomValue !== "undefined") {
            acceptCustomValue = true;
        }
        if (bool_IsRequired) {
            return $("#" + pControlID).dxSelectBox({
                dataSource: {
                    store: items,
                    paginate: true
                },
                value: selectedItemIndex,
                acceptCustomValue: acceptCustomValue,
                placeholder: obj_expressions.placeHolder,
                displayExpr: obj_expressions.textField,
                valueExpr: obj_expressions.valueField,
                searchEnabled: true,
                showClearButton: obj_expressions.bool_ClearButton,
                readOnly: bool_readOnly,
                onSelectionChanged: function (e) {
                    if (fOnSelectionChanged != null) {
                        fOnSelectionChanged(e);
                    }
                }
            }).dxValidator({
                validationRules: [{
                    type: "required",
                    message: requiredMessage
                }],
                validationGroup: validationGroupName
            }).dxSelectBox('instance');
        }
        else {
            return $("#" + pControlID).dxSelectBox({
                dataSource: {
                    store: items,
                    paginate: true
                },
                value: selectedItemIndex,
                //value: items[selectedItemIndex],
                acceptCustomValue: acceptCustomValue,
                placeholder: obj_expressions.placeHolder,
                displayExpr: obj_expressions.textField,
                valueExpr: obj_expressions.valueField,
                searchEnabled: true,
                showClearButton: obj_expressions.bool_ClearButton,
                readOnly: bool_readOnly,
                onSelectionChanged: function (e) {
                    if (fOnSelectionChanged != null) {
                        fOnSelectionChanged(e);
                    }
                }
            }).dxSelectBox('instance');
        }

    },
    TagBoxFor: function (pControlID, items, selectedItemIndex, obj_expressions, bool_readOnly, fOnSelectionChanged) {
        
        return $("#" + pControlID).dxTagBox({
            
            dataSource: {
                store: items,
                pageSize: true
            },
            value: selectedItemIndex,
            showSelectionControls: true,
            searchEnabled: true,
            showClearButton: false,
            maxDisplayedTags:0,
            acceptCustomValue: false,
            placeholder: obj_expressions.placeHolder,
            displayExpr: obj_expressions.textField,
            valueExpr: obj_expressions.valueField,
            readOnly: bool_readOnly,
            onValueChanged: function (e) {
                if (fOnSelectionChanged != null) {
                    fOnSelectionChanged(e);
                }
            }
        }).dxTagBox('instance');

    },
    loadPanel: function (elemSelector, positionOfSelector, pOnShown, pOnHidden) {
        return $(elemSelector).dxLoadPanel({
            shadingColor: "rgba(0,0,0,0.4)",
            position: { of: positionOfSelector },
            visible: false,
            showIndicator: true,
            showPane: true,
            shading: true,
            closeOnOutsideClick: false,
            onShown: pOnShown,
            onHidden: pOnHidden
        }).dxLoadPanel("instance");
    },
    multiSelectBoxFor: function (pControlID, dataSourceObj, valueField, displayField, selectedValue, pPlaceHolder, parentIdExpr, pSelectionMode, fnOnSelectionChanged) {
        
        var treeView;

        var syncTreeViewSelection = function (treeView, value) {
            if (!value) {
                treeView.unselectAll();
                return;
            }

            value.forEach(function (key) {
                treeView.selectItem(key);
            });
        };

        var makeAsyncDataSource = function (obj) {
            return new DevExpress.data.CustomStore({
                loadMode: obj.loadMode,// "raw",
                key: obj.key,//"ID",
                paginate: true,
                pageSize: 10,
                load: function () {
                    return obj.list;
                }

            });
        };

        var getSelectedItemsKeys = function (items) {
            var result = [];
            items.forEach(function (item) {
                if (item.selected) {
                    result.push(item.key);
                }
                if (item.items.length) {
                    result = result.concat(getSelectedItemsKeys(item.items));
                }
            });
            return result;
        };

        $("#" + pControlID).dxDropDownBox({
            value: selectedValue,
            valueExpr: valueField,
            displayExpr: displayField,
            placeholder: pPlaceHolder,
            showClearButton: false,
            dataSource: dataSourceObj.list,

            contentTemplate: function (e) {
                var value = e.component.option("value"),
                    $treeView = $("<div id='treeView_" + pControlID + "'>").dxTreeView({
                        dataSource: e.component.option("dataSource"),
                        dataStructure: "plain",//plain or tree 
                        keyExpr: dataSourceObj.key,
                        parentIdExpr: parentIdExpr,
                        selectionMode: pSelectionMode,
                        displayExpr: displayField,
                        showCheckBoxesMode: "selectAll",//seletAll,normall,none
                        selectByClick: true,
                        cacheEnabled: false,
                        searchEnabled: true,
                        onContentReady: function (args) {
                            syncTreeViewSelection(args.component, value);
                        },
                        selectNodesRecursive: true,
                        onSelectAllValueChanged: function (args) {
                            var nodes = args.component.getNodes(),
                                value = getSelectedItemsKeys(nodes);
                            e.component.option("value", value);
                        },
                        onItemSelectionChanged: function (args) {
                            var nodes = args.component.getNodes(),
                                value = getSelectedItemsKeys(nodes);

                            e.component.option("value", value);
                        }
                    });

                treeView = $treeView.dxTreeView("instance");

                e.component.on("valueChanged", function (args) {
                    var value = args.value;
                    syncTreeViewSelection(treeView, value);
                    if (fnOnSelectionChanged && {}.toString.call(fnOnSelectionChanged) === '[object Function]') {
                        fnOnSelectionChanged(args);
                    }
                });
                return $treeView;

            }

        });


    },
    notifier: function (pMessage, pMy, pAt, notificationType, delay) {
        DevExpress.ui.notify({
            message: pMessage,
            position: {
                my: pMy,
                at: pAt
            }
        }, notificationType, delay);
    },
    GetData_Post: function (pUrl, pData, fn) {
        $.ajax({
            type: 'POST',
            url: pUrl,
            contentType: 'application/json; charset=utf-8;',
            dataType: 'json',
            data: pData,
            success: fn,//we will write logic for "session is true" here
            error: fn
            //timeout: 5000
        });
    },
    GetData_GET: function (pUrl, fn) {
        $.ajax({
            type: 'GET',
            url: pUrl,
            contentType: 'application/json; charset=utf-8;',
            dataType: 'json',
            success: fn,//we will write logic for "session is true" here
            error: fn
            //timeout: 5000
        });
    }
}