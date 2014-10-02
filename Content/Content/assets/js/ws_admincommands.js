function ws_admincommands() {
    var externalOptions = {};
    var commandsList;

    //var apiURL = "assets/json/ac_operator_defs.json";
    var baseURL = '/command';
    var apiURL = "";
    
    var whichAdminCommand = wsPlugin_getURLParameter('admincommandID');

    if (whichAdminCommand != undefined && whichAdminCommand != null) {

        apiURL = baseURL.concat('/get?commandKey=' + whichAdminCommand);
    }
    else {

        apiURL = baseURL.concat('/getall');
    }
    
    var activeURL = [location.protocol, '//', location.host, location.pathname].join('');
    var todaysDate = new Date();
    
    var $targetForm = $('#js-admincommands-form-base');
    var $targetFormOperations = $targetForm.children('fieldset');
    
    var $headerName = $('#js-header');
    
    
    
    getAdminCommand();
    
    
    
    function getAdminCommand() {
        $.ajax({
            url: apiURL,
            dataType: 'json',
            cache:false,
            success: function(data) {
                commandsList = data;
                
                processAdminCommands();
            },
            error: function (xhr, status, error) {
                wsLib_console({
                    xhr: xhr,
                    status: status,
                    error: error
                });
            }
        });
    }
    
    
    
    function processAdminCommands() {
        var chosenOperationData;
        
        
        
        function optionsPath(whichCondition, whichResults) {
            if(whichResults === undefined) {
                whichResults = {
                    ifTrue: '',
                    ifFalse: ''
                };
            }
            if(whichResults.ifTrue === undefined) {
                whichResults.ifTrue = '';
            }
            if(whichResults.ifFalse === undefined) {
                whichResults.ifFalse = '';
            }



            if(whichCondition && whichCondition !== undefined) {
                return whichResults.ifTrue;
            }
            else {
                return whichResults.ifFalse;
            }
        }
        
        
        
        var operationsHTML = '';
        
        for(var i = 0; i < commandsList.availableOperations.length; i++) {
            var currentOperationID = commandsList.availableOperations[i].operationID;
            
            operationsHTML += '<option value="' + currentOperationID + '"';
            
            if(currentOperationID === whichAdminCommand && currentOperationID !== undefined) {
                chosenOperationData = commandsList.availableOperations[i];
                
                operationsHTML += ' selected="selected"';
            }
            
            operationsHTML += '>';
            
            operationsHTML += commandsList.availableOperations[i].operationName;
            
            operationsHTML += '</option>';
        }
        
        if(chosenOperationData === undefined) {
            operationsHTML = '<option value="N/A" selected="selected">Select an operation</option>' + operationsHTML;
        }
        
        
        
        $('#js-admincommands-operation-list').empty().append(operationsHTML).change(function() {
            var targetOperation = $(this).val();
            
            window.location.href = activeURL + '?' + $.param({
                admincommandID: targetOperation
            });
        });
        
        
        
        if(whichAdminCommand === null) {
            var uncategorizedKey = "_uncategorized";
            
            var directoryKeys = [uncategorizedKey];
            
            var directoryItems = {};
            directoryItems[uncategorizedKey] = {
                "name": "",
                "operations": []
            };
            
            for(var i = 0; i < commandsList.availableOperations.length; i++) {
                var currentOperation = (commandsList.availableOperations[i]['operationGroup'] + "").toLowerCase();
                
                if(currentOperation === undefined || currentOperation === "") {
                    currentOperation = uncategorizedKey;
                }
                else if($.inArray(currentOperation, directoryKeys) === -1) {
                    directoryKeys.push(currentOperation);
                    
                    directoryItems[currentOperation] = {
                        "name": commandsList.availableOperations[i]['operationGroup'],
                        "operations": []
                    };
                }
                
                directoryItems[currentOperation]["operations"].push({
                    name: commandsList.availableOperations[i]['operationName'],
                    category: currentOperation,
                    url: activeURL + '?' + $.param({
                        admincommandID: commandsList.availableOperations[i]['operationID']
                    })
                });
            }
            
            
            
            function createDirectoryOperationHTML(whichDirectoryKey) {
                var directoryOperationHTML = '';
                
                directoryOperationHTML += '<ul>';
                
                directoryOperationHTML += '<li><h3>' + directoryItems[whichDirectoryKey].name + '</h3></li>';
                
                directoryOperationHTML += '<li>';
                directoryOperationHTML += '<ul>';
                
                for(var j = 0; j < directoryItems[whichDirectoryKey].operations.length; j++) {
                    directoryOperationHTML += '<li>';
                    directoryOperationHTML += '<a href="';
                    directoryOperationHTML += directoryItems[whichDirectoryKey].operations[j].url;
                    directoryOperationHTML += '">';
                    directoryOperationHTML += directoryItems[whichDirectoryKey].operations[j].name;
                    directoryOperationHTML += '</a>';
                    directoryOperationHTML += '</li>';
                }
                
                directoryOperationHTML += '</ul>';
                directoryOperationHTML += '</li>';
                
                directoryOperationHTML += '</ul>';
                
                return directoryOperationHTML;
            }
            
            
            
            var directoryHTML = '<div class="list-of-lists">';
            
            for(var i = 1; i < directoryKeys.length; i++) {
                directoryHTML += createDirectoryOperationHTML(directoryKeys[i]);
            }
            directoryHTML += createDirectoryOperationHTML(uncategorizedKey);
            
            directoryHTML += '</div>';
            
            
            
            $('#js-admincommands-base').empty().append(directoryHTML);
        }
        else if(chosenOperationData !== undefined) {
            $headerName.children('.js-text-header').css('display', 'inline-block').text(chosenOperationData.operationName);
            
            if(chosenOperationData.operationDef || chosenOperationData.operationDoc) {
                $headerName.children('.js-admincommands-operation-info').tooltip({
                    title: (function() {
                        var tooltipText = '';

                        tooltipText += '<div>';

                        tooltipText += optionsPath(chosenOperationData.operationDef, {
                            ifTrue: chosenOperationData.operationDef + '<br>'
                        });

                        tooltipText += optionsPath(chosenOperationData.operationDoc, {
                            ifTrue: '<a href="' + chosenOperationData.operationDoc + '" target="_blank">Documentation</a>'
                        });

                        tooltipText += '</div>';

                        return tooltipText;
                    })(),
                    html: true,
                    trigger: 'click',
                    animation: true,
                    placement: 'right'
                });
            }
            else {
                $headerName.children('.js-admincommands-operation-info').hide();
            }
            
            
            
            if(chosenOperationData.relatedLinks !== undefined) {
                var relatedLinksHTML = '';
                
                for(var i = 0; i < chosenOperationData.relatedLinks.length; i++) {
                    relatedLinksHTML += '<li>';
                    relatedLinksHTML += '<a href="';
                    
                    relatedLinksHTML += optionsPath(chosenOperationData.relatedLinks[i].type === 'admin', {
                        ifTrue: [location.protocol, '//', location.host, location.pathname].join('') + '?admincommandID=' + chosenOperationData.relatedLinks[i].url,
                        ifFalse: chosenOperationData.relatedLinks[i].url
                    });
                    
                    relatedLinksHTML += '">' + chosenOperationData.relatedLinks[i].label + '</a>';
                    relatedLinksHTML += '</li>';
                }
                
                $('#js-admincommands-relatedlinks').empty().append(relatedLinksHTML);
            }
            else {
                $('#js-admincommands-relatedlinks').empty();
            }
            
            
            
            var fieldHTML = '';
            var dataBank = {};
            var endTrigger = {};
            
            for(var i = 0; i < chosenOperationData.listOfFields.length; i++) {
                var currentField = chosenOperationData.listOfFields[i];
                
                if(currentField.options === undefined) {
                    currentField.options = {};
                }
                
                
                
                if(currentField.fieldType === 'string') {
                    fieldHTML += '<div class="control-group">';
                    
                        fieldHTML += '<label class="control-label">';
                        
                            fieldHTML += currentField.label;

                            fieldHTML += optionsPath(currentField.options.required, {
                                ifTrue: ' <span class="required">*</span>'
                            });
                        
                        fieldHTML += '</label>';
                        
                        fieldHTML += '<div class="controls">';
                        
                            fieldHTML += '<input type="text"';
                            
                            fieldHTML += optionsPath(currentField.fieldID, {
                                ifTrue: ' name="' + currentField.fieldID + '"',
                                ifFalse: ' name="fielditem_' + i + '"'
                            });
                            
                            fieldHTML += optionsPath(currentField.options.placeholder, {
                                ifTrue: ' placeholder="' + currentField.options.placeholder + '"'
                            });
                            
                            fieldHTML += optionsPath(currentField.options.cssClasses, {
                                ifTrue: ' class="' + currentField.options.cssClasses + '"'
                            });
                            
                            fieldHTML += optionsPath(currentField.options.style, {
                                ifTrue: ' style="' + currentField.options.style + '"'
                            });
                            
                            fieldHTML += '>';
                        
                        fieldHTML += '</div>';
                    
                    fieldHTML += '</div>';
                }
                
                else if(currentField.fieldType === 'password') {
                    fieldHTML += '<div class="control-group">';
                    
                        fieldHTML += '<label class="control-label">';
                        
                            fieldHTML += currentField.label;

                            fieldHTML += optionsPath(currentField.options.required, {
                                ifTrue: ' <span class="required">*</span>'
                            });
                        
                        fieldHTML += '</label>';
                        
                        fieldHTML += '<div class="controls">';
                        
                            fieldHTML += '<input type="password"';
                            
                            fieldHTML += optionsPath(currentField.fieldID, {
                                ifTrue: ' name="' + currentField.fieldID + '"',
                                ifFalse: ' name="fielditem_' + i + '"'
                            });
                            
                            fieldHTML += optionsPath(currentField.options.placeholder, {
                                ifTrue: ' placeholder="' + currentField.options.placeholder + '"'
                            });
                            
                            fieldHTML += optionsPath(currentField.options.cssClasses, {
                                ifTrue: ' class="' + currentField.options.cssClasses + '"'
                            });
                            
                            fieldHTML += optionsPath(currentField.options.style, {
                                ifTrue: ' style="' + currentField.options.style + '"'
                            });
                            
                            fieldHTML += '>';
                        
                        fieldHTML += '</div>';
                    
                    fieldHTML += '</div>';
                }
                
                else if(currentField.fieldType === 'checkbox') {
                    fieldHTML += '<div class="control-group">';
                    
                        fieldHTML += '<label class="control-label">';
                        
                            fieldHTML += currentField.label;

                            fieldHTML += optionsPath(currentField.options.required, {
                                ifTrue: ' <span class="required">*</span>'
                            });
                        
                        fieldHTML += '</label>';
                        
                        fieldHTML += '<div class="controls">';
                        
                            fieldHTML += '<ul class="checkbox-group';

                            fieldHTML += optionsPath(currentField.options.cssClasses, {
                                ifTrue: ' ' + currentField.options.cssClasses + '"',
                                ifFalse: '"'
                            });

                            fieldHTML += optionsPath(currentField.options.style, {
                                ifTrue: ' style="' + currentField.options.style + '"'
                            });

                            fieldHTML += '>';

                                if(currentField.group) {
                                
                                for(var j = 0; j < currentField.checkboxList.length; j++) {
                                
                                var currentCheckbox = currentField.checkboxList[j];
                                
                                fieldHTML += '<li>';

                                    fieldHTML += '<label>';

                                        fieldHTML += '<input type="checkbox"';
                                        
                                        fieldHTML += optionsPath(currentField.checkboxList[j].checkboxID, {
                                            ifTrue: ' name="' + currentField.checkboxList[j].checkboxID + '"',
                                            ifFalse: ' name="fielditem_' + i + '-' + j + '"'
                                        });

                                        fieldHTML += optionsPath(currentCheckbox.defaultValue, {
                                            ifTrue: ' checked="checked"'
                                        });

                                        fieldHTML += '>';
                                        
                                        fieldHTML += optionsPath(currentCheckbox.checkboxLabel, {
                                            ifTrue: ' ' + currentCheckbox.checkboxLabel
                                        });
                                        
                                    fieldHTML += '</label>';

                                fieldHTML += '</li>';
                                
                                }
                                
                                }
                                else {
                                fieldHTML += '<li>';

                                    fieldHTML += '<label>';

                                        fieldHTML += '<input type="checkbox"';
                                        
                                        fieldHTML += optionsPath(currentField.fieldID, {
                                            ifTrue: ' name="' + currentField.fieldID + '"',
                                            ifFalse: ' name="fielditem_' + i + '"'
                                        });

                                        fieldHTML += optionsPath(currentField.options.defaultValue, {
                                            ifTrue: ' checked="checked"'
                                        });

                                        fieldHTML += '>';

                                    fieldHTML += '</label>';

                                fieldHTML += '</li>';
                                }

                            fieldHTML += '</ul>';
                        
                        fieldHTML += '</div>';
                    
                    fieldHTML += '</div>';
                    
                }
                
                else if(currentField.fieldType === 'date') {
                    fieldHTML += '<div class="control-group">';
                    
                        fieldHTML += '<label class="control-label">';
                        
                            fieldHTML += currentField.label;

                            fieldHTML += optionsPath(currentField.options.required, {
                                ifTrue: ' <span class="required">*</span>'
                            });
                        
                        fieldHTML += '</label>';
                        
                        fieldHTML += '<div class="controls">';
                        
                            fieldHTML += '<ul class="date-group';

                            fieldHTML += optionsPath(currentField.options.cssClasses, {
                                ifTrue: ' ' + currentField.options.cssClasses + '"',
                                ifFalse: '"'
                            });

                            fieldHTML += optionsPath(currentField.options.style, {
                                ifTrue: ' style="' + currentField.options.style + '"'
                            });
                            
                            fieldHTML += '>';
                            
                                if(currentField.group) {
                                
                                for(var j = 0; j < currentField.dateList.length; j++) {
                                
                                var currentDate = currentField.dateList[j];
                                
                                if(currentDate.dateValue === 'TODAY') {
                                    currentDate.dateValue = (todaysDate.getMonth() + 1) + '/' + (todaysDate.getDate()) + '/' + (todaysDate.getFullYear());
                                }
                                
                                fieldHTML += '<li>';

                                fieldHTML += '<input';
                                
                                fieldHTML += optionsPath(currentField.dateList[j].dateID, {
                                    ifTrue: ' name="' + currentField.dateList[j].dateID + '"',
                                    ifFalse: ' name="fielditem_' + i + '-' + j + '"'
                                });
                                
                                fieldHTML += optionsPath(currentDate.dateLabel, {
                                    ifTrue: ' placeholder="' + currentDate.dateLabel + '"',
                                    ifFalse: ' placeholder="Date"'
                                });
                                
                                fieldHTML += optionsPath(currentDate.dateValue, {
                                    ifTrue: ' value="' + currentDate.dateValue + '"'
                                });
                                
                                fieldHTML += ' class="js-kendo-datepicker">';

                                fieldHTML += '</li>';
                                
                                }
                                
                                }
                                else {
                                fieldHTML += '<li>';

                                fieldHTML += '<input';
                                
                                fieldHTML += optionsPath(currentField.fieldID, {
                                    ifTrue: ' name="' + currentField.fieldID + '"',
                                    ifFalse: ' name="fielditem_' + i + '"'
                                });
                                
                                fieldHTML += ' placeholder="Date" class="js-kendo-datepicker">';

                                fieldHTML += '</li>';
                                }
                            
                            fieldHTML += '</ul>';
                        
                        fieldHTML += '</div>';
                    
                    fieldHTML += '</div>';
                    
                    
                    
                    endTrigger.kendoDatePicker = true;
                }
                
                else if(currentField.fieldType === 'dropdown') {
                    fieldHTML += '<div class="control-group">';
                    
                        fieldHTML += '<label class="control-label">';

                            fieldHTML += currentField.label;

                            fieldHTML += optionsPath(currentField.options.required, {
                                ifTrue: ' <span class="required">*</span>'
                            });

                        fieldHTML += '</label>';

                        fieldHTML += '<div class="controls">';

                            fieldHTML += '<select';
                            
                            fieldHTML += optionsPath(currentField.fieldID, {
                                ifTrue: ' name="' + currentField.fieldID + '"',
                                ifFalse: ' name="fielditem_' + i + '"'
                            });
                            
                            fieldHTML += optionsPath(currentField.options.cssClasses, {
                                ifTrue: ' class="' + currentField.options.cssClasses + '"'
                            });
                            
                            fieldHTML += optionsPath(currentField.options.style, {
                                ifTrue: ' style="' + currentField.options.style + '"'
                            });
                            
                            fieldHTML += '>';
                            
                            for(var j = 0; j < currentField.dropdownOptionsList.length; j++) {
                                var currentDropdownItem = currentField.dropdownOptionsList[j];
                                
                                fieldHTML += '<option';
                                
                                fieldHTML += optionsPath(currentDropdownItem.value, {
                                    ifTrue: ' value="' + currentDropdownItem.value + '"'
                                });
                                
                                fieldHTML += optionsPath(currentDropdownItem.selected, {
                                    ifTrue: ' selected="selected"'
                                });
                                
                                fieldHTML += '>';
                                
                                fieldHTML += currentDropdownItem.label;
                                fieldHTML += '</option>';
                            }
                            
                            fieldHTML += '</select>';
                        fieldHTML += '</div>';
                    
                    fieldHTML += '</div>';
                }
                
                else if(currentField.fieldType === 'file') {

                    fieldHTML += '<div class="control-group">';
                    
                        fieldHTML += '<label class="control-label">';
                        
                            fieldHTML += currentField.label;

                            fieldHTML += optionsPath(currentField.options.required, {
                                ifTrue: ' <span class="required">*</span>'
                            });
                        
                        fieldHTML += '</label>';
                        
                        fieldHTML += '<div class="controls">';
                        
                            fieldHTML += '<input type="file"';
                            
                            fieldHTML += optionsPath(currentField.fieldID, {
                                ifTrue: ' name="' + currentField.fieldID + '"',
                                ifFalse: ' name="fielditem_' + i + '"'
                            });
                            
                            fieldHTML += optionsPath(currentField.options.cssClasses, {
                                ifTrue: ' class="' + currentField.options.cssClasses + '"'
                            });
                            
                            fieldHTML += optionsPath(currentField.options.style, {
                                ifTrue: ' style="' + currentField.options.style + '"'
                            });
                            
                            fieldHTML += '>';
                        
                        fieldHTML += '</div>';
                    
                    fieldHTML += '</div>';
                }
                
                else if(currentField.fieldType === 'generationDropdown') {
                    dataBank[currentField.fieldID] = currentField.dropdownList;
                    
                    for(var j = 0; j < currentField.generationData.length; j++) {
                    var currentGeneration = currentField.generationData[j];
                    
                    fieldHTML += '<div class="control-group">';
                    
                        fieldHTML += '<label class="control-label">';

                            fieldHTML += currentGeneration.label;

                            fieldHTML += optionsPath(currentGeneration.required, {
                                ifTrue: ' <span class="required">*</span>'
                            });

                        fieldHTML += '</label>';

                        fieldHTML += '<div class="controls">';
                        
                            fieldHTML += '<select';
                            
                            fieldHTML += optionsPath(currentField.generationData[j].generationID, {
                                ifTrue: ' name="' + currentField.generationData[j].generationID + '"',
                                ifFalse: ' name="fielditem_' + i + '-' + j + '"'
                            });
                            
                            fieldHTML += ' data-generation-level="' + j + '" data-generationdropdown-id="' + currentField.fieldID + '" class="js-admincommands-form-field-generation';
                            
                            fieldHTML += optionsPath(currentField.options.cssClasses, {
                                ifTrue: ' ' + currentField.options.cssClasses + '"',
                                ifFalse: '"'
                            });
                            
                            fieldHTML += optionsPath(currentField.options.style, {
                                ifTrue: ' style="' + currentField.options.style + '"'
                            });
                            
                            fieldHTML += optionsPath(j === 0, {
                                ifFalse: ' disabled="disabled"'
                            });
                            
                            fieldHTML += '>';
                            
                                fieldHTML += '<option value="N/A">Select</option>';
                                
                                for(var k = 0; k < currentField.dropdownList.length; k++) {
                                
                                if(currentField.dropdownList[k].gen === j) {
                                
                                fieldHTML += '<option';
                                
                                fieldHTML += optionsPath(currentField.dropdownList[k].value, {
                                    ifTrue: ' value="' + currentField.dropdownList[k].value + '"'
                                });
                                
                                fieldHTML += ' data-item-id="' + currentField.dropdownList[k].ID + '">'
                                fieldHTML += currentField.dropdownList[k].label;
                                fieldHTML += '</option>';
                                
                                }
                                
                                }
                            
                            fieldHTML += '</select>';
                        
                        fieldHTML += '</div>';
                    
                    fieldHTML += '</div>';
                    }
                    
                    endTrigger.generationDropdown = true;
                }
                
                else if(currentField.fieldType === 'event-MOREOPTIONS') {
                    fieldHTML += '<div id="js-label-moreoptions" class="control-group"><label class="control-label"><a class="js-container-moreoptions-trigger" href="#">More Options</a></label><div class="controls"><div class="line"></div></div></div>';
                    fieldHTML += '<div id="js-container-moreoptions" class="js-initial-hide">';
                    
                    endTrigger.moreOptions = true;
                }
                
                else {
                    wsLib_console("Invalid Field Type: " + currentField.fieldType, 'error');
                    wsLib_console({
                        operationID: chosenOperationData.operationID,
                        fieldID: currentField.fieldID
                    }, 'error');
                }
            }
            
            
            
            fieldHTML += optionsPath(endTrigger.moreOptions, {
                ifTrue: '</div>'
            });
            
            
            
            $targetFormOperations.append(fieldHTML);
            
            
            
            if(endTrigger.kendoDatePicker) {
                $('input.js-kendo-datepicker').kendoDatePicker();
            }
            
            if(endTrigger.generationDropdown) {
                var $allGenerationDropdownSelects = $('select.js-admincommands-form-field-generation');
                
                $targetForm.off('change.generationDropdown').on('change.generationDropdown', 'select.js-admincommands-form-field-generation', function() {
                    var $this = $(this);
                    
                    var dataOnChange = {
                        generationDropdownID: $this.data('generationdropdown-id'),
                        generationLevel: parseInt($this.data('generation-level')),
                        selectedOption: $this.find(':selected').data('item-id')
                    };
                    
                    var currentDataBank = dataBank[dataOnChange.generationDropdownID];
                    var nextGeneration = dataOnChange.generationLevel + 1;
                    
                    if(dataOnChange.selectedOption !== undefined) {
                        var hasAtLeastOneOption = false;
                        
                        var $targetDisplay = $allGenerationDropdownSelects.filter('[data-generationdropdown-id="' + dataOnChange.generationDropdownID + '"]')
                                                     .filter('[data-generation-level="' + nextGeneration + '"]')
                                                     .empty()
                                                     .append((function() {
                            var targetOptionHTML = '';
                            
                            targetOptionHTML += '<option value="N/A">Select</option>';
                            
                            for(var i = 0; i < currentDataBank.length; i++) {
                                if(currentDataBank[i].gen === nextGeneration && currentDataBank[i].parent === dataOnChange.selectedOption) {
                                    hasAtLeastOneOption = true;
                                    
                                    targetOptionHTML += '<option';

                                    targetOptionHTML += optionsPath(currentDataBank[i].value, {
                                        ifTrue: ' value="' + currentDataBank[i].value + '"'
                                    });

                                    targetOptionHTML += ' data-item-id="' + currentDataBank[i].ID + '">'
                                    targetOptionHTML += currentDataBank[i].label;
                                    targetOptionHTML += '</option>';
                                }
                            }
                            
                            return targetOptionHTML;
                        })());
                        
                        if(hasAtLeastOneOption) {
                            $targetDisplay.prop("disabled", false);
                        }
                        else {
                            $targetDisplay.val("N/A")
                                          .prop("disabled", true);
                        }
                        
                        
                        
                        $allGenerationDropdownSelects.filter('[data-generationdropdown-id="' + dataOnChange.generationDropdownID + '"]')
                                                     .filter(function() {
                            return parseInt($(this).attr('data-generation-level')) >= (nextGeneration + 1);
                        })
                                                     .val("N/A")
                                                     .prop("disabled", true);
                    }
                    else {
                        $allGenerationDropdownSelects.filter('[data-generationdropdown-id="' + dataOnChange.generationDropdownID + '"]')
                                                     .filter(function() {
                            return parseInt($(this).attr('data-generation-level')) >= nextGeneration;
                        })
                                                     .val("N/A")
                                                     .prop("disabled", true);
                    }
                });
            }
            
            
            
            var verboseText = '<div class="control-group"><label class="control-label">Verbose</label><div class="controls"><ul class="checkbox-group"><li><label><input name="_verbose" type="checkbox"></label></li></ul></div></div>';
            
            if(endTrigger.moreOptions) {
                $('#js-label-moreoptions').off('click.moreoptionsToggle').on('click.moreoptionsToggle', '.js-container-moreoptions-trigger', function(event) {
                    event.preventDefault();
                    
                    var $this = $(this);
                    
                    var currentText = $this.text();
                    
                    $this.text(currentText === 'More Options' ? 'Fewer Options' : 'More Options');
                    
                    $('#js-container-moreoptions').slideToggle();
                });
                
                $('#js-container-moreoptions').append(verboseText);
            }
            else {
                $targetFormOperations.append(verboseText);
            }
            
            
            
            $('#js-form-submitcancel').on('click', '.js-form-button-submit', function(event) {
                event.preventDefault();
                
                var serializedData = $targetForm.serialize();
                
                wsLib_console({
                    serializedData: serializedData
                });
            });
        }
        else {
            $targetFormOperations.empty().append('<div class="control-group"><label class="control-label"></label><div class="controls"><div style="color: red;">Error: Incorrect URL Query</div></div></div>');
        }
    }
    
    
    
    externalOptions.$targetForm = $targetForm;
    
    return externalOptions;
}
