const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require("../data");
const userData = data.users;
const itemData = data.items;
const apartmentData = data.apartments;
const commentData = data.comments;

router.post("/comment", function (req, res) {
    console.log(req.body);
    console.log(req.user);
    return commentData.addCommentToType(req.user._id, xss(req.body.comment), req.body.typeId, req.body.type).then(() => {
        if(req.body.type == "item"){
            pageurl = '/items/' + req.body.typeId
        } else if(req.body.type == "apartment"){
            pageurl = '/apartments/' + req.body.typeId
        }
        res.json({
            success: true,
            pageurl: pageurl
        });
    });
});

router.post("/newItem", function (req, res) {
    console.log(req.body);
    console.log(req.user);
    return itemData.addItem(req.user._id, req.body.classify, xss(req.body.name), xss(req.body.price), xss(req.body.description), []).then((newitem) => {
        res.json({
            success: true,
            pageurl: '/items/' + newitem._id
        });
    });
});

router.post("/newApartment", function (req, res) {
    console.log(req.body);
    console.log(req.user);
    return apartmentData.addApartment(req.user._id, req.body.location, xss(req.body.name), xss(req.body.addressDetail), xss(req.body.price), xss(req.body.description), []).then((newapartment) => {
        res.json({
            success: true,
            pageurl: '/apartments/' + newapartment._id
        });
    });
});

router.get("/create-user", function (req, res) {
    return res.json({
        success: true,
        pageurl: '/create-user'
    });
});

router.post("/create-user", function (request, response) {
    userData.getUser(request.body.username).then((uObj) => {
        //console.log(typeof uObj);
        if (typeof uObj !== 'undefined') {
            response.json({
                success: false,
                //pageurl: '/create-user'
                message: 'user already exist, please try other username'
            })
        } else {
            userData.addUser(xss(request.body.username), xss(request.body.password), xss(request.body.email), xss(request.body.fullname)).then((myuser) => {
                console.log(myuser);
                response.json({
                    success: true,
                    pageurl: '/login'
                })
            }).catch((err) => {
                console.log("run in this" + err);
            })
        }
    })
});

module.exports = router;