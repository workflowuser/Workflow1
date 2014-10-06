/**
 * Upon calling a new wsLib_checkAll, designate check-all checkbox with the class ".js-<whichGroup>-check-all-master"
 * and designate the parent tag of the checkboxes targeted by the check-all checkbox with ".js-<whichGroup>-check-all-slaves".
 *
 * There is also the option of showing/hiding selections based on the status of the checkboxes via the classes
 * ".js-<whichGroup>-check-all-notice", ".js-<whichGroup>-check-exist-true", and ".js-<whichGroup>-check-exist-false",
 * with further options by adding ".js-<whichGroup>-check-all-select-entire" and ".js-<whichGroup>-check-all-select-none".
 *
 * @param {string} whichGroup - The name given to the classes this function affects.
 * @param {string} whichMessages - The name of the page to determine messages the variable "allCheckedNotice" should have.
 * @param {object} whichCallback - Contains callback functions for various checkbox toggling such as when there are an empty/partial/full amount of checkboxes used.
 */
function wsLib_checkAll(whichGroup, whichMessages, whichCallback) {
    // Makes "whichMessages" and "whichCallback" optional parameters
    if(whichMessages === undefined) {
        whichMessages = '';
    }
    if(whichCallback === undefined) {
        whichCallback = {};
    }
    if(whichCallback.empty === undefined) {
        whichCallback.empty = function(){};
    }
    if(whichCallback.partial === undefined) {
        whichCallback.partial = function(){};
    }
    if(whichCallback.full === undefined) {
        whichCallback.full = function(){};
    }
    if(whichCallback.toggleCheckbox === undefined) {
        whichCallback.toggleCheckbox = {};
    }
    if(whichCallback.toggleCheckbox.single === undefined) {
        whichCallback.toggleCheckbox.single = function(isChecked, $whichCheckbox){};
    }
    if(whichCallback.toggleCheckbox.all === undefined) {
        whichCallback.toggleCheckbox.all = function(isChecked){};
    }



    ///// jQuery Selector Variables

    var $master = $('.js-' + whichGroup + '-check-all-master');
    var $slaveRing = $('.js-' + whichGroup + '-check-all-slaves');
    var $slaves = $slaveRing.children('input[type="checkbox"]');
    var $allCheckedBar = $('.js-' + whichGroup + '-check-all-notice');
    var $oneCheckedExistTrue = $('.js-' + whichGroup + '-check-exist-true');
    var $oneCheckedExistFalse = $('.js-' + whichGroup + '-check-exist-false');



    ///// Other Variables

    var slaveCount = $slaves.length;

    // $allCheckedBar content
    var allCheckedNotice = [];
    if(whichMessages.toLowerCase() == "managelicense") {
        // Manage License Foundation Page

        /*** IMPORTANT: Replace "XXX" with total amount of licenses selected in the database. ***/
        var checkboxEntireCount = "XXX";

        allCheckedNotice[0] = 'All ' + slaveCount + ' licenses on this page are selected. ' + checkAllEntireNoneLink('Select all ' + checkboxEntireCount + ' licenses.', 'entire');
        allCheckedNotice[1] = 'All ' + checkboxEntireCount + ' licenses are selected. ' + checkAllEntireNoneLink('Select none.', 'none');
    }
    else if(whichMessages.toLowerCase() == "scheduledjobs") {
        // Scheduled Jobs Page

        /*** IMPORTANT: Replace "XXX" with total amount of licenses selected in the database. ***/
        var checkboxEntireCount = "XXX";

        allCheckedNotice[0] = 'All ' + slaveCount + ' jobs on this page are selected. ' + checkAllEntireNoneLink('Select all ' + checkboxEntireCount + ' jobs.', 'entire');
        allCheckedNotice[1] = 'All ' + checkboxEntireCount + ' jobs are selected. ' + checkAllEntireNoneLink('Select none.', 'none');

    }
    else if(whichMessages.toLowerCase() == "nameofpage") {
        // Add additional conditions for more $allCheckedBar messages
        allCheckedNotice[0] = 'This is #1. ' + checkAllEntireNoneLink('Message One', 'entire');
        allCheckedNotice[1] = '#1 "entire" leads to #2. ' + checkAllEntireNoneLink('Message Two', 'none');
    }
    else {
        /*** IMPORTANT: If using $allCheckedBar, this message should never be displayed to the user. ***/
        allCheckedNotice[0] = checkAllEntireNoneLink('Choose further option (select entire).', 'entire');
        allCheckedNotice[1] = checkAllEntireNoneLink('Cancel options (select none).', 'none');
    }



    ///// Other Functions

    // Add a link with the class ".js-<whichGroup>-check-all-select-<entire/none>" to the passed text for event listeners
    function checkAllEntireNoneLink(whichText, entireOrNone) {
        return '<a class="js-' + whichGroup + '-check-all-select-' + entireOrNone + '" href="#">' + whichText + '</a>';
    }

    // Pass true/false if checked checkbox exists and shows/hide $oneCheckedExist<True/False> accordingly
    function checkExistDisplay(atLeastOneChecked) {
        if(atLeastOneChecked) {
            $oneCheckedExistTrue.show();
            $oneCheckedExistFalse.hide();
        }
        else {
            $oneCheckedExistTrue.hide();
            $oneCheckedExistFalse.show();
        }
    }



    ///// Setting and initializing defaults and values

    $(document).ready(function() {
        // $master checkbox and all $slaves checkboxes on the page default to unchecked
        $master.prop('checked', false);
        $slaves.prop('checked', false);

        // Pre-set $allCheckedBar for visual purposes
        $allCheckedBar.html(allCheckedNotice[0]);
    });



    ///// jQuery Event Listeners Functions

    // Perform actions when $master checkbox checked/unchecked

    $master.change(function() {
        var checkAllStatus = this.checked;

        $slaves.prop('checked', checkAllStatus);

        checkExistDisplay(checkAllStatus);
        whichCallback.toggleCheckbox.all(checkAllStatus);

        if(checkAllStatus) {
            whichCallback.full();
            
            $allCheckedBar.slideDown('fast');
        }
        else {
            whichCallback.empty();
            
            $allCheckedBar.slideUp('fast', function() {
                $allCheckedBar.html(allCheckedNotice[0]);
            });
        }
    });

    // Perform actions when one of the $slaves checkboxes checked/unchecked
    $slaves.change(function() {
        // Opens $checkAllBar and checks $master if all $slaves checkboxes is checked
        // or it collapse and $master becomes indeterminate if at least one of $slaves checked and unchecked otherwise
        
        var $this = $(this);
        
        whichCallback.toggleCheckbox.single($this.prop('checked'), $this);

        var checkboxCheckedCount = $slaveRing.children(':checked').length;

        checkExistDisplay(checkboxCheckedCount !== 0);

        if(checkboxCheckedCount === slaveCount) {
            $master.prop({'checked': true, 'indeterminate': false});
            
            whichCallback.full();

            $allCheckedBar.slideDown('fast');
        }
        else if(checkboxCheckedCount !== 0) {
            $master.prop({'checked': false, 'indeterminate': true});
            
            whichCallback.partial();

            $allCheckedBar.slideUp('fast', function() {
                $allCheckedBar.html(allCheckedNotice[0]);
            });
        }
        else {
            $master.prop('indeterminate', false);
            
            whichCallback.empty();
        }
    });

    // Click "Select all <DATABASE COUNT> licenses." to display this. Database should select all at back-end.
    // This function has a specific purpose, but can be modified for other purposes.
    $allCheckedBar.on('click', '.js-' + whichGroup + '-check-all-select-entire', function(event) {
        event.preventDefault();

        $allCheckedBar.html(allCheckedNotice[1]);
    });

    // Click "Select none." to uncheck everything, including database.
    // This function has a specific purpose, but can be modified for other purposes.
    $allCheckedBar.on('click', '.js-' + whichGroup + '-check-all-select-none', function(event) {
        event.preventDefault();

        $slaves.prop('checked', false);
        $master.prop('checked', false);

        checkExistDisplay(false);

        $allCheckedBar.slideUp('fast', function() {
            $allCheckedBar.html(allCheckedNotice[0]);
        });
    });
}





