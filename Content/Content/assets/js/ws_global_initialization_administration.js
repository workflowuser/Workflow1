if($('#js-label-moreoptions').length > 0) {
    $('#js-label-moreoptions').off('click.moreoptionsToggle').on('click.moreoptionsToggle', '.js-container-moreoptions-trigger', function(event) {
        event.preventDefault();

        var $this = $(this);

        var currentText = $this.text();

        $this.text(currentText === 'More Options' ? 'Fewer Options' : 'More Options');

        $('#js-container-moreoptions').slideToggle();
    });
}

if($('input.js-kendo-timepicker').length > 0) {
    $('input.js-kendo-timepicker').kendoTimePicker();
}

if($('input.js-kendo-datepicker').length > 0) {
    $('input.js-kendo-datepicker').kendoDatePicker();
}
