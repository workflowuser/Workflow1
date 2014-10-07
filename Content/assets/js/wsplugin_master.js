/**
 * wsPlugin_ieFix_selectCutOff() fixes the issue with the width of the <option> tags not stretching 
 * beyond the width of the corresponding <select> tags when the text becomes wider than it in IE6-IE8.
 * 
 * Source: http://css-tricks.com/select-cuts-off-options-in-ie-fix/
 */
function wsPlugin_ieFix_selectCutOff() {
    var el;

    $("select").each(function() {
        el = $(this);
        el.data("origWidth", el.outerWidth()) // IE 8 can haz padding
    }).mouseenter(function() {
        $(this).css("width", "auto");
    }).bind("blur change", function() {
        el = $(this);
        el.css("width", el.data("origWidth"));
    });
}





/**
 * wsPlugin_ieFix_isoDatePolyfill() is a polyfill to allow IE8 to accept dates in the ISO 8601 format
 */
function wsPlugin_ieFix_isoDatePolyfill() {
    var D= new Date('2011-06-02T09:34:29+02:00');
    if(!D || +D!== 1307000069000){
        Date.fromISO= function(s){
            var day, tz,
            rx=/^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
            p= rx.exec(s) || [];
            if(p[1]){
                day= p[1].split(/\D/);
                for(var i= 0, L= day.length; i<L; i++){
                    day[i]= parseInt(day[i], 10) || 0;
                };
                day[1]-= 1;
                day= new Date(Date.UTC.apply(Date, day));
                if(!day.getDate()) return NaN;
                if(p[5]){
                    tz= (parseInt(p[5], 10)*60);
                    if(p[6]) tz+= parseInt(p[6], 10);
                    if(p[4]== '+') tz*= -1;
                    if(tz) day.setUTCMinutes(day.getUTCMinutes()+ tz);
                }
                return day;
            }
            return NaN;
        }
    }
    else{
        Date.fromISO= function(s){
            return new Date(s);
        }
    }
}





/**
 * wsPlugin_getURLParameter() takes the target key, decodes the URL for the key, and returns the resulting value.
 * 
 * Example: wsPlugin_getURLParameter('duration') in the url "dashboard.html?process=Create%20Customer&duration=14" returns "14"
 * 
 * @param {integer} name - The name of the key.
 * @returns {string} - Returns the value of the corresponding key in the URL.
 */
function wsPlugin_getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}



/**
 * wsPlugin_capitaliseFirstLetter() takes a string and returns the first letter capitalised.
 * 
 * @param {string} string - The string to be capitalised.
 * @returns {string} - Returns the string with the first letter capitalised.
 */
function wsPlugin_capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



/**
 * This adds the method ".hasScrollBar()" to jQuery objects to check if the element has a scrollbar.
 */
(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
    }
})(jQuery);