/**
 * Upon calling a new wsLib_revealIfChanged, designate parent tag of group of checkboxes or selects that will
 * show Save/Cancel buttons when state changes with the class ".js-<whichGroup>-save-cancel-masters" and
 * designate the parent tag of the Save/Cancel buttons with the class ".js-<whichGroup>-save-cancel-slave".
 *
 * To add functionality to the Save/Cancel buttons, add the class ".js-<whichGroup>-save-button" to "Save"
 * and add the class ".js-<whichGroup>-cancel-button" to "Cancel", which will save a new checkbox state
 * or restore the previous checkbox states and re-hide the Save/Cancel buttons.
 *
 * @param {string} whichGroup - The name given to the classes this function affects.
 */
function wsLib_revealIfChanged(whichGroup) {
    ///// jQuery Selector Variables

    var $saveCancelMastersRing = $('.js-' + whichGroup + '-save-cancel-masters');
    var $saveCancelMastersCheckboxes = $saveCancelMastersRing.find('input[type="checkbox"]');
    var $saveCancelMastersSelects = $saveCancelMastersRing.find('select');
    var $saveCancelMasters = $saveCancelMastersCheckboxes.add($saveCancelMastersSelects);
    var $previousCheckboxState = $saveCancelMastersRing.find(':checked');
    var $previousSelectState = $saveCancelMastersRing.find('select').find('option:selected');
    var $saveCancelButtons = $('.js-' + whichGroup + '-save-cancel-slave');
    var $saveButton = $saveCancelButtons.find('.js-' + whichGroup + '-save-button');
    var $cancelButton = $saveCancelButtons.find('.js-' + whichGroup + '-cancel-button');



    ///// Other Functions

    function refreshPreviousStates() {
        $previousCheckboxState = $saveCancelMastersRing.find(':checked');
        $previousSelectState = $saveCancelMastersRing.find('select').find('option:selected');
    }



    ///// Setting and initializing defaults and values

    $(document).ready(function() {
        $saveCancelButtons.hide();
    });



    ///// jQuery Event Listeners Functions

    // Displays Save/Cancel buttons upon checking/unchecking checkbox in Foundation button/column
    $saveCancelMasters.change(function() {
        $saveCancelButtons.slideDown('fast');
    });

    // Clicking "Save" stores new previous checkbox state and hides Save/Cancel buttons
    $saveButton.click(function(event) {
        event.preventDefault();

        refreshPreviousStates();
        $saveCancelButtons.slideUp('fast');
    });

    // Clicking "Cancel" restores previous checkbox state and hides Save/Cancel buttons
    $cancelButton.click(function(event) {
        event.preventDefault();

        $saveCancelMastersCheckboxes.prop('checked', false);
        $previousCheckboxState.prop('checked', true);
        $previousSelectState.prop('selected', true);
        $saveCancelButtons.slideUp('fast');
    });
}





/**
 * Upon calling a new wsLib_dropdownPreventCollapse, designate target Bootstrap ".dropdown-menu"
 * with the class ".js-anti-collapse" to prevent it from collapsing when clicked upon.
 *
 * Exemptions can be made by adding the class ".js-anti-collapse-exemption" to the element
 * within ".js-anti-collapse" to allow the ".dropdown-menu" to continue collapse when clicked.
 * 
 * @requires bootstrap-dropdown.js
 */
function wsLib_dropdownPreventCollapse() {
    ///// jQuery Selector Variables

    var $antiCollapse = $('.js-anti-collapse');
    var $exemption = $antiCollapse.find('.js-anti-collapse-exemption');



    ///// Other Variables

    var exemptionClicked = false;



    ///// jQuery Event Listeners Functions

    // Confirms that an exemption has been clicked, no longer preventing Bootstrap dropdown collapse
    $exemption.click(function() {
        exemptionClicked = true;
    });

    // Prevents Bootstrap dropdown on $antiCollapse from collapsing if not an exemption
    $antiCollapse.click(function(event) {
        if(!exemptionClicked) {
            event.stopPropagation();
        }
        else {
            exemptionClicked = false;
        }
    });
}





/**
 * Upon calling a new wsLib_createBootstrapAlert(), a Bootstrap Alert box will be 
 * prepended to the target "$whichLocation".
 * 
 * @param {object} $whichLocation - The jQuery object which determines the location to prepend the Bootstrap Alert.
 * @param {string} whichMessage - The message that the Bootstrap Alert will contain.
 * @param {string} whichAlertType - Determines the class to determine the type of Bootstrap Alert (i.e. alert-error). - Options: 'default', 'block', 'error', 'success', 'info'
 * @param {boolean} isAutoDismiss - If true, the created Bootstrap Alert will automatically dismiss in a given amount of time.
 * @param {int} autoDismissDuration - The amount of milliseconds that the created Bootstrap Alert will be active until it is automatically dismissed.
 * 
 * @requires bootstrap-alert.js
 */
function wsLib_createBootstrapAlert($whichLocation, whichMessage, whichAlertType, isAutoDismiss, autoDismissDuration) {
    ///// Other Variables
    
    var alertBoxText = '';
    var alertTypeClass;
    
    
    
    // Makes "whichMessage", "whichAlertType", "isAutoDismiss", and "autoDismissDuration" optional parameters
    if(whichAlertType === undefined || whichAlertType == '' || whichAlertType == 'default') {
        alertTypeClass = '';
    }
    else {
        alertTypeClass = ' alert-' + whichAlertType;
    }
    
    if(isAutoDismiss === undefined) {
        isAutoDismiss = false;
    }
    
    if(autoDismissDuration === undefined) {
        autoDismissDuration = 5000;
    }
    
    // Use value of arguments to create Bootstrap Alert in a variable
    alertBoxText += '<div class="alert' + alertTypeClass + '">';
    alertBoxText += '<a class="close" data-dismiss="alert"><i class="icon-close"></i></a>';
    alertBoxText += whichMessage;
    alertBoxText += '</div>';
    
    
    
    // Insert Bootstrap Alert to beginning of target location
    $whichLocation.prepend(alertBoxText);
    
    ///// jQuery Selector Variable
    
    var $createdAlertBox = $whichLocation.find('.alert').first();
    
    // Enable ability to dismiss alert
    $createdAlertBox.alert();

    // If auto-dismiss, set timer to close new alert box automatically
    if(isAutoDismiss) {
        (function($autoDismissTarget) {
            window.setTimeout(function() {
                $autoDismissTarget.fadeTo(500, 0).slideUp(500, function() {
                    $(this).alert('close');
                });
            }, autoDismissDuration);
        })($createdAlertBox);
    }
}





