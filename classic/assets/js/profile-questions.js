/* eslint-disable */
$.fn.profileQuestions = function(options) {
    var i18n = {};
    var questions = [];
    var API = {};
    var Notification = {};
    var mainEndpoint = "";

    // helper function to update in number of answers to each question
    var updateQuestionNumberOfAnswers = function() {
        $('[data-question-id]').each(function() {
            var commentsNumber = $(this).find('[data-comment-id]').length;

            var $show = $(this).find(".js-comment-show.caption-element");
            var $hide = $(this).find(".js-comment-hide.caption-element");

            var showStr = $show.text().replace(/[0-9]+/g, commentsNumber);
            var hideStr = $hide.text().replace(/[0-9]+/g, commentsNumber);
            $show.html(showStr);
            $hide.html(hideStr);

            if(commentsNumber === 0) {
                $show.addClass('is-hidden');
                $hide.addClass('is-hidden');
            } else if($show.hasClass('is-hidden') && $hide.hasClass('is-hidden')) {
                // if number of answers moved from 0 to 1 (otherwise, just leave as it was,
                // so app doesn't need to figured out if the answers listening was open or collapsed)
                $show.removeClass('is-hidden');
            }
        });
    }

    // helper function to update # of results and # of questions on top of the list
    var updateQuestionNumbers = function(questions) {
        var results = questions.matchingItems.length;
        var resultsStr = $(".js-nbResults").text().replace(/[0-9]+/g, results);
        $(".js-nbResults").html(resultsStr);

        var nbQuestions = questions.items.length;
        var nbQuestionsStr = $(".js-nbQuestions").text().replace(/[0-9]+/g, nbQuestions);
        $(".js-nbQuestions").html(nbQuestionsStr);

        $(".pagination").enablePaginationArrows();
        if (results <= 6) {
            $(".js-pager").hide();
        } else {
            $(".js-pager").show();
        }
    }

    var setUIHandlers = function() {
        // set handler on modal to close it (useful for 'Cancel' button or 'X' in the corner)
        $('.modal button[rel="modal:close"]').on("click", function() {
            $.modal.close();
        });
    }

    var initSearchFeature = function() {
        // fuzzy search:
        $(".js-input-search-question").on("focus blur", function() {
            $(this).closest(".search_field").toggleClass('is-focused');
        });
        $(".js-submit-question").on("click", function() {
            var searchData = $(".js-input-search-question").val();
            questions.search(searchData);
        })
        $(".js-input-search-question").on("keyup", function(e) {
            var searchData = $(this).val();
            if (e.which == 13) {
                questions.search(searchData);
                return false;
            }
            if (searchData === "") {
                questions.search(searchData);
            }
        });
    }

    var initAskQuestionFeature = function() {
        $(".js-profile-ask-question").on("click", function(e) {
            var $container = $("#ask-question-form-modal");
            var QuestionForm = $("#ask-question-form-modal").find(".js-profile-question-form").formCtrl();
            QuestionForm.clear();
            $container
                .find('button[rel="modal:submit"]')
                .off("click.ask-question")
                .on("click.ask-question", function() {
                    if  (QuestionForm.validate()) {;
                        API.post(
                            mainEndpoint,
                            JSON.stringify(QuestionForm.getData()),
                            function() {
                                Notification.success(i18n.messages.success.postQuestion, true);
                            },
                            function() {
                                Notification.error(i18n.messages.error.postQuestion, true);
                            }
                        );
                        $.modal.close();
                    }
                });

            $container.modal({
                fadeDuration: 100
            });
        });
    }

    var initEditQuestionFeature = function() {
        $(".js-menu-edit").on("click", function(e) {
            var $questionContainer = $(this).closest("[data-question-id]");
            var QuestionEditForm = $questionContainer.find(".js-profile-question-form").formCtrl();
            var $editContainer = $questionContainer.find('.js-profile-edit-question');

            if ($editContainer.hasClass('is-hidden')) {
                $editContainer.removeClass('is-hidden');

                $editContainer
                    .find('button[rel="edit:submit"]')
                    .off("click.edit-question")
                    .on("click.edit-question", function() {
                        var endpoint = $questionContainer.data("endpoint");
                        if (QuestionEditForm.validate()) {;
                            API.put(
                                endpoint,
                                JSON.stringify(QuestionEditForm.getData()),
                                function() {
                                    Notification.success(i18n.messages.success.postQuestion, true);
                                },
                                function() {
                                    Notification.error(i18n.messages.error.postQuestion, true);
                                }
                            );
                            $editContainer.addClass('is-hidden');
                            window.scroll({
                                top: 0,
                                behavior: "smooth"
                              });
                        }
                    });
                $editContainer
                    .find('button[rel="edit:cancel"]')
                    .off("click.edit-question")
                    .on("click.edit-question", function() {
                        var titleOrigin = $questionContainer.find('.slat--content .question-title').html();
                        var commentOrigin = $questionContainer.find('.slat--content .question-comment').html();
                        $editContainer.find('input[name="title"]').val(titleOrigin);
                        $editContainer.find('textarea[name="comment"]').val(commentOrigin);
                        $editContainer.addClass('is-hidden');
                    });
            } else {
                $editContainer.addClass('is-hidden');
            }
        });
    }

    var initDeleteQuestionOrAnswerFeature = function() {
        // set handler on delete question action
        $(".js-menu-delete").on("click", function(e) {
            var $questionContainer = $(this).closest("[data-question-id]");
            var questionId = $questionContainer.data("question-id");
            var $container = $("#delete-question-confirmation");

            $container
                .find('button[rel="modal:confirm"]')
                .off("click.delete-question")
                .on("click.delete-question", function() {
                    // set temporary handler on the popup's confirmation button
                    var $questionContainer = $(`[data-question-id=${questionId}]`);
                    var endpoint = $questionContainer.data("endpoint");
                    API.delete(
                        endpoint,
                        {},
                        function() {
                            questions.remove('question-id', questionId);
                            $questionContainer.remove();
                            updateQuestionNumbers(questions);
                            Notification.success(i18n.messages.success.deleteQuestion, true);
                        },
                        function() {
                            Notification.error(i18n.messages.error.deleteQuestion, true);
                        }
                    );
                    $.modal.close();
                });

            $container.modal({
                fadeDuration: 100
            });
        });

        // set handler on delete comment (answer) action
        $(".js-menu-delete-comment").on("click", function(e) {
            var $commentContainer = $(this).closest("[data-comment-id]");
            var commentId = $commentContainer.data("comment-id");
            var $container = $("#delete-answer-confirmation");

            $container
                .find('button[rel="modal:confirm"]')
                .off("click.delete-answer")
                .on('click.delete-answer', function() {
                    // set temporary handler on the popup's confirmation button
                    var $commentContainer = $(`[data-comment-id=${commentId}]`);
                    var endpoint = $commentContainer.data("endpoint");
                    API.delete(
                        endpoint,
                        {},
                        function() {
                            $commentContainer.remove();
                            updateQuestionNumberOfAnswers();
                            Notification.success(i18n.messages.success.deleteAnswer, true);
                        },
                        function() {
                            Notification.error(i18n.messages.error.deleteAnswer, true);
                        }
                    );
                    $.modal.close();
                });
            $container.modal({
                fadeDuration: 100
            });
        });
    }

    var mapQuestions = function() {
        // define options, question-id is considered as unique id when application is removing item
        var questionListOptions = {
            valueNames: [  { data: ['question-id'] }, "question-title", "question-comment"],
        }
        if ($(".js-slat").length > 6) {
            questionListOptions.page = 6;
            questionListOptions.pagination = {
                innerWindow: 100
            };
        }
        questions = new List("customer-questions-container", questionListOptions);
        // update numbers when search complete
        questions.on("searchComplete", updateQuestionNumbers);
    }

    var init = function() {
        i18n = !!options && !!options.i18n ? JSON.parse(options.i18n) : {};
        mainEndpoint = !!options && !!options.endpoint ? options.endpoint : "";

        API = new ActionAPI();
        Notification = $(".js-notification").notificationCtrl();

        setUIHandlers();
        initAskQuestionFeature();

        if ($(".js-slat").length >= 1) {
            initSearchFeature();
            initEditQuestionFeature();
            initDeleteQuestionOrAnswerFeature();
            mapQuestions();
            $(".pagination").enablePaginationArrows();
            $(".js-question-container").enableComments();
        }
    }
    init();
}
