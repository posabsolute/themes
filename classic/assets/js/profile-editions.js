/* eslint-disable */
$.fn.editionSizing = function() {
	/**
     * adjust heights for one group
	 * @param $els - the arrays of similar containers
	 * @param multiPerRow - whether there are multiple elements per row
     * (on small viewports we do not need to adjust heights)
	 */
	var adjustGroupHeights = function($els, multiPerRow) {
        var height = 0;
        // first find tallest element's height
        $els.each(function() {
            // pre-reset to account for window resizing
            // and to reset for small viewports
            $(this).height('auto');
            height = Math.max($(this).height(), height);
        });
        if (multiPerRow) {
            // then set heights to the tallest
            $els.each(function() {
                $(this).height(`${height}px`);
            });
        }
    };
	/**
     * adjust all inner containers
	 * @param $container - the outer wrapper
	 */
    var adjustAllHeights = function($container) {
        var $boxes = $container.find('.js-edition-box');
        var multiPerRow = $boxes.length > 1 && $($boxes[0]).position().top === $($boxes[1]).position().top;

        adjustGroupHeights($container.find('.js-edition-header'), multiPerRow);
        adjustGroupHeights($container.find('.js-edition-prices'), multiPerRow);
    };
    return this.each(function() {
        var $container = $(this);
        adjustAllHeights($container);
        window.addEventListener('resize', function() {
            adjustAllHeights($container);
        });
    })
};

$.fn.editionBulletsToggle = function() {
    return this.each(function() {
        var toggleSelector = '.js-edition-bullets-toggle';
        var $container = $(this);
        if ($container.find(toggleSelector).length) {
            $container.on('click', toggleSelector, function() {
                $container.toggleClass('toggled');
            });
        }
    })
};