/**
 * Upon calling a new wsLib_createBootstrapModal(), a Bootstrap Modal box will be generated if it doesn't exist and 
 * trigger the passed option.
 * 
 * @param {string} modalName - The name of the modal which becomes its id "#js-bootstrap-modal-<modalName>".
 * @param {string} modalOption - The option utilized by the designated modal if it exists.  See Bootstrap > JavaScript > Modal > Options for details.
 * @param {string} modalHeader - The content of the header of the modal.  It can contain HTML.
 * @param {string} modalBody - The content of the body of the modal.  It can contain HTML.
 * 
 * @requires bootstrap-modal.js
 */
function wsLib_activateBootstrapModal(modalName, modalOption, modalHeader, modalBody) {
    // If a modal with the name "modalName" does not exist yet, create it
    if($('#js-bootstrap-modal-' + modalName).length == 0) {
        // Makes "modalHeader" and "modalBody" optional parameters
        if(modalHeader === undefined) {
            modalHeader = '';
        }

        if(modalBody === undefined) {
            modalBody = '';
        }

        var modalText = '';

        modalText += '<div id="js-bootstrap-modal-' + modalName + '" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="' + modalName + 'Label" aria-hidden="true">';
        modalText += '<div class="row-fluid settings-info">';
        modalText += '<div class="span12">';
        modalText += '<div class="page-header clearfix">';
        modalText += '<h2>' + modalHeader + '</h2>';
        modalText += '<a href="#" class="trigger" data-dismiss="modal" aria-hidden="true"><i class="icon-close"></i></a>';
        modalText += '</div>';
        modalText += '</div>';
        modalText += '</div>';
        modalText += '<div class="row-fluid settings-info">';
        modalText += '<div class="span12">';
        modalText += '<p>' + modalBody + '</p>';
        modalText += '<div class="form-actions">';
        modalText += '<a class="btn btn-primary js-form-button-save" style="margin-top: 20px;"><span>Save</span></a>';
        modalText += '<a class="btn js-form-button-close" data-dismiss="modal" aria-hidden="true" style="margin-top: 20px;"><span>Close</span></a>';
        modalText += '</div>';
        modalText += '</div>';
        modalText += '</div>';
        modalText += '</div>';

        $('body').prepend(modalText);
    }

    // jQuery Object of the designated modal
    var $chosenModal = $('#js-bootstrap-modal-' + modalName);

    // If "modalHeader" or "modalBody" exists, replace modal header/body with the new values
    if(modalHeader !== undefined) {
        $chosenModal.find('h2').html(modalHeader);
    }

    if(modalBody !== undefined) {
        $chosenModal.find('p').html(modalBody);
    }

    // If "modalOption" exists, pass option to Bootstrap's modal() function
    if(modalOption !== undefined) {
        $chosenModal.modal(modalOption);
    }
}





/**
 * Upon calling a new wsLib_convertBootstrapDropdownToSelect(), Bootstrap Dropdown menus with the
 * class ".js-bootstrap-select" will be modified to behave similarly to a <select> tag.
 * 
 * @requires bootstrap-dropdown.js
 */
function wsLib_convertBootstrapDropdownToSelect($whichContainer, whichFunction) {
    var $bootstrapSelect;
    
    if($whichContainer !== undefined) { // if a container exists, focus only on the container
        $bootstrapSelect = $whichContainer.find('div.js-bootstrap-select'); // Dropdown to convert to "select"
    }
    else { // else select every ".js-bootstrap-select" element
        $bootstrapSelect = $('div.js-bootstrap-select'); // Dropdown to convert to "select"
    }
    
    $bootstrapSelect.children('ul').on('click', 'a', function(event) {
        event.preventDefault();
        
        var $this = $(this);
        
        $this.closest('ul')
             .children('li')
             .removeClass('js-bootstrap-select-chosen')
             .closest('.dropdown')
             .children('a')
             .text($this.text());
        
        $this.parent('li').addClass('js-bootstrap-select-chosen');
    });
    
    $bootstrapSelect.removeClass('js-bootstrap-select').addClass('js-bootstrap-select-active');
}





/**
 * Upon calling wsLib_createSpinJSInterstitial(), an overlay with a spin.js indicator will be generated, 
 * for the purpose of interstitial scenarios.
 * 
 * @param {boolean} isOpaque - If true, the overlay will be transparent and the spinner will be black.
 * 
 * @returns {function} removeInterstitial - The function necessary to remove the interstitial when returned into a variable.
 * 
 * @requires spin.js
 */
function wsLib_createSpinJSInterstitial(isOpaque) {
    // Makes "isOpaque" an optional parameter
    if(isOpaque === undefined) {
        isOpaque = false;
    }

    ///// Initial Variables

    var interstitialToInsert = '';
    
    // If isOpaque is false, the overlay will be semitransparent and the spinner will be white.
    var overlayOpacity = 0.5;
    var spinnerColor = '#fff';
    
    // If isOpaque is true, the overlay will be transparent and the spinner will be black.
    if(isOpaque) {
        overlayOpacity = 0;
        spinnerColor = '#000';
    }

    // Interstitial to prepend in DOM
    interstitialToInsert += '<div id="js-interstitial">';
    interstitialToInsert += '<div id="js-interstitial-overlay" style="position: fixed; top: 0%; left: 0%; width: 100%; height: 100%; z-index: 1000; background-color: #333; opacity: ' + overlayOpacity + '; filter: alpha(opacity=' + (overlayOpacity * 100) + ');"></div>';
    interstitialToInsert += '<div id="js-interstitial-visual" style="position: fixed; top: 50%; left: 50%; z-index: 1010;"></div>';
    interstitialToInsert += '</div>';
    
    $('body').prepend(interstitialToInsert);
    
    ///// jQuery Selector Variables

    var $interstitialOverlay = $('#js-interstitial-overlay');
    var $interstitialVisual = $('#js-interstitial-visual');



    // Generate new spin.js indicator with given properties
    var spinner = new Spinner({
        lines: 11, // The number of lines to draw
        length: 6, // The length of each line
        width: 5, // The line thickness
        radius: 20, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        trail: 60, // Afterglow percentage
        speed: 1, // Rounds per second
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: spinnerColor, // #rgb or #rrggbb
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    }).spin($interstitialVisual.get(0));
    
    // When called, remove the interstitial from the DOM
    function removeInterstitial() {
        $interstitialOverlay.add($interstitialVisual).remove();
    }
    
    // Returns function to receiving variable to call ability to remove interstitial
    return removeInterstitial;
}





/**
 * wsLib_activateDatePoints() sets up and adds "Date Selecting" functionality to 
 * the appropriate <select> tags.
 * 
 * @param {string} whichContainer - The name given to the containing ID this function affects.
 * @param {object} whichOptions - List of options to configure the Date Points with
 * @param {function} whichOptions.callback - Function to be called upon success of date points input.
 * @param {argument} whichOptions.argument - Argument to be passed into whichOptions.callback()
 * @param {object} whichOptions.todaysDate - Date object containing today's date if applicable.
 * 
 * @returns {function} getDatePoints() - Function returned can be used to retrieve the date points input.
 * 
 * @requires kendo.calendar.js
 * 
 * INCOMPLETE
 */
