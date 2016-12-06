(function ($, location) {
    //User log out part
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

    //Create new item part
    var myNewItemForm = $("#new-item-form"),
        newItemNameInput = $("#new-item-name"),
        newItemClassifyInput = document.getElementById("new-item-classify"),
        newItemPriceInput = $("#new-item-price"),
        newItemDescriptionInput = $("#new-item-description");

    var formAlert = $("#form-alert");

    myNewItemForm.submit(function (event) {
        event.preventDefault();

        formAlert.addClass('hidden');
        formAlert.text('');

        var newItemName = newItemNameInput.val();
        var newItemPrice = newItemPriceInput.val();
        var newItemDescription = newItemDescriptionInput.val();
        //"change" based on server configuration
        /*var newItemClassify = newItemClassifyInput.change(function(){
            return this.value;
        });*/
        var newItemClassify = newItemClassifyInput.value;

        console.log(newItemName + " " + newItemPrice + " " + newItemDescription + " " + newItemClassify);

        if (!newItemName) {
            formAlert.text('You must provide a Item Name');
            formAlert.removeClass('hidden');
            return;
        }

        if (!newItemClassify) {
            formAlert.text('You must provide a Item Classify');
            formAlert.removeClass('hidden');
            return;
        }

        if (!newItemPrice) {
            formAlert.text('You must provide a Item Price');
            formAlert.removeClass('hidden');
            return;
        }

        if (!newItemDescription) {
            formAlert.text('You must provide a Item Description');
            formAlert.removeClass('hidden');
            return;
        }

        if (newItemName && newItemClassify && newItemPrice && newItemDescription) {
            var requestConfig = {
                method: "POST",
                url: '/api/newItem',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: newItemName,
                    classify: newItemClassify,
                    price: newItemPrice,
                    description: newItemDescription,
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