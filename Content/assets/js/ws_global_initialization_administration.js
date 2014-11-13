/*
 * Minified small plugins
 */

!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){function e(a){window.console&&console.warn&&console.warn(a)}var b=function(c,d){b._registry.push(this),this.$textarea=c,this.$textCopy=a("<span />"),this.$clone=a("<pre class='expanding-clone'><br /></pre>").prepend(this.$textCopy),this._resetStyles(),this._setCloneStyles(),this._setTextareaStyles(),c.wrap(a("<div class='expanding-wrapper' style='position:relative' />")).after(this.$clone),this.attach(),this.update(),d.update&&c.bind("update.expanding",d.update)};b._registry=[],b.getExpandingInstance=function(c){var d=a.map(b._registry,function(a){return a.$textarea[0]}),e=a.inArray(c,d);return e>-1?b._registry[e]:null};var c=function(){var a=-1;if("Microsoft Internet Explorer"===navigator.appName){var b=navigator.userAgent,c=new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");null!==c.exec(b)&&(a=parseFloat(RegExp.$1))}return a}(),d="oninput"in document.createElement("input")&&9!==c;b.prototype={attach:function(){var a="input.expanding change.expanding",b=this;d||(a+=" keyup.expanding"),this.$textarea.bind(a,function(){b.update()})},update:function(){this.$textCopy.text(this.$textarea.val().replace(/\r\n/g,"\n")),this.$textarea.triggerHandler("update.expanding")},destroy:function(){this.$clone.remove(),this.$textarea.unwrap().attr("style",this._oldTextareaStyles||""),delete this._oldTextareaStyles;var c=a.inArray(this,b._registry);c>-1&&b._registry.splice(c,1),this.$textarea.unbind("input.expanding change.expanding keyup.expanding update.expanding")},_resetStyles:function(){this._oldTextareaStyles=this.$textarea.attr("style"),this.$textarea.add(this.$clone).css({margin:0,webkitBoxSizing:"border-box",mozBoxSizing:"border-box",boxSizing:"border-box",width:"100%"})},_setCloneStyles:function(){var a={display:"block",border:"0 solid",visibility:"hidden",minHeight:this.$textarea.outerHeight()};"off"===this.$textarea.attr("wrap")?a.overflowX="scroll":a.whiteSpace="pre-wrap",this.$clone.css(a),this._copyTextareaStylesToClone()},_copyTextareaStylesToClone:function(){var b=this,c=["lineHeight","textDecoration","letterSpacing","fontSize","fontFamily","fontStyle","fontWeight","textTransform","textAlign","direction","wordSpacing","fontSizeAdjust","wordWrap","word-break","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth","paddingLeft","paddingRight","paddingTop","paddingBottom","maxHeight"];a.each(c,function(a,c){var d=b.$textarea.css(c);b.$clone.css(c)!==d&&(b.$clone.css(c,d),"maxHeight"===c&&"none"!==d&&b.$clone.css("overflow","hidden"))})},_setTextareaStyles:function(){this.$textarea.css({position:"absolute",top:0,left:0,height:"100%",resize:"none",overflow:"auto"})}},a.expanding=a.extend({autoInitialize:!0,initialSelector:"textarea.expanding",opts:{update:function(){}}},a.expanding||{}),a.fn.expanding=function(c){if("destroy"===c)return this.each(function(){var a=b.getExpandingInstance(this);a&&a.destroy()}),this;if("active"===c)return!!this.filter(function(){return!!b.getExpandingInstance(this)}).length;var d=a.extend({},a.expanding.opts,c);return this.filter("textarea").each(function(){var c=this.offsetWidth>0||this.offsetHeight>0,f=b.getExpandingInstance(this);c&&!f?new b(a(this),d):(c||e("ExpandingTextareas: attempt to initialize an invisible textarea. Call expanding() again once it has been inserted into the page and/or is visible."),f&&e("ExpandingTextareas: attempt to initialize a textarea that has already been initialized. Subsequent calls are ignored."))}),this},a(function(){a.expanding.autoInitialize&&a(a.expanding.initialSelector).expanding()})});





/*
 * Global initializations
 */

if($('#js-label-moreoptions').length > 0) {
    $('#js-label-moreoptions').off('click.moreoptionsToggle').on('click.moreoptionsToggle', '.js-container-moreoptions-trigger', function(event) {
        event.preventDefault();
        
        var $this = $(this);
        
        var currentText = $this.text();
        
        if(currentText === 'More Options') {
            currentText = 'Less Options';
            
            $this.text(currentText)
                 .addClass('options-open');
        }
        else {
            currentText = 'More Options';
            
            $this.text(currentText)
                 .removeClass('options-open');
        }
        
        $('#js-container-moreoptions').toggle();
    });
}

if($('input.js-kendo-timepicker').length > 0) {
    $('input.js-kendo-timepicker').each(function() {
        var $this = $(this);
        
        if($this.data('is-duration')) {
            $this.kendoTimePicker({
                format: "HH:mm",
                interval: 5
            });
        }
        else {
            $this.kendoTimePicker();
        }
    });
}

if($('input.js-kendo-datepicker').length > 0) {
    $('input.js-kendo-datepicker').kendoDatePicker();
}

if($('textarea.js-transform-formexpand').length > 0) {
    $('textarea.js-transform-formexpand').expanding();
}

if($('.js-initial-hide').length > 0) {
    $('.js-initial-hide').hide();
}

if($('.js-dropdowntree-target').length > 0) {
    $('.js-dropdowntree-target').each(function() {
        var $currentDropdownTreeSelectTarget = $(this);

        $currentDropdownTreeSelectTarget.find('.js-menu-inactive').on('click.preventInactiveEvents', function(event) {
            event.stopImmediatePropagation();
            event.preventDefault();
        });

        var $currentDropdownMenu = $currentDropdownTreeSelectTarget.find('.dropdown-menu');

        $currentDropdownTreeSelectTarget.on('click.scrollToItem', '.dropdown-toggle', function(event) {
            event.preventDefault();
            
            var activeValueType = $currentDropdownTreeSelectTarget.data('active-value-type');

            $currentDropdownMenu.css('width', $currentDropdownTreeSelectTarget.width() + 'px');

            if(activeValueType !== undefined) {
                setTimeout(function() {
                    var targetScrollTop = $currentDropdownMenu.scrollTop(0)
                                                              .find('a')
                                                              .filter('[data-corresponding-value-type="' + activeValueType + '"]')
                                                              .first()
                                                              .closest('li.js-administration-dropdowntree-group')
                                                              .position()
                                                              .top;

                    $currentDropdownTreeSelectTarget.find('.dropdown-menu').scrollTop(targetScrollTop);
                }, 1);
            }
        }).on('click.chooseNewItem', '.dropdown-menu a', function(event) {
            event.preventDefault();
            
            var $this = $(this);



            function generateValueTypeLabel($whichLink) {
                var currentText = $whichLink.text();

                if(currentText === '') {
                    return '' + currentText + '';
                }
                else {
                    return generateValueTypeLabel($whichLink.closest('ul').siblings('a').not('.dropdown-toggle')) + '' + currentText + '';
                }
            }

            var typeName = generateValueTypeLabel($this);



            $this.closest('.dropdown')
                 .children('.dropdown-toggle')
                 .children('.js-administration-dropdowntree-select-display')
                 .text(typeName)
                 .data('selected-value-type', {
                     type: typeName
                 });

            var addNewValueSelected = parseInt($this.data('corresponding-value-type'));

            $currentDropdownTreeSelectTarget.data('active-value-type', addNewValueSelected);
        });
    });
}
