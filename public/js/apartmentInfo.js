(function ($, location) {
    //User log out 
    var userLogout = $("#user-log-out");

    userLogout.click(function () {
        console.log("Click the user logout button");
        var requestConfig = {
            method: "GET",
            url: '/logout',
            contentType: 'application/json',
            data: JSON.stringify({
                testField: 12,
                testBool: true
            })
        };
        $.ajax(requestConfig).then(function(res){
            console.log(res);
            location.href = res.pageurl;
        });
    });

    //publish new comment
    var myNewCommentForm = $("#new-comment-form"),
        CommentApartmentId = $("#apartment-id"),
        newCommentInput = $("#new-apartment-comment");

    var formAlert = $("#form-alert");

    myNewCommentForm.submit(function (event) {
        event.preventDefault();

        formAlert.addClass('hidden');
        formAlert.text('');

        var newComment = newCommentInput.val();
        //with nodeType == 3, which are text nodes
        var ApartmentId = CommentApartmentId.first().contents().filter(function(){
            return this.nodeType == 3;
        }).text();

        if (!newComment) {
            formAlert.text('You must provide a Apartment Comment');
            formAlert.removeClass('hidden');
            return;
        }

        if (newComment) {
            var requestConfig = {
                method: "POST",
                url: '/api/comment',
                contentType: 'application/json',
                data: JSON.stringify({
                    comment: newComment,
                    type: "apartment",
                    typeId: ApartmentId,
                    testField: 12,
                    testBool: true
                })
            };

            $.ajax(requestConfig).then(function (responseMessage) {
                console.log(responseMessage);
                location.href = responseMessage.pageurl;
            });
        }
    });
})(window.jQuery, window.location);