function wsLib_activateDatePoints(whichContainer, whichOptions) {
    // Makes "whichOptions" and its properties optional parameters
    if(whichOptions === undefined) {
        whichOptions = {};
    }
    if(whichOptions.callback === undefined) {
        whichOptions.callback = function() {};
    }
    if(whichOptions.todaysDate === undefined) {
        whichOptions.todaysDate = new Date(((new Date()).getUTCFullYear()), ((new Date()).getUTCMonth()), ((new Date()).getUTCDate()), 0, 0, 0);
    }
    
    var $datePointsContainer = $('#js-datepoints-' + whichContainer);
    
    // jQuery object representing the location of the "Date" <select> tag
    var $dateSelect = $datePointsContainer.find('select.js-datepoints-select');
    
    if(whichOptions.defaultDateRange !== undefined) {
        // If a defaultDateRange exists, set $dateSelect to it
        $dateSelect.val(whichOptions.defaultDateRange);
    }
    
    // jQuery objects representing the "Custom" option of the "Date" <select>.
    var $dateCustom = $datePointsContainer.find('.js-datepoints-custom');
    var $dateCustomBegin = $dateCustom.find('.js-datepoints-custom-begin');
    var $dateCustomEnd = $dateCustom.find('.js-datepoints-custom-end');
    var $dateCustomTrigger = $datePointsContainer.find('.js-datepoints-custom-trigger');
    
    // Kendo UI widget that adds date-choosing capabilities to an <input> tag
    $dateCustomBegin.kendoDatePicker();
    $dateCustomEnd.kendoDatePicker();
    wsLib_toggleViews("datepoints-" + whichContainer, 2, "select", "no", 400);
    
    // State variable containing dates and range
    var datePoints = {
        begin: undefined,
        end: undefined,
        range: undefined
    };
    
    
    
    
    
    /**
     * getDatePoints() gets and returns the object "datePoints".
     * 
     * @returns {object} datePoints
     */
    function getDatePoints() {
        return datePoints;
    }
    
    
    
    
    
    /**
     * getDateSelectValue() gets and returns the value of "$dateSelect".
     * 
     * @returns {object} datePoints
     */
    function getDateSelectValue() {
        return $dateSelect.val();
    }
    
    
    
    
    
    /**
     * getElementLocations() gets and returns various jQuery elements such as $dateSelect
     */
    function getElementLocations() {
        return {
            $dateSelect: $dateSelect,
            $dateCustomBegin: $dateCustomBegin,
            $dateCustomEnd: $dateCustomEnd
        }
    }

    
    
    
    
    
    /**
     * setSelectDatePoints() checks the Period <select> tags and adjusts 
     * datePoints accordingly if applicable.
     * 
     * @returns {Boolean} - true if applicable, false if not.
     */
    function setSelectDatePoints(isFirstCall) {
        // "Period" <select> tags values
        var currentDateTimeRange = $dateSelect.val();
        
        if(whichOptions.presetCustomDate !== undefined && isFirstCall) {
            // Allow custom date to be set initially.
            
            if(whichOptions.presetCustomDate.isKendoDateString) {
                var currentCustomDate = {
                    begin: whichOptions.presetCustomDate.begin.split('/'),
                    end: whichOptions.presetCustomDate.end.split('/')
                }
                
                datePoints.begin = new Date(parseInt(currentCustomDate.begin[2]), parseInt(currentCustomDate.begin[0]) - 1, parseInt(currentCustomDate.begin[1]), 0, 0, 0);
                datePoints.end = new Date(parseInt(currentCustomDate.end[2]), parseInt(currentCustomDate.end[0]) - 1, parseInt(currentCustomDate.end[1]), 0, 0, 0);
            }
            else {
                datePoints.begin = new Date(whichOptions.presetCustomDate.begin);
                datePoints.end = new Date(whichOptions.presetCustomDate.end);
            }
            
            datePoints.range = (datePoints.end.getTime() - datePoints.begin.getTime()) / 86400000;
            
            $dateSelect.val('custom');
            $dateSelect.trigger('change');
            
            $dateCustomBegin.val((datePoints.begin.getMonth() + 1) + '/' + datePoints.begin.getDate() + '/' + datePoints.begin.getFullYear());
            $dateCustomEnd.val((datePoints.end.getMonth() + 1) + '/' + datePoints.end.getDate() + '/' + datePoints.end.getFullYear());
        }
        else if(currentDateTimeRange == "custom" && isFirstCall) {
            // Hack to allow IE 8-9 to return a defined set of datePoints upon initial call
            
            if(whichOptions.defaultDateRange === undefined) {
                whichOptions.defaultDateRange = 30;
            }
            
            datePoints.range = whichOptions.defaultDateRange;
            datePoints.end = new Date(((new Date()).getUTCFullYear()), ((new Date()).getUTCMonth()), ((new Date()).getUTCDate()), 0, 0, 0); // Today's date upon loading the page
            datePoints.begin = datePoints.end = new Date(((new Date()).getUTCFullYear()), ((new Date()).getUTCMonth()), ((new Date()).getUTCDate()), 0, 0, 0); // Today's date upon loading the page
            datePoints.begin.setDate(datePoints.begin.getDate() - datePoints.range);
            
            return true;
        }
        else if(currentDateTimeRange != "custom") {
            // If not a custom date, reset and update widgets with the displayed settings

            datePoints.range = parseInt(currentDateTimeRange);

            datePoints.end = new Date(whichOptions.todaysDate.getTime());
            datePoints.begin = new Date(whichOptions.todaysDate.getTime());
            datePoints.begin.setDate(datePoints.begin.getDate() - datePoints.range);
            
            return true;
        }
        else {
            return false;
        }
    }
    
    setSelectDatePoints(true);
    
    
    
    
    
    // Calls function to update the widgets when date changes
    $dateSelect.change(function() {
        var setSuccess = setSelectDatePoints();
        
        if(setSuccess) {
            whichOptions.callback(whichOptions.argument);
        }
    });

    // Calls function to update the widgets if valid Custom date
    $dateCustomTrigger.click(function() {
        // Retrieve dates from Custom date range

        var dateCustomBeginValue = $dateCustomBegin.val().split('/');
        var dateCustomEndValue = $dateCustomEnd.val().split('/');

        var currentDatePointBegin = new Date(Date.UTC(parseInt(dateCustomBeginValue[2]), parseInt(dateCustomBeginValue[0]) - 1, parseInt(dateCustomBeginValue[1]), 0, 0, 0));
        var currentDatePointEnd = new Date(Date.UTC(parseInt(dateCustomEndValue[2]), parseInt(dateCustomEndValue[0]) - 1, parseInt(dateCustomEndValue[1]), 0, 0, 0));

        if((currentDatePointBegin != "Invalid Date") && (currentDatePointEnd != "Invalid Date") && (currentDatePointBegin < currentDatePointEnd)) {
            // If date range is accepted, update widgets based on selected date range

            // dateTimeRange is the difference in days between beginning date and end date
            datePoints.range = (currentDatePointEnd.getTime() - currentDatePointBegin.getTime()) / 86400000;

            // Reset date points to new date points
            datePoints.end = new Date(currentDatePointEnd.getTime());
            datePoints.begin = new Date(currentDatePointBegin.getTime());

            whichOptions.callback(whichOptions.argument);
        }
        else {
            // Else if rejected, function call to "wslib_master.js" to generate Bootstrap Error Alerts
            wsLib_createBootstrapAlert($('#mainsi'), "Please enter a valid time range.", "error", true);
        }
    });
    
    
    
    return {
        getDatePoints: getDatePoints,
        getDateSelectValue: getDateSelectValue,
        getElementLocations: getElementLocations
    };
}





