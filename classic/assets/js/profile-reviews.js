/* eslint-disable */
$.fn.profileReviews = function(options) {
    var i18n = {};
    var reviews = [];
    var API = {};
    var Notification = {};
    var mainEndpoint = "";

    var setUIHandlers = function() {
        // set handler on modal to close it (useful for 'Cancel' button or 'X' in the corner)
        $('.modal button[rel="modal:close"]').on("click", function() {
            $.modal.close();
            $('.js-rating-details').addClass('is-hidden');
        });
    };

    var initWriteReviewFeature = function() {
        $(".js-profile-write-review").on("click", function(e) {
            var $container = $("#ask-review-form-modal");
            ReviewForm.clear();
            $container
                .find('button[rel="modal:submit"]')
                .off("click.write-review")
                .on("click.write-review", function() {
                    if (ReviewForm.validate()) {
                        API.post(
                            mainEndpoint,
                            JSON.stringify(ReviewForm.getData()),
                            function() {
                                Notification.success(i18n.writeReviewSuccessMessage, true);
                            },
                            function() {
                                Notification.error(i18n.writeReviewErrorMessage, true);
                            }
                        );
                        $('.js-rating-details').addClass('is-hidden');
                        $.modal.close();
                    }
                });

            $container.modal({
                fadeDuration: 100
            });
        });
    };

    var mapReviews = function() {
        // define options, review-id is considered as unique id when application is removing item
        reviews = new List('customer-reviews-container', {
            valueNames: ['review-title'],
            page: 6,
            pagination: {
                innerWindow: 100
            }
        });
    };

    var init = function() {
        i18n = !!options && !!options.i18n ? JSON.parse(options.i18n) : {};
        mainEndpoint = !!options && !!options.endpoint ? options.endpoint : "";

        API = new ActionAPI();
        Notification = $('.js-notification').notificationCtrl();
        ReviewForm = $('#js-profile-review-form').formCtrl();

        setUIHandlers();
        initWriteReviewFeature();

        if ($(".js-slat").length > 6) {
            mapReviews();
            $(".pagination").enablePaginationArrows();
        }
        $(".js-review-container").enableComments();
        $(".js-rating-input").ratingFeature();
    };
    init();
};
