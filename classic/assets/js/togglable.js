/* eslint-disable */

$.fn.togglable = function(key) {
    return this.each(function() {
        var $container = $(this);
        var toggleClass = `js-${key}-toggle`;
        var contentClass = `js-${key}-content`;
        var prevBtnClass = `js-${key}-prev`;
        var nextBtnClass = `js-${key}-next`;

        // click on a togglable entry in the left menu
        $container.on('click', `.${toggleClass}`, function(e) {
            e.preventDefault();

            var $selectedItem = $container.find(`.${toggleClass}.selected`);
            var selectedItemId = $selectedItem ? $selectedItem.data('id') : '';

            var $element = $(this);
            var elementId = $element.data('id');

            // do nothing if this is the currently selected item
            if (elementId === selectedItemId) {
                return;
            }

            // deselect old item
            $selectedItem.removeClass('selected');
            $container.find(`.${contentClass}[data-id=${selectedItemId}]`).removeClass('selected');

            // select new item
            $element.addClass('selected');
            $container.find(`.${contentClass}[data-id=${elementId}]`).addClass('selected');
        });

        if ($container.find(`.${prevBtnClass}`).length) {
            // click on the "previous" button
            $container.on('click', `.${prevBtnClass}`, function() {
                var $selectedItem = $container.find(`.${toggleClass}.selected`);
                var $prevItem = $selectedItem.parent().prev();

                // if this is the first item, we need to wrap around to the last
                if (!$prevItem.length) {
                    $prevItem = $selectedItem.parent().siblings().last();
                }

                // if we do have an entry, toggle it
                if ($prevItem.length) {
                    $prevItem.find(`.${toggleClass}`).click();
                }
            });
        }

        if ($container.find(`.${nextBtnClass}`).length) {
            // click on the "next" button
            $container.on('click', `.${nextBtnClass}`, function() {
                var $selectedItem = $container.find(`.${toggleClass}.selected`);
                var $nextItem = $selectedItem.parent().next();

                // if this is the last item, we need to wrap around to the first
                if (!$nextItem.length) {
                    $nextItem = $selectedItem.parent().siblings().first();
                }

                // if we do have an entry, toggle it
                if ($nextItem.length) {
                    $nextItem.find(`.${toggleClass}`).click();
                }
            });
        }
    })
};