/**
 * Upon calling a new wsLib_toggleViews(), the master elements designated with the classes
 * ".js-<whichGroup>-toggle-view-master-<0,1,2...>" will control the views designated with the classes
 * ".js<whichGroup>-toggle-view-slave-<0,1,2...>", where the master makes its corresponding slaves visible
 * and hides every other slave, with the exception of checkboxes and basic toggles in which their state represents their views' statuses.
 *
 * @param {string} whichGroup - The name given to the classes this function affects.
 * @param {string} whichMasterType - The type of the elements controlling the slave views. - Options: 'default', 'radio', 'checkbox', 'checkbox-reverse', 'select', 'basic', 'basic-prehidden'
 * @param {int} howManyViews - The amount of slave views that will be toggled upon.
 * @param {string} isFormField - Determines if slaves have eligible form fields for submission. - Options: 'yes', 'yes-peak', 'yes-peak-deeper', 'yes-deeper', 'no'
 * @param {int} howFast - Adds animation and determines speed to show/hide.
 */
function wsLib_toggleViews(whichGroup, howManyViews, whichMasterType, isFormField, howFast) {
    // Makes "whichMasterType", "isFormField", and "howFast" optional parameters
    if(whichMasterType === undefined) {
        whichMasterType = 'default';
    }

    if(isFormField === undefined) {
        isFormField = 'no';
    }

    if(howFast === undefined) {
        howFast = 0;
    }

    ///// jQuery Selector Variables
    var $masters = [];
    var $slaves = [];

    ///// Other Variables

    // If slaves have form fields eligible for submission, addFormEligible yields true
    var addFormEligible = (isFormField.toLowerCase().substr(0,3) == "yes");



    for(var i = 0; i < howManyViews; i++) {
        $masters[i] = $('.js-' + whichGroup + '-toggle-view-master-' + i);
        $slaves[i] = $('.js-' + whichGroup + '-toggle-view-slave-' + i);



        // If slave has form fields eligible for submission, add data for deeper visible fields
        if(addFormEligible) {
            // If slave is the highest eligible peak, then .data("eligible-peak") is true
            if((isFormField.toLowerCase() == "yes-peak-deeper") || (isFormField.toLowerCase() == "yes-peak")) {
                $slaves[i].data("eligible-peak", true);
            }
            else {
                $slaves[i].data("eligible-peak", false);
            }

            // If slave is able to go deeper, then .data("eligible-deeper") is true
            if((isFormField.toLowerCase() == "yes-peak-deeper") || (isFormField.toLowerCase() == "yes-deeper")) {
                $slaves[i].data("eligible-deeper", true);
            }
            else {
                $slaves[i].data("eligible-deeper", false);
            }

            // If slave is first, add .js-form-eligible by default
            if(i == 0) {
                $slaves[i].addClass('js-form-eligible');
            }
        }



        ///// jQuery Event Listener Functions
        if(whichMasterType.toLowerCase() == "radio") {
            // Radio master selected
            (function(whichMasterSlave) {
                $masters[whichMasterSlave].change(function() {
                    for(var j = 0; j < howManyViews; j++) {
                        // Hides all slaves that do not belong to the new master
                        if(j !== whichMasterSlave) {
                            $slaves[j].hide(howFast);

                            // If other slaves contains forms, remove .js-form-eligible mark from other slaves
                            if(addFormEligible) {
                                $slaves[j].removeClass('js-form-eligible');
                            }
                        }
                    }
                    // Show the slaves that do belong to the new master
                    $slaves[whichMasterSlave].show(howFast);

                    // If slave contains forms, mark slave as .js-form-eligible
                    if(addFormEligible) {
                        $slaves[whichMasterSlave].addClass('js-form-eligible');
                    }
                });
            })(i);
        }
        else if(whichMasterType.toLowerCase().substr(0,8) == "checkbox") {
            // Checkbox master selected
            (function(whichMasterSlave, isReverse) {
                $masters[whichMasterSlave].change(function() {
                    var checkboxStatus = this.checked;

                    // <checkboxStatus XOR isReverse> to determine if checkbox shows/hides on reverse
                    if(checkboxStatus != isReverse) {
                        $slaves[whichMasterSlave].show(howFast);

                        // If slave contains forms, mark slave as .js-form-eligible
                        if(addFormEligible) {
                            $slaves[whichMasterSlave].addClass('js-form-eligible');
                        }
                    }
                    else {
                        $slaves[whichMasterSlave].hide(howFast);

                        // If slave contains forms, remove .js-form-eligible mark from other slaves
                        if(addFormEligible) {
                            $slaves[whichMasterSlave].removeClass('js-form-eligible');
                        }
                    }
                });
            })(i, whichMasterType.toLowerCase() == "checkbox-reverse");
        }
        else if(whichMasterType.toLowerCase() == "select") {
            // Select master selected
            (function(whichMasterSlave) {
                $masters[whichMasterSlave].change(function() {
                    var selectedView = $(this).find('option:selected').data('toggle-view');

                    if(selectedView != undefined) {
                        for(var j = 0; j < howManyViews; j++) {
                            // Hides all slaves that were not selected via data-toggle-view attribute on <option> tag
                            if(j !== selectedView) {
                                $slaves[j].hide(howFast);

                                // If other slaves contains forms, remove .js-form-eligible mark from other slaves
                                if(addFormEligible) {
                                    $slaves[j].removeClass('js-form-eligible');
                                }
                            }
                        }
                        // Show the slaves that were selected via data-toggle-view attribute on <option> tag
                        $slaves[selectedView].show(howFast);

                        // If slave contains forms, mark slave as .js-form-eligible
                        if(addFormEligible) {
                            $slaves[selectedView].addClass('js-form-eligible');
                        }
                    }

                });
            })(i);
        }
        else if(whichMasterType.toLowerCase().substr(0,8) == "basic") {
        	console.log(i + " is basic");
            // Basic toggle where clicking on $masters switches display of corresponding $slaves
            (function(whichMasterSlave, isPreHidden) {
                // If true, show next. If false, hide next.
                // isPreShown indicates whether the slaves start out shown or hidden
                var showOrHide = isPreHidden;
                
                $masters[whichMasterSlave].click(function(event) {
                    event.preventDefault();
                    
                    if(showOrHide) {
                        $slaves[whichMasterSlave].show(howFast);

                        // If slave contains forms, mark slave as .js-form-eligible
                        if(addFormEligible) {
                            $slaves[whichMasterSlave].addClass('js-form-eligible');
                        }
                        
                        showOrHide = false;
                    }
                    else {
                        $slaves[whichMasterSlave].hide(howFast);

                        // If slave contains forms, remove .js-form-eligible mark from other slaves
                        if(addFormEligible) {
                            $slaves[whichMasterSlave].removeClass('js-form-eligible');
                        }
                        
                        showOrHide = true;
                    }
                });
            })(i, whichMasterType.toLowerCase() == "basic-prehidden");
        }
        else {
            // Default if not a specific $masters type
            (function(whichMasterSlave) {
                $masters[whichMasterSlave].click(function(event) {
                    event.preventDefault();
                    
                    for(var j = 0; j < howManyViews; j++) {
                        // Hides all slaves that do not belong to the new master
                        if(j !== whichMasterSlave) {
                            $slaves[j].hide(howFast);

                            // If other slaves contains forms, remove .js-form-eligible mark from other slaves
                            if(addFormEligible) {
                                $slaves[j].removeClass('js-form-eligible');
                            }
                        }
                    }

                    // Show the slaves that do belong to the new master
                    $slaves[whichMasterSlave].show(howFast);

                    // If slave contains forms, mark slave as .js-form-eligible
                    if(addFormEligible) {
                        $slaves[whichMasterSlave].addClass('js-form-eligible');
                    }
                });
            })(i);
        }
    }
}





