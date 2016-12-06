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

    //Create new apartment part
    var myNewApartmentForm = $("#new-apartment-form"),
        newApartmentNameInput = $("#new-apartment-name"),
        newApartmentAddressDetailInput = $("#new-apartment-addressdetail"),
        newApartmentLocationInput = document.getElementById("new-apartment-location"),
        newApartmentPriceInput = $("#new-apartment-price"),
        newApartmentDescriptionInput = $("#new-apartment-description");

    var formAlert = $("#form-alert");

    myNewApartmentForm.submit(function (event) {
        event.preventDefault();

        formAlert.addClass('hidden');
        formAlert.text('');

        var newApartmentName = newApartmentNameInput.val();
        var newApartmentAddressDetail = newApartmentAddressDetailInput.val();
        var newApartmentPrice = newApartmentPriceInput.val();
        var newApartmentDescription = newApartmentDescriptionInput.val();
        //"change" based on server configuration
        /*var newItemClassify = newItemClassifyInput.change(function(){
            return this.value;
        });*/
        var newApartmentLocation = newApartmentLocationInput.value;

        console.log(newApartmentName + " " + newApartmentPrice + " " + newApartmentDescription + " " + newApartmentLocation);

        if (!newApartmentName) {
            formAlert.text('You must provide a Apartment Name');
            formAlert.removeClass('hidden');
            return;
        }

        if (!newApartmentLocation) {
            formAlert.text('You must provide a Apartment Location');
            formAlert.removeClass('hidden');
            return;
        }

        if (!newApartmentAddressDetail) {
            formAlert.text('You must provide a Apartment Address Detail');
            formAlert.removeClass('hidden');
            return;
        }

        if (!newApartmentPrice) {
            formAlert.text('You must provide a Apartment Price');
            formAlert.removeClass('hidden');
            return;
        }

        if (!newApartmentDescription) {
            formAlert.text('You must provide a Apartment Description');
            formAlert.removeClass('hidden');
            return;
        }

        if (newApartmentName && newApartmentLocation && newApartmentAddressDetail && newApartmentPrice && newApartmentDescription) {
            var requestConfig = {
                method: "POST",
                url: '/api/newApartment',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: newApartmentName,
                    location: newApartmentLocation,
                    addressDetail: newApartmentAddressDetail,
                    price: newApartmentPrice,
                    description: newApartmentDescription,
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