//const todoData = require(".../data");

(function($, location) {
    // Let's start writing AJAX calls!
    var UserCreateForm = $("#create-user-form"),
        UsernameInput = $("#newUser-name"),
        PasswordInput = $("#newUser-password"),
        EmailInput = $("#newUser-email"),
        FullNameInput = $("#newUser-fullname")
    
    var formAlert = $("#form-alert");

    UserCreateForm.submit(function(event) {
        event.preventDefault();

        formAlert.addClass('hidden');
        formAlert.text('');

        var userName = UsernameInput.val();
        var passWord = PasswordInput.val();
        var email = EmailInput.val();
        var fullname = FullNameInput.val();

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
        if(!email){
            formAlert.text('You must provide a email');
            formAlert.removeClass('hidden');
            return;
        }
        if(!fullname){
            formAlert.text('You must provide a full name');
            formAlert.removeClass('hidden');
            return;
        }

        if (userName && passWord && email && fullname) {
            var requestConfig = {
                method: "POST",
                url: '/api/create-user',
                //url: '/create-user',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: userName,
                    password: passWord,
                    email: email,
                    fullname: fullname,
                    testField: 12,
                    testBool: true
                })
            };

            $.ajax(requestConfig).then(function(responseMessage) {
                console.log("run in ajax")
                console.log(responseMessage.success);

                if(responseMessage.success) {
                    location.href = responseMessage.pageurl;
                } else {
                    formAlert.text(responseMessage.message);
                    formAlert.removeClass('hidden');
                }
                
                
            });
        }
    });
})(window.jQuery, window.location);