/**
 * Upon calling a new wsLib_checkboxConditionalViews(), the master checkboxes designated with the classes
 * ".js-<whichGroup>-checkbox-conditional-view-master-<0,1,2...>" will control the views designated with the classes
 * ".js<whichGroup>-checkbox-conditional-view-slave-<0,1,2...>", where the masters make the slaves they have in common
 * visible and hide every other.
 *
 * There is also the option of displaying a notice when the checked $masters have no $slaves in common by adding
 * the class ".js-<whichGroup>-checkbox-conditional-view-contradictionnotice" to the target notice.
 *
 * This function can share the same classes as the function wsLib_checkAll() if designated within the same <whichGroup>.
 * These classes are ".js-<whichGroup>-check-all-master" and ".js-<whichGroup>-check-all-notice" which allows functionality
 * from wsLib_checkboxConditionalView() to correspond to wsLib_checkAll().
 *
 * @param {string} whichGroup - The name given to the classes this function affects.
 * @param {int} howManyViews - The amount of slave views that will be toggled upon.
 * @param {int} howFast - Adds animation and determines speed to show/hide.
 */
function wsLib_checkboxConditionalViews(whichGroup, howManyViews, howFast) {
    // Makes "howFast" an optional parameter
    if(howFast === undefined) {
        howFast = 0;
    }

    ///// jQuery Selector Variables

    var $masters = [];
    var $slaves = [];
    var $contradictionNotice = $('.js-' + whichGroup + '-checkbox-conditional-view-contradictionnotice');

    // jQuery Selector Variables pertaining to wsLib_checkAll()

    var $mastersCheckAll = $('.js-' + whichGroup + '-check-all-master');
    var $allCheckedBar = $('.js-' + whichGroup + '-check-all-notice');



    ///// Other Variables

    var masterStatus = [];          // Contains boolean values of each individual checkbox
    var overallMasterStatus = [];   // Contains boolean values of each group of checkboxes



    ///// Other Functions

    function showHideResults() {
        var selectorTally = '';     // Will contain combined selectors of selected $slaves
        var overallMasterStatusExists = false;

        for(var i = 0; i < howManyViews; i++) {
            if(overallMasterStatus[i]) {
                overallMasterStatusExists = true;
                selectorTally += $slaves[i].selector;
            }
            $slaves[i].hide(howFast);
        }

        var $finalSelection = $(selectorTally);

        // Display $slaves the checked $masters have in common
        $finalSelection.show(howFast);

        // If the checked $masters have no $slaves in common, display contradiction message
        if(($finalSelection.length == 0) && overallMasterStatusExists) {
            $contradictionNotice.show(howFast);
        }
        else {
            $contradictionNotice.hide(howFast);
        }
    }

    function changeAllMasterStatuses(whichStatus) {
        for(var i = 0; i < howManyViews; i++) {
            for(var j = 0; j < masterStatus[i].length; j++) {
                masterStatus[i][j] = whichStatus;
            }
            overallMasterStatus[i] = whichStatus;
        }
    }



    for(var i = 0; i < howManyViews; i++) {
        $masters[i] = $('.js-' + whichGroup + '-checkbox-conditional-view-master-' + i);
        $slaves[i] = $('.js-' + whichGroup + '-checkbox-conditional-view-slave-' + i);

        // Initializing variables
        masterStatus[i] = [];
        overallMasterStatus[i] = false;

        for(var j = 0; j < $masters[i].length; j++) {
            masterStatus[i][j] = false;
        }

        (function(whichMaster) {
            ///// Setting and initializing defaults and values

            $(document).ready(function() {
                // All $masters checkboxes on the page default to unchecked
                $masters[whichMaster].prop('checked', false);
            });



            ///// jQuery Event Listener Function

            $masters[whichMaster].change(function() {
                // Contains index of changed checkbox
                var selectedCheckbox = $masters[whichMaster].index(this);

                // checkboxStatus variable and corresponding masterStatus matches changed checkbox
                var checkboxStatus = masterStatus[whichMaster][selectedCheckbox] = this.checked;

                if(checkboxStatus) {
                    // If changed checkbox is true, corresponding overallMasterStatus is true
                    overallMasterStatus[whichMaster] = true;
                }
                else {
                    // Else it is false unless there is at least one other corresponding masterStatus that is true
                    overallMasterStatus[whichMaster] = false;

                    for(var k = 0; k < $masters[whichMaster].length; k++) {
                        overallMasterStatus[whichMaster] = (overallMasterStatus[whichMaster] || masterStatus[whichMaster][k]);
                    }
                }

                // Show $slaves that the $masters have in common
                showHideResults();
            });
        })(i);
    }



    // jQuery Event Listener Functions pertaining to wsLib_checkAll()

    // Switches status of all checkboxes to $mastersCheckAll and show results
    $mastersCheckAll.change(function() {
        changeAllMasterStatuses(this.checked);

        showHideResults();
    });

    // Switches status of all checkboxes to false upon clicking "Select none." in $allCheckedBar

    $allCheckedBar.on('click', '.js-' + whichGroup + '-check-all-select-none', function() {
        changeAllMasterStatuses(false);

        showHideResults();
    });
}





/**
 * 
 * Upon calling wsLib_activateSectionLock(), a section lock overlay will be generated if 
 * it does not yet exist and prevent clicking on anything outside of the section if outside.
 * 
 * INCOMPLETE
 * 
 * @param {boolean} isOutside - If true, sections that lock the outside will be activated.
 */
function wsLib_activateSectionLock(isOutside) {
    // Makes "isOutside" an optional parameter
    if(isOutside === undefined) {
        isOutside = false;
    }
    
    var isActive = false;

    var toggleOverlay;

    var $sectionLockOverlay;
    
    if(isOutside) {
        var $targetSection = $('.js-section-lock-outside');
        
        $sectionLockOverlay = $('div.js-section-lock-outside-overlay');

        if($sectionLockOverlay.length == 0) {
            $('body').append('<div class="js-section-lock-outside-overlay"></div>');

            $sectionLockOverlay = $('div.js-section-lock-outside-overlay');
        }
        
        toggleOverlay = function(forceDisplay) {
            if(forceDisplay !== undefined) {
                isActive = !forceDisplay;
            }

            if(isActive) {
                $sectionLockOverlay.hide();
                $targetSection.addClass('js-section-lock-outside').removeClass('js-section-lock-outside-activated');
            }
            else {
                $targetSection.addClass('js-section-lock-outside-activated').removeClass('js-section-lock-outside');
                $sectionLockOverlay.show();
            }

            isActive = !isActive;
        }
    }
    
    return toggleOverlay;
}






