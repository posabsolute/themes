/* eslint-disable */

$(document).ready(function() {
    $(".js-dropdown-select").dropDownFilter();
    $('.js-toggle-more').toggleMore();
    $.simpleTooltip({ selector: ".tooltip"});
});

$.simpleTooltip = function(options) {
    $(document).on("mouseover", options.selector, function(){
        var $tooltip = $(this).find(".js-simple-tooltip");
        var tooltipWidth = $tooltip.outerWidth();
        var marginLeft = (-1) * tooltipWidth / 2;

        $tooltip.css({ "margin-left": marginLeft });
    })
};
