/* eslint-disable */

$.fn.toggleMore = function() {
    return this.each(function() {
        var $container = $(this);
        $container.on('click', '.js-toggle-trigger', function(e) {
            e.preventDefault();
            $container.toggleClass('toggled');
        });
    })
};

$.fn.fixedHeader = function(options) {
    return this.each(function() {
        var $header = $(this);
        var $container = $(options.container);
        window.setTimeout( function() {
            var headerPos = $header.offset().top;
            var headerSize = $header.height();
            $(window).on("scroll", function() {
                if ($(window).scrollTop() > headerPos) {
                    $container.css('marginTop', headerSize)
                    $header.addClass('is-fixed')
                } else {
                    $container.css('marginTop', 0)
                    $header.removeClass('is-fixed')
                }
            })
        }, 1000)
    })
};

$.fn.dropDown = function (options) {
    return this.each(function () {
        var $button = $(this);

        var $container = $button.parent();
        var $menu = $container.find('.context_menu--menu');

        $('html').click(function () {
            $menu.addClass('is-hidden');
        });

        $button.on("click", function () {
            $menu.toggleClass('is-hidden');
            event.stopPropagation();
        })
    })
};

$.fn.dropDownFilter = function (options) {
    return this.each(function () {
        var $select = $(this);
        var $text = $select.parent().find('.js-dropdown-placeholder');

        $select.on("change", function () {
            $text.html($select.find("option:selected").text());
        })
    })
};

$.fn.enableComments = function (options) {
    return this.each(function () {
        var $mainContainer = $(this);

        $mainContainer.on("click", ".js-comment-show", function () {
            var $container = $(this).closest(".js-slat");
            var $show = $container.find(".js-comment-show");
            var $hide = $container.find(".js-comment-hide");
            var $content = $container.find('.js-comments');

            $show.addClass("is-hidden");
            $hide.before($show);
            $hide.removeClass("is-hidden");
            $content.removeClass("is-hidden");
        });

        $mainContainer.on("click", ".js-comment-hide", function () {
            var $container = $(this).closest(".js-slat");
            var $show = $container.find(".js-comment-show");
            var $hide = $container.find(".js-comment-hide");
            var $content = $container.find('.js-comments');

            $hide.addClass("is-hidden");
            $show.before($hide);
            $show.removeClass("is-hidden");
            $content.addClass("is-hidden");
        });
    })
};

$.fn.enablePaginationArrows = function (options) {
    return this.each(function () {
        var $container = $(this);
        var isFirstPageActive =  $container.find("li").first().hasClass("active");
        var isLastPageActive = $container.find("li").last().hasClass("active");

        $container.prepend('<a class="icon__angle_left pagination--button pagination--button__prev"></a>')
        $container.append('<a class="icon__angle_right pagination--button pagination--button__next "></a>')

        $container.find(".pagination--button__prev").on("click", function() {
            $container.find(".active").prev("li").click();
            $container.enablePaginationArrows();
        })
        $container.find(".pagination--button__next").on("click", function() {
            $(".pagination .active").next("li").click();
            $container.enablePaginationArrows();
        })
        if(isFirstPageActive) {
            $container.find(".pagination--button__prev").addClass("is-disabled");
        }
        if(isLastPageActive) {
            $container.find(".pagination--button__next").addClass("is-disabled");
        }

        $container.find("li").on("click", function() {
            $container.enablePaginationArrows();
        })
    })
};