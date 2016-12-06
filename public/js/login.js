//const todoData = require(".../data");

(function($, location) {
    var createUser = $("#create-user");

    createUser.click(function () {
        console.log("Click Create User button");
        var requestConfig = {
            method: "GET",
            url: '/api/create-user',
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

    //user login part
    var LoginForm = $("#login-form"),
        UserInput = $("#user-name"),
        PasswordInput = $("#user-password");
    
    var formAlert = $("#form-alert");

    LoginForm.submit(function(event) {
        event.preventDefault();

        formAlert.addClass('hidden');
        formAlert.text('');

        var userName = UserInput.val();
        var passWord = PasswordInput.val();

        if(!userName){
            formAlert.text('You must provide a user name');
            formAlert.removeClass('hidden');
            return;
        }

        if(!passWord){
            formAlert.text('You must provide a password');
            formAlert.removeClass('hidden');
            return;
        }
        if (userName && passWord) {
            var requestConfig = {
                method: "POST",
                //url: '/api/todo',
                url: '/login',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: userName,
                    password: passWord,
                    testField: 12,
                    testBool: true
                })
            };

            $.ajax(requestConfig).then(function(responseMessage) {
                console.log(responseMessage);
                if(responseMessage.success) {
                    location.href = responseMessage.pageurl;
                } else {
                    //alert(responseMessage.message);
                    formAlert.text("Wrong username or password");
                    formAlert.removeClass('hidden');
                }
            });
        }
    });
})(window.jQuery, window.location);
