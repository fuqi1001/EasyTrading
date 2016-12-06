const express = require('express');
const router = express.Router();
const data = require("../data");
const apartmentData = data.apartments;
const userData = data.users;
const locationData = data.locations;

// define a middleware function to be used for every secured routes
var isLogIn = function (req, res, next) {
    console.log(req.session);
    if (req.isAuthenticated()) { //if user is authenticated in the session, carry on
        return next();
    }
    res.redirect('/login'); //if they aren't, redirect them to the login page
};

router.get("/:id", isLogIn, (req, res) => {
    return apartmentData.getApartmentById(req.params.id).then((apartment) => {
        return userData.getUserById(apartment.createrid).then((creater) => {
            return locationData.getLocation(apartment.locationid).then((location)=>{
                return res.render("apartmentInfo", { myapartment: apartment, creater: creater.userName, location: location.name, partial: "apartmentInfo-scripts" });
            });
        });
    });
});

router.get("/", isLogIn, (req, res) => {
    return apartmentData.getAllApartments().then((apartmentList)=>{
        return locationData.getAllLocations().then((locationList)=>{
            return apartmentData.getApartmentByLocationId('1').then((lo1) => {
                return apartmentData.getApartmentByLocationId('2').then((lo2) => {
                    return apartmentData.getApartmentByLocationId('3').then((lo3) => {
                        return apartmentData.getApartmentByLocationId('4').then((lo4) => {
                            return apartmentData.getApartmentByLocationId('5').then((lo5) => {
                                // console.log(class1);
                                // console.log(lo1);
                                // console.log(lo2);
                                // console.log(lo3);
                                // console.log(lo4);
                                // console.log(lo5);
                                return res.render("apartmentList", {loc1: lo1, loc2: lo2, loc3: lo3, loc4: lo4, loc5: lo5,myapartment: apartmentList, mylocation: locationList, partial: "apartmentList-scripts" });
                            })
                        })
                    })
                })
            })
        });
    });
});

module.exports = router;