/**
 * Upon calling a new wsLib_radioForceUncheck(), the radio master elements designated with the class
 * ".js-<whichGroup>-radio-force-uncheck-master" will uncheck the checkboxes with parent tags designated
 * with the class ".js-<whichGroup>-radio-force-uncheck-slave-checkbox" and hide views (normally associated
 * with the same checkboxes) designated with the class ".js-<whichGroup>-radio-force-uncheck-slave-view".
 *
 * This function is useful alongside the function "wsLib_toggleViews()" that uses checkbox that toggle views.
 *
 * @param {string} whichGroup - The name given to the classes this function affects.
 */
function wsLib_radioForceUncheck(whichGroup) {
    ///// jQuery Selector Variables
    var $master = $('.js-' + whichGroup + '-radio-force-uncheck-master');
    var $slaveCheckboxesRing = $('.js-' + whichGroup + '-radio-force-uncheck-slave-checkbox');
    var $slaveCheckboxes = $slaveCheckboxesRing.find('input[type="checkbox"]');
    var $slaveViews = $('.js-' + whichGroup + '-radio-force-uncheck-slave-view');

    ///// jQuery Event Listener Function
    $master.change(function() {
        $slaveCheckboxes.prop('checked', false);
        $slaveViews.hide();
    });
}





/**
 * Upon calling a new wsLib_uncheckAll(), the element designated with the class ".js-<whichGroup>-uncheck-all-master"
 * will uncheck all checkboxes with parent tags designated with the class ".js-<whichGroup>-uncheck-all-slave".
 *
 * @param {string} whichGroup - The name given to the classes this function affects.
 */
function wsLib_uncheckAll(whichGroup) {
    var $master = $('.js-' + whichGroup + '-uncheck-all-master');
    var $slaveCheckboxesRing = $('.js-' + whichGroup + '-uncheck-all-slaves');
    var $slaveCheckboxes = $slaveCheckboxesRing.find('input[type="checkbox"]');

    $master.click(function(event) {
        event.preventDefault();

        $slaveCheckboxes.prop('checked', false);
    });
}





/**
 * Upon calling wsLib_clickAddRemoveClass(), $whichClick can be clicked to add/remove the class "whichClass" to $whichTarget.
 *
 * @param {object} $whichClick - The jQuery Object targeting the element(s) which will have an event listener attached.
 * @param {object} $whichTarget - The jQuery Object targeting the element(s) which will have a class added/removed.
 * @param {string} whichClass - The class that will be added/removed.
 * @param {string} addOrRemove - The option between adding or removing the selected class. - Options: 'add', 'remove'
 */
function wsLib_clickAddRemoveClass($whichClick, $whichTarget, whichClass, addOrRemove) {
    // Makes "addOrRemove" an optional parameter
    if(addOrRemove === undefined) {
        addOrRemove = 'add';
    }

    ///// jQuery Event Listener Function
    if(addOrRemove == "remove") {
        $whichClick.click(function() {
            $whichTarget.removeClass(whichClass);
        });
    }
    else {
        $whichClick.click(function() {
            $whichTarget.addClass(whichClass);
        });
    }
}





/**
 * Upon calling wsLib_defaultOnload(), all checkboxes with parents designated with the class ".js-default-onload-checkbox"
 * will be unchecked, all radio buttons designated with the class ".js-default-onload-radio" will be selected upon load, and
 * all selects with parents designated with the class ".js-default-onload-select" will default to the first option.
 *
 * This is to resolve the issue of form elements keeping their state upon refreshing the browser in Internet Explorer and Firefox.
 */
function wsLib_defaultOnload() {
    ///// jQuery Selector Variables
    var $selectsRing = $('.js-default-onload-select');
    var $selects = $selectsRing.find('select');
    var $checkboxesRing = $('.js-default-onload-checkbox');
    var $checkboxes = $checkboxesRing.find('input[type="checkbox"]');
    var $radiobuttons = $('.js-default-onload-radio');

    // Unchecks checkboxes and defaults radio buttons and selects
    $(document).ready(function() {
        $checkboxes.prop('checked', false);
        $radiobuttons.prop('checked', true);

        $selects.each(function() {
            $(this).find('option').first().prop('selected', true);
        });
    });
}





/**
 * Upon calling wsLib_activateTreeModel(), "div.tree-menu" will become a dynamic tree model.
 * 
 * NOT YET OPTIMIZED
 */
function wsLib_activateTreeModel() {
    var $treeMenu = $('div.tree-menu');
    var $treeMenuListElement = $treeMenu.children('.tree').find('li');
    var $treeMenuListTopElements = $treeMenu.children('.tree').children('li');
    
    function checkIfActiveLastVisible($whichNode) {
        if ($whichNode.length > 0) {
            if ($whichNode.closest('li').is($treeMenuListElement.not(':hidden').last())) {
                $whichNode.addClass('last-visible');
            }
            else {
                $whichNode.removeClass('last-visible');
            }
        }
    }
    
    $treeMenu.children('.dropdown').children('.dropdown-toggle').children('span').text('');
    
    $treeMenuListElement.each(function(){
        var $this = $(this);
        
        if($this.children('ul').length > 0) {
            $this.addClass('parent');
            $this.children('a')
                 .append('<i class="icon-tree-open plus-minus"></i>')
                 .filter('.active')
                 .children('.plus-minus')
                 .addClass('white');
        }
    });
    
    $treeMenu.find('.dropdown-menu').find('li').find('a').hover(function(){
            $(this).toggleClass('btn');
    });
    
    $treeMenuListElement.children('a').click(function(event) {
        event.preventDefault();
        
        var $this = $(this);
        
        $treeMenuListElement.children('a.active')
                            .removeClass('active')
                            .children('.plus-minus')
                            .removeClass('white');
        $treeMenuListElement.children('a.last-visible').removeClass('last-visible');
        $this.addClass('active');
        $this.children('.plus-minus').addClass('white');
        
        if ($this.closest('li').is($treeMenuListElement.not(':hidden').last())) {
            $this.addClass('last-visible');
        }
    });
    
    $treeMenu.find('li.parent').children('a').on('click', '.icon-tree-open, .icon-tree-close', function(event) {
        event.stopPropagation();
        event.preventDefault();
        
        var $this = $(this);
        
        $this.toggleClass('icon-tree-open').toggleClass('icon-tree-close');
        $this.closest('.parent').children('ul').slideToggle('fast', function() {
            checkIfActiveLastVisible($treeMenuListTopElements.last().children('a.active'));
        });
        
        checkIfActiveLastVisible($treeMenuListTopElements.last().children('a.active'));
    });
    
    $treeMenu.find('li.parent').children('a').on('dblclick', function(event) {
        event.stopPropagation();
        
        var $this = $(this);
        
        $this.children('i.plus-minus').toggleClass('icon-tree-open').toggleClass('icon-tree-close');
        $this.closest('.parent').children('ul').slideToggle('fast', function() {
            checkIfActiveLastVisible($treeMenuListTopElements.last().children('a.active'));
        });
        
        checkIfActiveLastVisible($treeMenuListTopElements.last().children('a.active'));
    });
    
    
    
    // Opens up all ancestors of .active node if applicable upon page load
    var $firstActiveNode = $treeMenuListElement.find('a.active').first(); // First node with .active class
    var $currentUL = $firstActiveNode.closest('ul'); // Current closest unordered list containing the node
    
    var callOffLoop = 0; // Variable for catching errors
    
    // If the current closest unordered list has the class ".tree", stop "opening" them.
    while (!$currentUL.hasClass('tree') && $firstActiveNode.length != 0) {
        callOffLoop++;
        
        // Show current unordered list and toggles +/- symbols accordingly
        $currentUL.show().siblings('a').children('i.plus-minus').toggleClass('icon-tree-open').toggleClass('icon-tree-close');
        
        $currentUL = $currentUL.closest('.parent').closest('ul'); // Add next closest unordered list to check
        
        // If this loop played over 1000 times, call it off it as it is likely an error
        if (callOffLoop > 1000) {
            console.error("ERROR - wslib_master.js [wsLib_activateTreeModel()] - Unable to open all ancestors of .active");
            
            break;
        }
    }
    
    
    
    // Removes all text within <i> icons to resolve issue with XSLT HTML generating
    $treeMenuListElement.find('i[class^="icon-"], i[class*=" icon-"]').text('');
}





