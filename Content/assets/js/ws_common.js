var ws_initializeWebApp = function (url, target, callback) {

    ws_ajaxCall(url, null, function (data, callbackdata) {
        $(target).find('option').remove();
        var options = getOption(data);
        $(target).append($(options));

        // callback after this.
        if (callback != null && callback != undefined) {
            callback(data, callbackdata);
        }
    }, null, null);

    function getOption(data) {
        var option = '';

        $.each(data, function (k, v) {
            option += '<option value="' + v.WebAppUrl + '">' + v.Name + '</option>';
        });

        return option;
    }
}

function ws_ajaxCall(url, data, callbackSuccess, callbackError, callbackdata) {
    $.ajax({
        url: url,
        data: data,
        cache: false,
        success: function (data) {
            if (callbackSuccess != null && callbackSuccess != undefined)
                callbackSuccess(data, callbackdata);
        },
        error: function (xhr, status, error) {
            if (callbackError != null && callbackError != undefined)
                callbackError(xhr, status, error, callbackdata);
        }
    });
}	