/**
 * Upon calling wsLib_insertLastChildClass(), all last-children of the passed jQuery object has the class "last-child" 
 * added to it.
 * 
 * @param {object} $whichElements - The jQuery object which determines the elements to insert the "last-child" class to.
 */
function wsLib_insertLastChildClass($whichElements) {
    $whichElements.filter(':last-child').addClass('last-child');
}





/**
 * wsLib_addSifPlural() adds the letter "s" to the end of a word if the amount is plural.
 * 
 * @param {int} whichValue - Value to be determined if it is plural.
 * @returns {String} pluralText - String containing either nothing or an "s" to denote an item is plural.
 */
function wsLib_addSifPlural(whichValue) {
    var pluralText = '';
    
    if(whichValue !== 1) {
        pluralText = 's';
    }
    
    return pluralText;
}





/**
 * Upon calling wsLib_antiFlicker(), all elements targeted by ".js-anti-flicker" will be hidden until DOM fully loads
 *
 * INCOMPLETE
 */
function wsLib_antiFlicker() {
    $(document).ready(function() {
        $('.js-anti-flicker').show();
    });
}





/**
 * Upon calling wsLib_console(), the passed message will be displayed in the Web Console if it exists
 * 
 * INCOMPLETE
 */
function wsLib_console(whichMessage, whichType) {
    if (!window.console) {
        window.console = {};
    }
    if (!window.console.log) {
        window.console.log = function () { };
    }
    if (!window.console.error) {
        window.console.error = function () { };
    }
    
    
    
    if(whichType === undefined) {
        whichType = 'log';
    }
    
    if(console !== undefined) {
        if(whichType == 'error') {
            console.error(whichMessage);
        }
        else {
            console.log(whichMessage);
        }
    }
}





/**
 * Form Validation Library
 */

/**
 * Classes to use:
 * .js-form-eligible (visible)
 * .js-form-valid
 * .js-form-required
 */

function wsLib_formRetrieve() {
    var $totalData = $();

    var $allEligible = $('.js-form-eligible');
    
    function searchDeepestValid($currentEligible) {
        var isDeeper = $currentEligible.data("eligible-deeper");
        
        if(isDeeper) {
            $currentEligible.children('.js-form-eligible').each(function() {
                searchDeepestValid($(this));
            });
        }
        else {
            var $currentValid = $currentEligible.find('.js-form-valid');

            $totalData = $totalData.add($currentValid);
        }
    }
    
    $allEligible.each(function() {
        var $this = $(this);
        var $currentEligible = $this;

        var acceptAll = $this.data("form-acceptall");

        if(acceptAll) {
            var $currentFormElements = $this.find('input, select');

            $totalData = $totalData.add($currentFormElements);
        }
        else {
            var isPeak = $this.data("eligible-peak");

            if(isPeak) {
                searchDeepestValid($this);
            }
        }
    });

    // Returns the string of all eligible form data that can be submitted to the server
    return $totalData.serialize();
}





/**
 * Upon calling wsLib_debugWindow(), a debug window with a button is generated.
 * Clicking on the resulting button will execute the script in the passed string "scriptToTest".
 *
 * @param {string} scriptToTest - The string containing the script to execute upon clicking the "Test Script" button.
 */
function wsLib_debugWindow(scriptToTest) {
    var debugWindowContent = '';
    var debugCounter = 0;

    debugWindowContent += '<div id="js-debug-window" style="position: fixed; min-width: 200px; min-height: 100px; bottom: 30px; right: 30px; background-color: #CCCCCC; border: 1px solid #000; text-align: center;">';
    debugWindowContent += '<h2 style="margin-top: 15px;">';
    debugWindowContent += 'Debug Window';
    debugWindowContent += '</h2>';
    debugWindowContent += '<a id="js-debug-trigger" href="#" class="btn btn-primary" style="margin-left: 50px; margin-top: 5px;">';
    debugWindowContent += '<span>Test Script</span>';
    debugWindowContent += '</a>';
    debugWindowContent += '</div>';

    $('body').append(debugWindowContent);

    $('#js-debug-trigger').on('click', function() {
        debugCounter++;
        console.log("Script triggered " + debugCounter + " time(s).");

        eval(scriptToTest);
    });

    $('#js-debug-trigger').tooltip({
        html: false, 
        title: scriptToTest
    });
}





/** /
//////////////////////////////////////////////////////
// Example wsLib Library "activation" in JavaScript //
//////////////////////////////////////////////////////

var randomName = "anothergroupname";

////////////////////////////////////////////////////
// wsLib_checkAll requires HTML elements to have: //
// * .js-<whichGroup>-check-all-master            //
// * .js-<whichGroup>-check-all-slaves            //
//                                                //
// Optional classes to put into HTML elements:    //
// * .js-<whichGroup>-check-all-notice            //
// * .js-<whichGroup>-check-exist-true            //
// * .js-<whichGroup>-check-exist-false           //
////////////////////////////////////////////////////
wsLib_checkAll(0);
wsLib_checkAll(1);
wsLib_checkAll(2);
wsLib_checkAll('groupname');
wsLib_checkAll(randomName);

/////////////////////////////////////////////////////////////////////
// wsLib_revealIfChanged requires HTML elements to have: //
// * .js-<whichGroup>-save-cancel-masters                          //
// * .js-<whichGroup>-save-cancel-slave                            //
//                                                                 //
// Optional classes to put into HTML elements:                     //
// * .js-<whichGroup>-save-button                                  //
// * .js-<whichGroup>-cancel-button                                //
/////////////////////////////////////////////////////////////////////
wsLib_revealIfChanged(0);
wsLib_revealIfChanged(1);
wsLib_revealIfChanged(2);
wsLib_revealIfChanged('groupname');
wsLib_revealIfChanged(randomName);


///////////////////////////////////////////////////////////////////
// wsLib_dropdownPreventCollapse requires HTML elements to have: //
// * .dropdown-menu (Bootstrap)                                  //
// * .js-anti-collapse                                           //
//                                                               //
// Optional classes to put into HTML elements:                   //
// * .js-anti-collapse-exemption (recommended)                   //
///////////////////////////////////////////////////////////////////
wsLib_dropdownPreventCollapse();
/**/